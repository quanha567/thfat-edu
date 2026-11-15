import { Chem } from "@/components/chemistry/chem";
import { ChemRenderer } from "@/components/chemistry/chem-renderer";

import { Demo, Section } from "./section-wrapper";

const SAMPLE_MARKDOWN = `Hòa tan hoàn toàn $m$ gam hỗn hợp gồm $\\ce{Fe}$ và $\\ce{Fe2O3}$ vào dung dịch $\\ce{H2SO4}$ đặc nóng dư:
$$\\ce{2Fe + 6H2SO4 ->[t^o] Fe2(SO4)3 + 3SO2 ^ + 6H2O}$$
Thu được khí $\\ce{SO2}$ (sản phẩm khử duy nhất). Dung dịch sau phản ứng chứa muối $\\ce{Fe^{3+}}$.`;

export function ChemistrySection() {
  return (
    <Section id="chemistry" title="Chemistry & Math Formula Rendering">
      <p className="text-body text-neutral-600">
        Thư viện hiển thị công thức Hóa học và Toán học chuyên dụng sử dụng KaTeX kết hợp tiện ích
        mở rộng mhchem.
      </p>

      <Demo label="Inline Chemical Formulas (<Chem formula='...' />)">
        <div className="flex flex-wrap items-center gap-4 text-neutral-900">
          <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2">
            <span className="text-caption text-neutral-400">Axit sunfuric:</span>
            <Chem formula="H2SO4" className="text-primary-700 font-semibold" />
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2">
            <span className="text-caption text-neutral-400">Ion sắt (III):</span>
            <Chem formula="Fe^{3+}" className="text-primary-700 font-semibold" />
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2">
            <span className="text-caption text-neutral-400">Este etyl axetat:</span>
            <Chem formula="CH3COOC2H5" className="text-primary-700 font-semibold" />
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2">
            <span className="text-caption text-neutral-400">Kết tủa:</span>
            <Chem formula="BaSO4 v" className="text-primary-700 font-semibold" />
          </div>
        </div>
      </Demo>

      <Demo label="Chemical Equations (Block display mode)">
        <div className="space-y-3 rounded-lg border border-neutral-200 bg-white p-4">
          <Chem formula="Fe + 2HCl -> FeCl2 + H2 ^" display />
          <Chem formula="2Al + Fe2O3 ->[t^o] Al2O3 + 2Fe" display />
        </div>
      </Demo>

      <Demo label="Markdown & Chemical Paragraph (<ChemRenderer content='...' />)">
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <ChemRenderer content={SAMPLE_MARKDOWN} />
        </div>
      </Demo>
    </Section>
  );
}
