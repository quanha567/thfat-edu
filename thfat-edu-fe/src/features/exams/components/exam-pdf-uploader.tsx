"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, ArrowLeft, Bot, FileText, FileUp, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { useCreateExam } from "../hooks/use-create-exam";
import { useImportPdf } from "../hooks/use-import-pdf";

export function ExamPdfUploader() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(50);
  const [isProcessing, setIsProcessing] = useState(false);

  const importMutation = useImportPdf();
  const createMutation = useCreateExam();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.type !== "application/pdf") {
        toast.error("Vui lòng chọn file có định dạng PDF.");

        return;
      }
      setFile(selected);
      if (!title) {
        setTitle(selected.name.replace(/\.pdf$/i, ""));
      }
    }
  };

  const handleStartImport = async () => {
    if (!file) {
      toast.error("Vui lòng tải lên một file PDF đề thi.");

      return;
    }

    setIsProcessing(true);
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const res = reader.result as string;
          const base64Data = res.split(",")[1] ?? res;
          resolve(base64Data);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);

      const base64Content = await base64Promise;

      const createdQuiz = await importMutation.mutateAsync({
        title: title.trim() || file.name.replace(/\.pdf$/i, ""),
        pdfBase64: base64Content,
      });

      toast.success("Bóc tách đề thi bằng AI thành công!");
      router.push(`/admin/exams/${createdQuiz.id}/edit`);
    } catch (err) {
      toast.error((err as Error).message || "Có lỗi xảy ra khi bóc tách đề thi.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateEmptyExam = async () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập tên đề thi.");

      return;
    }

    try {
      const created = await createMutation.mutateAsync({
        title: title.trim(),
        durationMinutes: duration,
        status: "draft",
        sections: [
          { sectionType: "true_false", title: "Phần I: Đúng / Sai", orderIndex: 0, questions: [] },
          { sectionType: "group_mcq", title: "Phần II: MCQs nhóm", orderIndex: 1, questions: [] },
          { sectionType: "matching", title: "Phần III: Ghép hợp", orderIndex: 2, questions: [] },
          {
            sectionType: "short_answer",
            title: "Phần IV: Trả lời ngắn",
            orderIndex: 3,
            questions: [],
          },
        ],
      });

      toast.success("Khởi tạo đề thi thành công.");
      router.push(`/admin/exams/${created.id}/edit`);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Button asChild variant="ghost" size="sm" className="text-muted-foreground -ml-2 gap-1">
          <Link href="/admin/exams">
            <ArrowLeft className="size-4" /> Quay lại danh sách
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="pdf" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pdf" className="gap-2">
            <Bot className="size-4" /> Nhập từ file PDF (AI Vision)
          </TabsTrigger>
          <TabsTrigger value="manual" className="gap-2">
            <FileText className="size-4" /> Khởi tạo thủ công
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pdf" className="pt-4">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="size-5 text-[#1C3480]" />
                Số hóa đề thi Hóa học tự động bằng NVIDIA NIM Vision
              </CardTitle>
              <CardDescription>
                Tải lên file PDF đề thi gốc. AI sẽ nhận diện các công thức KaTeX, hình ảnh thí
                nghiệm và phân bổ chính xác vào 4 Phần theo cấu trúc 150 điểm thô.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="exam-title">Tên bộ đề thi</Label>
                <Input
                  id="exam-title"
                  placeholder="Ví dụ: Đề thi thử THPT Quốc Gia 2026 - Đề số 01"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="border-border/80 hover:border-primary/60 relative rounded-xl border-2 border-dashed p-8 text-center transition-colors">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  disabled={isProcessing}
                />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="bg-primary/10 text-primary rounded-full p-3">
                    <FileUp className="size-8" />
                  </div>
                  {file ? (
                    <div className="space-y-1">
                      <p className="text-foreground text-sm font-semibold">{file.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB • File PDF đã sẵn sàng
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-foreground text-sm font-medium">
                        Kéo thả file PDF đề thi vào đây, hoặc nhấn để duyệt file
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Hỗ trợ file PDF chuẩn (tối đa 25MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-muted/40 text-muted-foreground flex items-start gap-2.5 rounded-lg p-3.5 text-xs">
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-500" />
                <span>
                  Hệ thống sử dụng model <strong>Llama-3.2 Vision trên cụm NVIDIA NIM</strong> để
                  đọc hiểu đa phương thức. Sau khi bóc tách, bạn có toàn quyền đối chiếu với file
                  PDF gốc và chỉnh sửa đáp án ở màn hình tiếp theo.
                </span>
              </div>

              <Button
                onClick={handleStartImport}
                disabled={!file || isProcessing}
                className="h-10 w-full gap-2 bg-[#1C3480] hover:bg-[#1C3480]/90"
              >
                {isProcessing ? (
                  <>
                    <Spinner className="size-4" />
                    <span>Đang bóc tách đề thi bằng NVIDIA Vision (khoảng 5-10 giây)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    <span>Bắt đầu bóc tách & Tạo đề nháp</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="pt-4">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg">Tạo bộ đề thi khung</CardTitle>
              <CardDescription>
                Tạo một đề thi rỗng với đủ 4 phần (Đúng/Sai, MCQs nhóm, Ghép hợp, Trả lời ngắn) để
                nhập liệu thủ công từng câu.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="manual-title">Tên bộ đề thi</Label>
                <Input
                  id="manual-title"
                  placeholder="Nhập tên đề thi..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manual-duration">Thời lượng làm bài (phút)</Label>
                <Input
                  id="manual-duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                />
              </div>

              <Button
                onClick={handleCreateEmptyExam}
                disabled={!title.trim() || createMutation.isPending}
                className="h-10 w-full bg-[#1C3480] hover:bg-[#1C3480]/90"
              >
                {createMutation.isPending ? "Đang tạo..." : "Tạo đề thi"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
