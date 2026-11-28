import { type TAttemptResult } from "../types";
import { CertificateStat } from "./exam-certificate-stat";
import { type TCertificateModel } from "./exam-certificate.utils";

export type TExamCertificateScoreProps = {
  result: TAttemptResult;
  cert: TCertificateModel;
};

export function ExamCertificateScore({ result, cert }: TExamCertificateScoreProps) {
  return (
    <div className="border-primary-200 bg-card/80 relative mx-auto mt-10 w-full max-w-xl rounded-2xl border px-6 pt-9 pb-5 text-center @3xl:mt-[4%]">
      <span className="bg-primary-600 text-primary-foreground absolute -top-4 left-1/2 inline-block -translate-x-1/2 rounded-full px-8 py-1.5 text-xs font-bold tracking-widest whitespace-nowrap uppercase">
        Điểm đạt được
      </span>
      <p className="text-primary-900 mt-1 flex items-baseline justify-center gap-3 text-6xl leading-none font-black tracking-tight whitespace-nowrap sm:text-7xl">
        {result.score}
        <span className="text-2xl font-semibold text-neutral-500 sm:text-3xl">
          / {result.totalPoints}
        </span>
      </p>

      <div className="border-primary-100 mt-6 flex items-start justify-center gap-10 border-t pt-4 sm:gap-16">
        <CertificateStat label="Thời gian làm bài" value={cert.timeFormatted} />
        <CertificateStat
          label="Số câu đã trả lời"
          value={`${result.totalAnswered} / ${result.totalSubItems}`}
        />
      </div>
    </div>
  );
}
