#!/usr/bin/env python3
"""
High-accuracy PDF Exam Extractor for Vietnamese Chemistry / Science Exams.
Extracts text with intelligent line-break normalization and high-resolution images as compressed Base64 Data URIs.
Inserts placeholders [HÌNH_ẢNH: IMAGE_PAGE_X_Y] into text at the corresponding image positions.
"""

import sys
import os
import json
import io
import base64
import re

def clean_and_merge_lines(text: str) -> str:
    """
    Normalizes fragmented lines from PDF while preserving paragraph breaks,
    list items, and question headers.
    """
    if not text:
        return ""

    raw_lines = [line.strip() for line in text.split("\n")]
    merged_lines = []
    buffer = ""

    header_or_list_pattern = re.compile(
        r"^(PHẦN\s+[IVXLCDM]+|CÂU\s+\d+|Câu\s+\d+|[A-D]\.|\d+\.|\-|\*|\[HÌNH_ẢNH:|BÀI\s+THI|ĐỀ\s+|KỲ\s+THI|MÔN\s*:|GV\s*:|Giáo\s+viên|Thời\s+gian|NĂM\s+HỌC|Cho\s+biết|MÃ\s+ĐỀ|Mã\s+đề|Họ\s+và\s+tên|Số\s+báo\s+danh)",
        re.IGNORECASE
    )

    for line in raw_lines:
        if not line:
            if buffer:
                merged_lines.append(buffer)
                buffer = ""
            continue

        if header_or_list_pattern.match(line):
            if buffer:
                merged_lines.append(buffer)
                buffer = ""
            buffer = line
        else:
            if not buffer:
                buffer = line
            else:
                # If buffer ends with punctuation or colon, break line
                if buffer.endswith((":", ".", "?", "!", "===")):
                    merged_lines.append(buffer)
                    buffer = line
                else:
                    # Merge smoothly with a space
                    buffer += " " + line

    if buffer:
        merged_lines.append(buffer)

    return "\n\n".join(merged_lines)


def compress_image_to_base64(image_bytes: bytes, max_width: int = 1000) -> str:
    """
    Resizes image to max_width and converts to optimized PNG Base64 Data URI.
    """
    try:
        from PIL import Image
        img = Image.open(io.BytesIO(image_bytes))

        # Convert palette/CMYK to RGB/RGBA
        if img.mode in ("P", "CMYK"):
            img = img.convert("RGB")

        # Resize if width exceeds max_width
        if img.width > max_width:
            ratio = max_width / float(img.width)
            new_height = int(float(img.height) * ratio)
            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)

        out_buffer = io.BytesIO()
        img.save(out_buffer, format="PNG", optimize=True)
        encoded = base64.b64encode(out_buffer.getvalue()).decode("utf-8")
        return f"data:image/png;base64,{encoded}"
    except Exception:
        # Fallback to direct base64 encoding if PIL fails
        encoded = base64.b64encode(image_bytes).decode("utf-8")
        return f"data:image/png;base64,{encoded}"


def extract_with_pymupdf(pdf_path: str):
    import pymupdf

    doc = pymupdf.open(pdf_path)
    pages_result = []
    all_images_map = {}

    for page_idx in range(len(doc)):
        page = doc[page_idx]
        page_num = page_idx + 1

        blocks = page.get_text("blocks")
        content_items = []

        for b in blocks:
            if b[6] == 0:  # Text block
                block_text = b[4].strip()
                if block_text:
                    content_items.append({
                        "type": "text",
                        "y0": b[1],
                        "x0": b[0],
                        "text": block_text
                    })

        # Collect images on this page
        img_infos = page.get_image_info(xrefs=True)
        img_idx = 1
        processed_xrefs = set()

        for info in img_infos:
            xref = info.get("xref", 0)
            if xref <= 0 or xref in processed_xrefs:
                continue

            bbox = info.get("bbox")
            if not bbox:
                continue

            width = bbox[2] - bbox[0]
            height = bbox[3] - bbox[1]

            # Filter out tiny icon artifacts (e.g. lines, borders < 30px)
            if width < 30 or height < 30:
                continue

            try:
                base_img = doc.extract_image(xref)
                if not base_img or not base_img.get("image"):
                    continue

                processed_xrefs.add(xref)
                img_id = f"IMAGE_PAGE_{page_num}_{img_idx}"
                b64_uri = compress_image_to_base64(base_img["image"])
                all_images_map[img_id] = b64_uri

                content_items.append({
                    "type": "image",
                    "y0": bbox[1],
                    "x0": bbox[0],
                    "text": f"\n\n[HÌNH_ẢNH: {img_id}]\n\n"
                })
                img_idx += 1
            except Exception:
                continue

        # Sort items vertically from top to bottom
        content_items.sort(key=lambda item: (item["y0"], item["x0"]))

        raw_page_text = ""
        for item in content_items:
            if item["type"] == "text":
                raw_page_text += "\n" + item["text"]
            elif item["type"] == "image":
                raw_page_text += item["text"]

        clean_page_text = clean_and_merge_lines(raw_page_text)
        pages_result.append({
            "pageNumber": page_num,
            "text": clean_page_text
        })

    return {
        "pages": pages_result,
        "images": all_images_map
    }


def extract_with_pdfplumber(pdf_path: str):
    import pdfplumber

    pages_result = []
    all_images_map = {}

    with pdfplumber.open(pdf_path) as pdf:
        for idx, page in enumerate(pdf.pages):
            page_num = idx + 1
            text = page.extract_text() or ""

            img_idx = 1
            images_on_page = page.images or []
            image_placeholders = []

            for img_meta in images_on_page:
                try:
                    stream = img_meta.get("stream")
                    if not stream:
                        continue
                    raw_data = stream.get_data()
                    if not raw_data or len(raw_data) < 500:
                        continue

                    img_id = f"IMAGE_PAGE_{page_num}_{img_idx}"
                    b64_uri = compress_image_to_base64(raw_data)
                    all_images_map[img_id] = b64_uri
                    image_placeholders.append(f"[HÌNH_ẢNH: {img_id}]")
                    img_idx += 1
                except Exception:
                    continue

            cleaned_text = clean_and_merge_lines(text)
            if image_placeholders:
                cleaned_text += "\n\n" + "\n\n".join(image_placeholders)

            pages_result.append({
                "pageNumber": page_num,
                "text": cleaned_text
            })

    return {
        "pages": pages_result,
        "images": all_images_map
    }


def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing PDF path argument"}))
        sys.exit(1)

    pdf_path = sys.argv[1]
    if not os.path.exists(pdf_path):
        print(json.dumps({"error": f"File not found: {pdf_path}"}))
        sys.exit(1)

    # Priority: PyMuPDF -> pdfplumber
    try:
        result = extract_with_pymupdf(pdf_path)
        print(json.dumps(result))
        return
    except ImportError:
        pass
    except Exception as e:
        sys.stderr.write(f"PyMuPDF failed, falling back: {e}\n")

    try:
        result = extract_with_pdfplumber(pdf_path)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": f"Extraction failed: {str(e)}"}))
        sys.exit(1)


if __name__ == "__main__":
    main()
