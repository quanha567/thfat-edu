"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

import { type TAttemptResult } from "../types";
import { ExamCertificateDecor } from "./exam-certificate-decor";
import { ExamCertificateScore } from "./exam-certificate-score";
import { ExamCertificateSeal } from "./exam-certificate-seal";
import { CertificateStat } from "./exam-certificate-stat";
import { buildCertificateModel } from "./exam-certificate.utils";

const titleFont = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export type TExamResultSummaryProps = {
  result: TAttemptResult;
};

export function ExamResultSummary({ result }: TExamResultSummaryProps) {
  const cert = buildCertificateModel(result);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center print:m-0 print:block print:w-[297mm] print:max-w-none">
      <div
        id="certificate-print-area"
        className="border-primary-100 bg-card @container relative w-full rounded-3xl border shadow-lg md:aspect-[3/2] print:m-0 print:rounded-none print:border-none print:shadow-none"
      >
        <ExamCertificateDecor />

        <div className="relative flex h-full flex-col gap-5 px-5 py-6 sm:px-10 @3xl:gap-0 @3xl:px-[8%] @3xl:pt-[3.5%] @3xl:pb-[3%]">
          {/* Header */}
          <div className="flex flex-col items-center gap-3 @3xl:flex-row @3xl:justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/brand/logo-icon.png"
                alt="ThFat Edu"
                width={64}
                height={64}
                className="h-14 w-14 object-contain"
              />
              <div>
                <p className="text-primary-700 text-2xl leading-none font-extrabold tracking-tight">
                  ThFat Edu
                </p>
                <p className="text-primary-800 text-xxs mt-1 font-medium">
                  Học Hóa - Luyện Thi V-SAT
                </p>
              </div>
            </div>

            <div className="text-center @3xl:text-right">
              <p className="text-sm font-bold tracking-wide text-neutral-900 uppercase">
                Hệ thống giáo dục ThFat Edu
              </p>
              <p className="text-xs text-neutral-600 italic">Ban Khảo Thí</p>
            </div>
          </div>

          {/* Title */}
          <div className="text-center @3xl:mt-[3%]">
            <h1
              className={`${titleFont.className} text-primary-900 text-3xl font-bold tracking-tight sm:text-4xl @3xl:text-5xl`}
            >
              Phiếu Chứng Nhận Điểm Thi
            </h1>
            <p className="text-primary-800 mt-2 text-sm font-semibold tracking-[0.25em] uppercase sm:text-base">
              {result.quizTitle}
            </p>
          </div>

          {/* Examinee info */}
          <div className="mt-6 flex flex-col items-center justify-center gap-4 @3xl:mt-[3%] @3xl:flex-row @3xl:gap-16">
            <CertificateStat label="Thí sinh" value={cert.studentName} />
            <CertificateStat label="Số báo danh" value={cert.studentCode} mono />
            <CertificateStat label="Nộp bài lúc" value={cert.examDate} />
          </div>

          <ExamCertificateScore result={result} cert={cert} />

          {/* Footer */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 @3xl:mt-auto @3xl:flex-row">
            <div className="flex items-center gap-3">
              <QRCodeSVG
                value={cert.certCode}
                size={64}
                level="M"
                className="h-14 w-14 shrink-0 @3xl:h-16 @3xl:w-16"
                title={cert.certCode}
              />
              <div>
                <p className="text-sm whitespace-nowrap text-neutral-800">
                  <span className="font-mono font-bold">{cert.certCode}</span>
                </p>
                <p className="text-xs whitespace-nowrap text-neutral-600">Mã xác thực điện tử</p>
              </div>
            </div>

            <div className="flex items-center gap-3 @3xl:mr-[5%]">
              <div className="text-right">
                <p className="text-sm font-bold whitespace-nowrap text-neutral-900">
                  Xác nhận bởi ThFat Edu
                </p>
                <p className="text-xs whitespace-nowrap text-neutral-600">
                  Kết quả đã được ghi nhận trên hệ thống
                </p>
              </div>
              <ExamCertificateSeal />
            </div>
          </div>
        </div>
      </div>

      {/* Action bar (hidden in print) */}
      <div className="mt-6 flex w-full flex-col items-center justify-between gap-3 sm:flex-row print:hidden">
        <Button asChild variant="outline" className="w-full gap-2 sm:w-auto">
          <Link href="/exams">
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách đề thi
          </Link>
        </Button>

        <Button
          onClick={() => window.print()}
          className="bg-primary-700 hover:bg-primary-800 w-full gap-2 sm:w-auto"
        >
          <Printer className="h-4 w-4" />
          In / Lưu PDF
        </Button>
      </div>

      <p className="mt-3 text-xs text-neutral-500 print:hidden">
        Chọn “Lưu dưới dạng PDF” trong hộp thoại in để lưu phiếu chứng nhận.
      </p>
    </div>
  );
}
