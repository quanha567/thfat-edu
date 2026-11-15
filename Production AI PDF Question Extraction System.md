# Production AI PDF Question Extraction System

_Research report for Vietnamese Chemistry exam digitization. Prepared 12 Nov 2026. Author: Claude (Anthropic). Anthropic models are among those assessed, so weigh the evidence, not my ranking._

**Evidence labels.** **\[V\]** vendor or official doc, **\[T\]** third-party article or aggregator, **\[B\]** peer-reviewed or arXiv benchmark, **\[R\]** my recommendation or assumption, **\[?\]** not verified. I ran no benchmark of my own: every accuracy number below is someone else's, and the Section 9 matrix is deliberately empty until you measure it.

---

## 1. Bottom line

1. **Do not rely on one multimodal LLM reading the whole PDF.** VLMs read Vietnamese text well but not perfectly: mean CER about 6.6% and WER about 9.3% on embedded Vietnamese text across five proprietary VLMs **\[B\]** ([VMMU, arXiv 2508.13680](https://arxiv.org/abs/2508.13680v4)). That benchmark covers mixed multimodal images and older models, so treat it as a ceiling on caution, not a measurement of your PDFs. Still, an exam bank cannot accept silent errors in a chemical subscript or a Vietnamese tone mark.
2. **Recommended: a lean hybrid (Architecture C).** Render every page to an image, extract the native text layer when it exists, run a layout parser for boxes and crops, then let a multimodal LLM _structure_ (not transcribe) the questions under a strict schema, followed by deterministic verification and human review. **\[R\]**
3. **NVIDIA is not a drop-in answer for Vietnamese.** The Nemotron OCR v2 multilingual model card lists English, Chinese, Japanese, Korean and Russian only **\[V\]** ([HF model card](https://huggingface.co/nvidia/nemotron-ocr-v2/blob/main/README.md)). I found no official Vietnamese support statement for Nemotron Parse v1.2 or 2.0 **\[?\]**. Use NVIDIA as a candidate in the benchmark, not as the default.
4. **PaddleOCR-VL explicitly lists Vietnamese** among 109 languages **\[V\]** ([docs](https://www.paddleocr.ai/latest/en/version3.x/algorithm/PaddleOCR-VL/PaddleOCR-VL.html)). It is the strongest self-hostable first candidate for layout and OCR.
5. **Never convert molecule drawings to SMILES and trust it.** On MolRecBench-Wild (5,029 real structures), every method scored below 42% SMILES accuracy **\[B\]** ([benchmark summary](https://benchmarklist.com/benchmarks/molrecbench_wild/)). Store the cropped image as an asset and link it to the question.
6. **Provider-agnostic from day one.** Models, prices and aliases changed repeatedly in the last six months (Section 2). Put every model behind one interface and pin versions.

---

## 2. Verified landscape (as of 12 Nov 2026)

### 2.1 NVIDIA

| Component                                   | Status and facts                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Use here                          |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| NeMo Retriever Library (formerly NV-Ingest) | Renamed from NV-Ingest; PDF methods: pdfium, pdfium\_hybrid, ocr, nemotron\_parse **\[V\]** ([docs](https://docs.nvidia.com/nemo/retriever/26.3.0/extraction/python-api-reference/)). PyPI release 2026.11.6.dev268 **\[V\]** ([PyPI](https://pypi.org/project/nemo-retriever/2026.11.6.dev268/)). Oriented to RAG ingestion, not question reconstruction.                                                                                                                                          | Optional ingestion/layout stage   |
| Page-elements v3, table-structure v1        | Core NIMs in the 26.08 Helm chart **\[V\]** ([GitHub](https://github.com/NVIDIA/NeMo-Retriever/blob/release/26.08.1/nemo_retriever/helm/README.md))                                                                                                                                                                                                                                                                                                                                                 | Figure/table detection candidates |
| Nemotron OCR v2                             | English + multilingual variants; multilingual covers en, zh, ja, ko, ru; NVIDIA Open Model License **\[V\]**. **No Vietnamese listed.**                                                                                                                                                                                                                                                                                                                                                             | Not for Vietnamese text           |
| Nemotron Parse v1.2                         | 0.9B-class layout parser; bboxes, semantic classes, reading order, tables as LaTeX/HTML/markdown/JSON/CSV **\[V\]** ([HF](https://huggingface.co/nvidia/NVIDIA-Nemotron-Parse-v1.2)). PDF only in the library; dedicated GPU required; unsupported on some GPUs (RTX Pro 6000, B200, H200 NVL) **\[V\]** ([docs](https://docs.nvidia.com/nemo/retriever/26.3.0/extraction/nemoretriever-parse/)). An NGC page carries an end-of-support banner **\[V\]**, so check the lifecycle before committing. | Benchmark candidate               |
| Nemotron Parse 2.0                          | Appeared on Hugging Face 3 Aug 2026 with no announcement; vocabulary expanded for multilingual OCR; all numbers vendor-reported; no NIM or hosted option found **\[T\]** ([OrcaRouter, a router vendor with a commercial interest](https://www.orcarouter.ai/blog/nemotron-parse-2-0-preview)). Vietnamese not stated.                                                                                                                                                                              | Test only if v1.2 fails           |
| VLM options                                 | Nemotron Nano 12B v2 VL and Nemotron 3 Nano Omni 30B appear in blueprints/Helm charts **\[V\]**. Vietnamese quality **\[?\]**                                                                                                                                                                                                                                                                                                                                                                       | Self-hosted fallback candidates   |

**Verdict.** NVIDIA supplies strong building blocks (layout, tables, GPU serving via NIM) but not a complete exam-question extractor: question boundaries, shared contexts and answer-key logic are your code. Which parts run standalone: the models run via Hugging Face weights or vLLM without the full NeMo stack; the NIM containers need NVIDIA GPUs and NGC access.

### 2.2 Other providers

| Provider / model                                                                      | PDF input and limits                                                                                                                                                                                                                  | Price (USD)                                                                                                                                                                    | Notes                                                                                                                      |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| **Anthropic** Claude Sonnet 5.5 (`claude-sonnet-5-5`), Haiku 5.5 (`claude-haiku-5-5`) | Native PDF; 32 MB request, up to 600 pages on 1M-context models, 100 on 200k models **\[V\]** ([docs](https://platform.claude.com/docs/en/build-with-claude/pdf-support.md)). A localized docs page shows 128 MB **\[?\]**; re-check. | Haiku 5.5 from $0.10 in / $0.50 out per MTok **\[V\]**; Sonnet 5.5 $2 / $10 **\[T\]** (output $10 confirmed **\[V\]**)                                                         | Proprietary, cloud (also Bedrock/Vertex). Structured outputs available.                                                    |
| **OpenAI** GPT-6.1 Sol (`gpt-6.1-sol`)                                                | `input_file` PDFs, text plus page images, `detail` setting; 50 MB per file and per request **\[V\]** ([docs](https://developers.openai.com/api/docs/guides/pdf-files))                                                                | $2 / $10 **\[T\]**                                                                                                                                                             | 1.05M context, structured outputs, EU/US residency **\[V\]**                                                               |
| **Google** Gemini 4 Argon (GA 13 Oct 2026), 3.8 Flash, 3.5 Flash-Lite                 | Up to 1,000 PDF pages **\[V\]** ([docs](https://ai.google.dev/gemini-api/docs)); 1M context                                                                                                                                           | 3.8 Flash $0.75 / $3.75 (rising Jan 2027); Argon $2 / $10 until 30 Nov, then $4 / $20 **\[T\]**. One source lists 3.6 Flash at $1.50 / $7.50 against $0.75 elsewhere **\[?\]** | Interactions API is the default interface since June 2026 **\[V\]**                                                        |
| **Mistral** OCR 4 / 4.1                                                               | OCR endpoint, bboxes, block classes, confidence, 170 languages claimed; self-hostable container claimed **\[T\]**                                                                                                                     | $4 / 1,000 pages ($2 batch, $5 with annotations) **\[T\]**; model page shows EUR 3.50 **\[V\]**, so check currency/version                                                     | `mistral-ocr-latest` is a moving alias: pin versions. OlmOCRBench 85.2 and OmniDocBench 93.07 are vendor claims **\[T\]**. |
| Google Document AI, Azure, AWS Textract                                               | Basic OCR about $1.50 / 1,000 pages; Document AI Layout Parser $10 **\[T\]**                                                                                                                                                          |                                                                                                                                                                                | Verify on official pricing pages **\[?\]**. Table/forms tiers cost far more.                                               |
| **Alibaba** Qwen3-VL                                                                  | Open weights, Apache 2.0; OCR in 32 languages (39 per another report); DocVQA 96.5% **\[T\]**                                                                                                                                         | self-host                                                                                                                                                                      | Vietnamese in the OCR set not confirmed **\[?\]**; newer Qwen releases exist **\[?\]**                                     |
| **DeepSeek**                                                                          | DeepSeek-OCR 2 appears in benchmark lists and a chemistry fine-tuning paper **\[B\]**                                                                                                                                                 | self-host                                                                                                                                                                      | Not evaluated further.                                                                                                     |

### 2.3 Parsing and OCR stack

| Tool                                          | Fit for this task                                                                                                                                                                            | Vietnamese              | License note                          |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ------------------------------------- |
| **PaddleOCR-VL** (0.9B VLM plus layout model) | Layout, reading order, tables, formulas; 109 languages **\[V\]**                                                                                                                             | **Listed**              | Check current license **\[?\]**       |
| **MinerU 2.5-Pro** (1.2B)                     | Top-tier OmniDocBench v1.6 base score (95.69) in its own paper **\[B\]** ([arXiv 2604.04771](https://arxiv.org/pdf/2604.04771.pdf)); strong formula handling                                 | Not confirmed **\[?\]** | Apache 2.0 plus extra terms **\[T\]** |
| **Docling** (v2.130.0)                        | Pipeline plus Granite-Docling-258M; MIT **\[T\]**; RapidOCR PP-OCR v6 lists `vi` **\[V\]** ([docs](https://docling-project.github.io/docling/concepts/OCR/))                                 | Via PP-OCR v6           | MIT                                   |
| **Surya / Marker**                            | Layout and OCR; modified OpenRAIL-M model license **\[T\]**                                                                                                                                  | **\[?\]**               | Read the revenue threshold terms      |
| **SenOCR-Vi**                                 | Vietnamese-tuned VLM for the PaddleOCR-VL pipeline: Vietnamese composite 82.83, text 86.7% on a 160-page set **\[T, self-reported\]** ([HF](https://huggingface.co/VietAlphaLabs/SenOCR-Vi)) | **Yes**                 | Apache 2.0                            |
| Tesseract                                     | Supports Vietnamese but weak on diacritics and noise **\[B\]** ([survey](https://arxiv.org/html/2506.05061v1)); ViExam used it only to find the "Câu" markers                                | Yes                     | Apache 2.0                            |
| MolScribe, DECIMER, GTR-Mol-VLM               | Optical chemical structure recognition (OCSR)                                                                                                                                                | n/a                     | Research tools                        |

**Task separation (important).** OCR transcribes pixels; layout analysis finds regions and order; document parsing combines both into markdown/JSON; a VLM interprets; _semantic question extraction_ decides that a region is "Câu 3, statement b". No tool above does the last step for exams. They are complementary in a pipeline (layout + OCR feed a VLM) and competing only within a tier (PaddleOCR-VL vs MinerU vs Docling vs Nemotron Parse).

---

## 3. Architecture comparison

|                       | A. Direct VLM                                                                                                                                            | B. OCR + LLM                                                                              | C. Hybrid (recommended)                                                            |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Flow                  | PDF pages → VLM → JSON                                                                                                                                   | PDF → OCR/layout → markdown → LLM → JSON                                                  | Native text + OCR/layout + crops + page images → VLM structuring → verify → review |
| Strengths             | Simplest; sees figures; fewest moving parts                                                                                                              | Cheap; boxes and reading order are explicit; auditable text                               | Cross-checks text against two sources; keeps provenance; best control of cost      |
| Weaknesses            | Paraphrases silently; CER around 6.6% on Vietnamese embedded text **\[B\]**; no bbox provenance; long outputs can truncate; hallucination hard to detect | Layout errors propagate; LLM never sees the figure; chemistry subscripts lost in markdown | More components; you own the glue                                                  |
| Cost / page           | Lowest build cost, highest per-page token cost for big models                                                                                            | Lowest run cost                                                                           | Mid; cheap parser + small/mid VLM                                                  |
| Hallucination control | Weak                                                                                                                                                     | Medium (LLM only sees text)                                                               | Strongest: verbatim checks against two text sources                                |
| Verdict               | Prototype only                                                                                                                                           | Good for native, text-only PDFs                                                           | Production                                                                         |

There is no public end-to-end benchmark on Vietnamese Chemistry exams. ViExam reports 2,548 Vietnamese multimodal exam questions across seven domains including Chemistry, but it measures answering, not extraction **\[B\]**. The choice above is therefore a reasoned recommendation **\[R\]**, to be confirmed by the Section 9 benchmark.

---

## 4. Recommended pipeline

1. **Ingest and classify.** Validate MIME, magic bytes, size, page count. Per page, detect text-layer quality (glyph count, Vietnamese diacritic ratio, private-use/garbled codepoints). Label each page `native`, `scanned` or `hybrid`.
2. **Always rasterize** every page at 200-300 dpi (WebP/PNG) and store it. Keep original text-layer spans with coordinates (pdfium).
3. **Layout + OCR.** Run PaddleOCR-VL (or the benchmark winner) on all pages; use OCR output for scanned pages and as a cross-check on native pages. Output: typed blocks (text, table, formula, figure, caption) with bboxes and reading order.
4. **Crop assets.** Save figures, molecule drawings, tables and graphs as image files with page and bbox. Tables also get a structured version (HTML/JSON) when parsed, but the image stays.
5. **Question boundary candidates (rules first).** Vietnamese exam anchors are regular: `Câu N.`, `PHẦN I/II/III`, option markers `A. B. C. D.`, statement markers `a) b) c) d)`, `Dùng chung cho câu N đến M` style lead-ins. Regex plus layout cues (indentation, bold, numbering restarts) produce candidate spans.
6. **VLM structuring.** For each section or window of 2-3 pages (overlapping one page), send page images, the OCR/native text, candidate spans and crop IDs. Require schema-constrained JSON in which every text field quotes the source and cites `blockIds`. The model may not produce text that is not present in the inputs.
7. **Deterministic verification** (Section 6): verbatim checks, structure checks, numbering continuity, cross-page stitching, asset reference checks.
8. **Routing.** Auto-accept only if all gates pass; otherwise `REVIEW_REQUIRED` with the exact fields flagged. Reviewers see the page image with boxes beside the extracted JSON.
9. **Persist** with full provenance; version every correction.

### Strategies the brief asks for

- **Boundary detection.** Rules decide anchors; a VLM resolves conflicts; a validator enforces grammar. New question = top-level numbering pattern at block start; subquestion = nested numbering under an open question; statement = `a)`-style under a true/false stem; option = `A.`-style under a multiple-choice stem; shared passage = unnumbered block immediately before a range lead-in or before a question whose stem refers to it ("dựa vào thông tin trên"); explanatory note = text after the last option or in a different style (size, italic) without a number. Rule-based is cheap and traceable but brittle on scans; ML layout classes help; the LLM handles the ambiguous 5-10%. **\[R\]**
- **Context association.** Create a `context` object once, with the page and bbox, and reference it from many questions by `contextId`. Association comes from explicit ranges first, then proximity and reference phrases. Low-confidence links are flagged, never guessed.
- **Cross-page reconstruction.** Process pages in overlapping windows; mark a question `open` if the page ends mid-option or mid-table; stitch by numbering continuity and by checking the next page's first block is not a new number.
- **Visual relationships.** Link by caption ("Hình 1"), by reference in the stem, and by spatial position (figure box directly above/below the stem); store `placement: "stem" | "option" | "context"`.

---

## 5. Data model

Principles: stable IDs; parent-child by ID; raw text separate from normalized; images by asset reference; provenance on everything. Use **Unicode NFC** for Vietnamese. For chemistry store three layers: `raw` (exactly as extracted, e.g. `H₂SO₄`), `norm` (NFC-normalized, same characters), and `latex` using `\ce{H2SO4}` (mhchem) only when derivable without guessing. Never overwrite `raw`.

### Shared definitions

```json
{
  "Text": { "raw": "string", "norm": "string",
            "spans": [{ "start": 0, "end": 5, "kind": "chem|math|unit", "latex": "\\ce{H2SO4}" }] },
  "Provenance": { "page": 3, "bbox": [x0, y0, x1, y1], "blockIds": ["p3.b12"],
                  "method": "native|ocr|vlm", "model": "pinned-model-id" },
  "Confidence": { "ocr": 0.0, "semantic": 0.0, "verbatimMatch": 0.0 },
  "Status": "ok | needs_review | rejected"
}
```

### Examples (abbreviated; every node also carries `prov`, `confidence`, `status`)

**True/False with four statements, shared context**

```json
{
  "id": "ex2026-hoa-01:q:S2:Q3",
  "type": "true_false",
  "number": "3",
  "contextId": "ctx:S2:Q3-4",
  "stem": { "raw": "Câu 3. Cho các phát biểu sau về dung dịch H₂SO₄ loãng:" },
  "statements": [
    {
      "id": "ex2026-hoa-01:q:S2:Q3.a",
      "label": "a",
      "text": { "raw": "Dung dịch làm quỳ tím hóa đỏ." },
      "answer": null
    },
    {
      "id": "ex2026-hoa-01:q:S2:Q3.b",
      "label": "b",
      "text": { "raw": "Phản ứng với Cu(OH)₂ tạo muối và nước." },
      "answer": null
    }
  ],
  "assets": []
}
```

**Multiple choice (single or multiple correct)**

```json
{
  "id": "ex2026-hoa-01:q:S1:Q7",
  "type": "multiple_choice",
  "number": "7",
  "selection": "single",
  "stem": { "raw": "Câu 7. Ion nào sau đây có màu vàng nâu trong dung dịch?" },
  "options": [
    {
      "id": "...:Q7.A",
      "label": "A",
      "text": { "raw": "Fe²⁺", "spans": [{ "kind": "chem", "latex": "\\ce{Fe^{2+}}" }] }
    },
    { "id": "...:Q7.B", "label": "B", "text": { "raw": "Fe³⁺" } }
  ],
  "answerKey": null,
  "assets": ["asset:p2.fig1"]
}
```

**Matching (many-to-many ready)**

```json
{
  "id": "ex2026-hoa-01:q:S3:Q9",
  "type": "matching",
  "number": "9",
  "stem": { "raw": "Câu 9. Ghép chất ở cột I với ứng dụng ở cột II." },
  "left": [{ "id": "...:Q9.L1", "label": "1", "text": { "raw": "NaOH" } }],
  "right": [{ "id": "...:Q9.R1", "label": "a", "text": { "raw": "Sản xuất xà phòng" } }],
  "links": [],
  "cardinality": "one_to_one | one_to_many | many_to_many"
}
```

If the source prints an answer key, `links` holds it with provenance; otherwise `links` stays empty. Never infer.

**Short answer**

```json
{
  "id": "ex2026-hoa-01:q:S4:Q12",
  "type": "short_answer",
  "number": "12",
  "stem": { "raw": "Câu 12. Tính khối lượng (gam) Cu(OH)₂ thu được..." },
  "answerFormat": { "kind": "numeric", "unit": "g", "precision": "as stated in source or null" },
  "answerKey": null
}
```

**Group and context objects.** `group: { id, contextId, memberQuestionIds[], range: "3-4" }`; `context: { id, kind: passage|dataset|experiment|diagram, text?, assets[], prov[] }`, stored once and referenced by ID. Add `subject: "chemistry"` and a `subjectExt` object so Physics/Biology/Math fields (units, vector notation, etc.) extend rather than fork the schema.

### Validation technology

Bun + Elysia already uses TypeBox for its `t` schemas **\[T\]**. Recommendation **\[R\]**: define the schema once in **Zod or TypeBox**, export **JSON Schema** for provider structured outputs, and keep Pydantic only if you run a Python parser sidecar. Provider structured-output modes accept only a subset of JSON Schema; verify keywords (`oneOf`, recursion) per provider **\[?\]**. Store the raw extraction JSON (JSONB) and normalized relational rows (Prisma) separately.

---

## 6. Quality assurance

**Hard rules.** The system never invents missing text, options, images or answer keys. Absent or unreadable → `null` plus `needs_review` with a reason code (`unreadable`, `ambiguous_boundary`, `missing_asset`, `verbatim_mismatch`).

**Deterministic gates**

- _Verbatim check:_ each extracted `raw` string must match the native/OCR text for its block after NFC and whitespace normalization; edit distance above a threshold flags it. This catches LLM paraphrase and tone-mark drift.
- _Dual-source check:_ native text vs OCR text on the same region; disagreement flags it.
- _Structure checks:_ sequential numbering; MCQ has 2+ unique labels; true/false labels contiguous; every `contextId`, `asset` and `parent` resolves; every question has page and bbox.
- _Chemistry lint:_ charge and subscript consistency (e.g., parentheses balanced, no digit-only subscripts mis-split such as `H 2 SO 4`); compare Unicode-script characters with mhchem form.
- _Prompt injection check:_ flag text such as "ignore previous instructions" appearing in documents; the model receives document text as data and has no tools.

**Confidence.** Keep three separate numbers: OCR confidence (engine), verbatim-match score (deterministic), semantic confidence (structure decisions: boundary, association). Do not average them. LLM self-reported confidence is weak evidence; rely on agreement signals (two models, two passes, rules vs model).

**Retry and fallback.** Retry the failing window once with a higher-detail render, then escalate to a stronger model, then to review. Cap attempts to bound cost.

**Metrics.** CER/WER on Vietnamese text (after NFC; also report a diacritic-error rate separately); question detection P/R; boundary exact-match; field-level F1 per type; option exact-match; table cell-level TEDS-style accuracy; formula exact or normalized LaTeX match; image association accuracy; reading-order edit distance; cross-page association accuracy; schema validity rate; and an **unflagged-error rate** (errors that passed all gates) which is the metric that matters most.

**Ground truth.** 40-60 exams, double-annotated by chemistry-literate annotators in the review tool, adjudicated, split into dev/test; include the hard cases in Section 9. **\[R\]**

**Proposed acceptance thresholds \[R, not sourced; calibrate on your data\]**

| Metric                                                 | Auto-accept pipeline target     |
| ------------------------------------------------------ | ------------------------------- |
| Question detection recall / precision                  | ≥ 99% / ≥ 99%                   |
| Option and statement exact-match (after normalization) | ≥ 99%                           |
| Vietnamese text CER (final, after verification)        | ≤ 0.5%                          |
| Unflagged-error rate per exam                          | ≤ 1 per 100 questions           |
| JSON schema validity                                   | 100% (after retry)              |
| Share of questions routed to review                    | ≤ 15% at MVP, falling over time |

---

## 7. Cost, latency, scalability

Billing differs: OCR APIs charge per page; LLMs charge per token **\[T\]**. Page-image token counts vary by provider and resolution, so **measure on your PDFs** before budgeting.

**Illustrative calculation \[R\]**, assuming a 6-page exam, 1,500 input tokens per page with image, about 3,000 text tokens of OCR context, and 6,000 output tokens, with list prices from Section 2.2 and no retries or caching:

| Route                                 | Input tokens | Output tokens | Approx. cost / exam                                   |
| ------------------------------------- | ------------ | ------------- | ----------------------------------------------------- |
| Gemini 3.8 Flash ($0.75 / $3.75)      | 12,000       | 6,000         | about $0.03                                           |
| Claude Sonnet 5.5 ($2 / $10)          | 12,000       | 6,000         | about $0.08                                           |
| Haiku 5.5 ($0.10 / $0.50, "from")     | 12,000       | 6,000         | about $0.005                                          |
| Mistral OCR 4 only ($4 / 1,000 pages) | n/a          | n/a           | about $0.024 ($0.012 batch), plus the structuring LLM |

At these assumptions the LLM bill is cents per exam; **human review time dominates total cost**. Cost control therefore means fewer review minutes, not cheaper tokens.

**Deployment strategies**

| Strategy                        | Stack                                                                      | Pros                                                                                            | Cons                                                                                                                                                                                                  |
| ------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Managed APIs                 | Mistral OCR or Document AI + Claude/Gemini/GPT                             | Fastest start; no GPU ops                                                                       | Data leaves your perimeter; price and alias changes; rate limits                                                                                                                                      |
| 2. Self-hosted                  | PaddleOCR-VL (+ SenOCR-Vi test) on one GPU; open VLM (Qwen3-VL / Nemotron) | Data control; flat cost at volume                                                               | You own serving (vLLM/NIM), GPU memory, upgrades; weaker VLM on Vietnamese multimodal (open VLMs scored 27.7% vs 57.7% for closed on ViExam answering **\[B\]**; extraction differs but expect a gap) |
| 3. Hybrid **\[R recommended\]** | Self-hosted parser for layout/OCR + managed VLM for structuring            | Sensitive page images stay local only if you send text and crops selectively; low GPU footprint | Two operational surfaces                                                                                                                                                                              |

Caching: cache by content hash of the page image plus pipeline version. Batch APIs (50% off at Mistral **\[T\]**, and at other providers **\[?\]**) suit non-urgent bulk uploads.

---

## 8. Production implementation (Bun + Elysia + Postgres + Prisma + S3)

**State machine**

`UPLOADED` (file stored, hash computed) → `QUEUED` (job row created, idempotency key = file hash + pipeline version) → `PROCESSING` (classification, rasterization, parse) → `EXTRACTING` (VLM structuring) → `VALIDATING` (gates) → `REVIEW_REQUIRED` or `COMPLETED` → `PUBLISHED` (reviewed items enter the question bank). `FAILED` is reachable from any state; transient failures retry with backoff, then go to the dead-letter queue; permanent failures (corrupt, encrypted PDF) fail at once with a reason. Track state per page and per question group, not only per document, so one bad page does not restart the exam.

**Queue.** Use a Postgres-backed queue (e.g., pg-boss) to avoid adding Redis, or BullMQ if Redis is acceptable. BullMQ has Elysia plugin examples **\[T\]**; bunqueue is Bun-native with optional Postgres but young **\[T\]**. Check native-addon compatibility under Bun before relying on any Node library **\[T\]**. Run parser/GPU work in separate worker processes; keep Elysia for API and orchestration.

**Provider abstraction (TypeScript)**

```ts
interface PageParser {
  parse(pages: PageImage[], opts): Promise<ParsedPage[]>;
} // blocks, bboxes, crops
interface Structurer {
  extract(input: StructuringInput, schema: JsonSchema): Promise<RawExtraction>;
}
interface ModelInfo {
  id: string;
  version: string;
  maxPages: number;
  maxBytes: number;
  supportsPdf: boolean;
}
```

Implement adapters for NVIDIA NIM (OpenAI-compatible endpoint), Anthropic, OpenAI, Google, and a local vLLM server. Send **page images plus extracted text**, not provider-specific PDF upload, so limits differ only in adapter code (Claude 32 MB/600 pages, OpenAI 50 MB, Gemini 1,000 pages **\[V\]**). Use synchronous calls for interactive single-page re-extraction in the review UI; use asynchronous jobs (and batch APIs) for uploads.

**Infrastructure notes.** S3-compatible storage with private buckets, signed URLs, and per-tenant prefixes; structured logs with `jobId/pageId/model/promptVersion`; OpenTelemetry tracing across API, queue and workers; per-provider rate limiting and concurrency caps; idempotent handlers keyed on `(documentHash, stage, pipelineVersion)`; DLQ with replay; full audit log of every model call (input hashes, output, version) and every human edit.

**Security.** Scan uploads (type sniffing, size/page caps, sandbox PDF rendering in a locked-down container with no network); strip active content; encrypt at rest; retention policy and deletion API; RBAC for reviewers; treat all document text as untrusted: schema-constrained output, no tool access for the extraction model, and never let extracted text alter prompts or system behavior.

---

## 9. Benchmark plan

**Corpus (minimum):** 2 native-text PDFs, 2 scanned PDFs, 1 hybrid; at least one with complex tables, one with molecular structures, one with shared passages, one with questions split across pages; all four question types and group questions; include a two-column layout and a low-quality scan. Use publicly redistributable or licensed exams only, and confirm usage rights **\[?\]**.

**Contenders:** (1) NVIDIA: Nemotron Parse v1.2 (and 2.0 if obtainable) + page-elements + VLM; (2) PaddleOCR-VL (+ SenOCR-Vi) or MinerU + LLM; (3) commercial APIs direct (Claude, Gemini, GPT) as Architecture A; (4) Hybrid C using the best parser and two different structuring models.

**Protocol.** Pin model versions; fix prompts and schema; 3 runs for variance on LLM stages; blind scoring against ground truth; report per question type and per document type; report the unflagged-error rate and review-queue size, not only accuracy.

| Criterion                             | NVIDIA                | OSS OCR + LLM    | Commercial direct | Hybrid           |
| ------------------------------------- | --------------------- | ---------------- | ----------------- | ---------------- |
| Vietnamese OCR (CER, diacritic error) | _measure_             | _measure_        | _measure_         | _measure_        |
| Chemical formulas                     | _measure_             | _measure_        | _measure_         | _measure_        |
| Question segmentation (P/R)           | _measure_             | _measure_        | _measure_         | _measure_        |
| Table reconstruction                  | _measure_             | _measure_        | _measure_         | _measure_        |
| Diagram association                   | _measure_             | _measure_        | _measure_         | _measure_        |
| Cross-page reconstruction             | _measure_             | _measure_        | _measure_         | _measure_        |
| JSON validity                         | _measure_             | _measure_        | _measure_         | _measure_        |
| Latency (s/page)                      | _measure_             | _measure_        | _measure_         | _measure_        |
| Cost / exam                           | _measure_             | _measure_        | _measure_         | _measure_        |
| Deployment complexity                 | Medium-High **\[R\]** | Medium **\[R\]** | Low **\[R\]**     | Medium **\[R\]** |

I left accuracy cells empty on purpose: filling them from marketing numbers would break the research standard you set.

---

## 10. Recommendations and roadmap

| #   | Item                 | Recommendation                                                                                                                                  | Why / alternatives / limits                                                                                                                                        |
| --- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Architecture         | Lean hybrid (C)                                                                                                                                 | Dual text sources enable verbatim checks. Alternatives: A (too many silent errors), B (loses figures). Limit: no Vietnamese chemistry end-to-end benchmark exists. |
| 2   | NVIDIA               | Evaluate Nemotron Parse v1.2 and page-elements v3 as parser candidates; skip Nemotron OCR v2 for Vietnamese text                                | Official model card omits Vietnamese; NIM suits GPU serving. Limit: Parse language coverage unverified.                                                            |
| 3   | Parser stack         | PaddleOCR-VL first; test SenOCR-Vi, MinerU, Docling                                                                                             | Vietnamese explicitly listed for PaddleOCR-VL. Limit: SenOCR-Vi scores self-reported.                                                                              |
| 4   | Structuring model    | Benchmark two: one mid-tier (Sonnet 5.5, GPT-6.1 Sol or Gemini 3.8 Flash) and one cheap (Haiku 5.5 or Flash-Lite); do not commit before testing | All support PDF/images and structured output per docs; no verified Vietnamese-extraction ranking.                                                                  |
| 5   | Extraction strategy  | Rules for anchors, VLM for ambiguity, validators for everything                                                                                 | Auditable and cheap                                                                                                                                                |
| 6   | Schema               | Section 5, Zod/TypeBox as source of truth                                                                                                       | Matches the TS stack                                                                                                                                               |
| 7   | Chemistry structures | Crop and store; never trust OCSR output                                                                                                         | Under 42% on real images **\[B\]**                                                                                                                                 |
| 8   | Deployment           | Hybrid (strategy 3)                                                                                                                             | Balances control and ops load                                                                                                                                      |

**Phase 1: MVP (4-6 weeks).** Upload → rasterize → PaddleOCR-VL → one VLM structuring pass with schema → rule validators → review UI with page overlay → export. Native text-layer cross-check from day one. Ground-truth set of 15 exams.

**Phase 2: Production.** Two-model disagreement check; overlapping page windows and cross-page stitching; per-field confidence routing; audit logs; DLQ and retries; tracing; 40-60 exam test set; calibrate thresholds; self-hosted parser on GPU.

**Phase 3: Advanced.** Adaptive routing (cheap model first, escalate on gate failure); fine-tune or swap in a Vietnamese-tuned recognizer (e.g., SenOCR-Vi) if it wins; automated regression benchmark in CI; subject extensions (Physics, Mathematics, Biology) via `subjectExt`; active learning from reviewer corrections.

---

## 11. Unverified or conflicting items to resolve before committing

- Official pricing pages were not read directly for OpenAI, Gemini, Textract, Azure and Document AI; figures come from aggregators **\[T\]** and conflict in places (Gemini 3.6 Flash; Mistral USD vs EUR). Re-verify on the vendors' own pages.
- Claude PDF request-size limit: 32 MB in English docs vs 128 MB on a localized page. Check the live API reference.
- Nemotron Parse v1.2 and 2.0 Vietnamese support, v1.2 support lifecycle, and 2.0 availability as a NIM.
- Whether newer releases (for example Gemini 4 variants, newer Qwen VL models) supersede the candidates above; one router site lists models dated 9-10 Nov 2026 that I did not verify **\[?\]**.
- All benchmark scores cited (OmniDocBench, OlmOCRBench, MDPBench, MolRecBench) measure different tasks and are mostly vendor or self-reported; none measures Vietnamese exam question extraction.
- Legal: licenses (NVIDIA Open Model License, MinerU extra terms, Surya model license) and exam copyright for the benchmark corpus.
