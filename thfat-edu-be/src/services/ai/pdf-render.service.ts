import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export type TPdfExtractedPage = {
  pageNumber: number;
  text: string;
};

export type TPdfExtractionResult = {
  pages: TPdfExtractedPage[];
  images: Record<string, string>;
};

async function fileExists(filePath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(filePath);

    return stat.isFile();
  } catch {
    return false;
  }
}

async function testPythonExecutable(executable: string): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    try {
      const child = spawn(executable, ["--version"]);
      child.on("error", () => resolve(false));
      child.on("close", (code) => resolve(code === 0));
    } catch {
      resolve(false);
    }
  });
}

async function resolvePythonExecutable(): Promise<string> {
  if (process.env.PYTHON_PATH && (await testPythonExecutable(process.env.PYTHON_PATH))) {
    return process.env.PYTHON_PATH;
  }

  // 1. Try standard python3 in system PATH (Linux / Mac / Docker)
  if (await testPythonExecutable("python3")) {
    return "python3";
  }

  // 2. Try standard python in system PATH (Windows / Linux)
  if (await testPythonExecutable("python")) {
    return "python";
  }

  // 3. Known Windows local installation path
  const knownWindowsPath =
    "C:\\Users\\quanh\\AppData\\Local\\Python\\pythoncore-3.14-64\\python.exe";
  if (await fileExists(knownWindowsPath)) {
    return knownWindowsPath;
  }

  // Fallback to python3
  return "python3";
}

export async function extractPdfDocument(pdfBuffer: Buffer): Promise<TPdfExtractionResult> {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "pdf-extract-"));
  const inputPdfPath = path.join(tempDir, "input.pdf");

  try {
    await fs.writeFile(inputPdfPath, pdfBuffer);

    const scriptPath = path.resolve(process.cwd(), "scripts", "extract_pdf.py");
    const pythonExecutable = await resolvePythonExecutable();

    const output = await new Promise<string>((resolve, reject) => {
      const child = spawn(pythonExecutable, [scriptPath, inputPdfPath]);
      let stdout = "";
      let stderr = "";

      child.stdout.on("data", (chunk) => {
        stdout += chunk.toString();
      });

      child.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });

      child.on("error", (err) => {
        reject(new Error(`Failed to execute python (${pythonExecutable}): ${err.message}`));
      });

      child.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`Extraction process failed with code ${code}: ${stderr}`));
        } else {
          resolve(stdout);
        }
      });
    });

    const parsed = JSON.parse(output) as {
      pages?: TPdfExtractedPage[];
      images?: Record<string, string>;
      error?: string;
    };

    if (parsed.error) {
      throw new Error(`PDF Extractor error: ${parsed.error}`);
    }

    return {
      pages: parsed.pages ?? [],
      images: parsed.images ?? {},
    };
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
  }
}

// Backward compatibility alias for any existing caller
export async function extractPdfTextPages(pdfBuffer: Buffer): Promise<TPdfExtractedPage[]> {
  const result = await extractPdfDocument(pdfBuffer);

  return result.pages;
}
