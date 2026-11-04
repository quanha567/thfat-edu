"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useImperativeHandle, useRef, useState, type Ref } from "react";

import { Demo, Section } from "./section-wrapper";

export type TImperativeInputHandle = {
  focus: () => void;
  reset: () => void;
  getValue: () => string;
};

type TImperativeInputProps = {
  label: string;
  ref?: Ref<TImperativeInputHandle>;
};

/** React 19 ref-as-prop with useImperativeHandle to avoid parent re-renders */
function ImperativeDemoInput({ label, ref }: TImperativeInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    reset: () => {
      if (inputRef.current) inputRef.current.value = "";
    },
    getValue: () => inputRef.current?.value || "",
  }));

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input ref={inputRef} defaultValue="Giá trị khởi tạo" placeholder="Nhập vào đây..." />
    </div>
  );
}

export function FormSection() {
  const [sliderValue, setSliderValue] = useState([60]);
  const [switchValue, setSwitchValue] = useState(false);
  const [checkValue, setCheckValue] = useState(false);
  const imperativeRef = useRef<TImperativeInputHandle>(null);

  return (
    <Section id="forms" title="Forms">
      <Demo label="Input & Label">
        <div className="max-w-sm space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="design-email">Email</Label>
            <Input id="design-email" type="email" placeholder="hoc.sinh@thfat.edu.vn" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="design-pass">Mật khẩu</Label>
            <Input id="design-pass" type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="design-disabled">Disabled</Label>
            <Input id="design-disabled" disabled value="Không thể sửa" />
          </div>
        </div>
      </Demo>

      <Demo label="React 19 Imperative Handle (useImperativeHandle + ref as prop)">
        <div className="max-w-sm space-y-3">
          <ImperativeDemoInput label="Ô nhập liệu điều khiển bằng Ref" ref={imperativeRef} />
          <div className="flex gap-2 pt-1">
            <Button size="sm" variant="outline" onClick={() => imperativeRef.current?.focus()}>
              Focus Input
            </Button>
            <Button size="sm" variant="secondary" onClick={() => imperativeRef.current?.reset()}>
              Reset Giá Trị
            </Button>
          </div>
        </div>
      </Demo>

      <Demo label="Textarea">
        <div className="max-w-sm space-y-1.5">
          <Label htmlFor="design-textarea">Ghi chú</Label>
          <Textarea id="design-textarea" placeholder="Nhập nội dung ghi chú..." rows={4} />
        </div>
      </Demo>

      <Demo label="Select">
        <div className="max-w-xs space-y-1.5">
          <Label htmlFor="design-select">Môn học</Label>
          <Select>
            <SelectTrigger id="design-select">
              <SelectValue placeholder="Chọn môn học..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chem">Hóa học</SelectItem>
              <SelectItem value="phys">Vật lý</SelectItem>
              <SelectItem value="bio">Sinh học</SelectItem>
              <SelectItem value="math">Toán</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Demo>

      <Demo label="Checkbox & Switch">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="design-check"
              checked={checkValue}
              onCheckedChange={(v) => setCheckValue(v === true)}
            />
            <Label htmlFor="design-check">Nhớ đăng nhập</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="design-switch" checked={switchValue} onCheckedChange={setSwitchValue} />
            <Label htmlFor="design-switch">Thông báo email {switchValue ? "(Bật)" : "(Tắt)"}</Label>
          </div>
        </div>
      </Demo>

      <Demo label="Radio Group">
        <RadioGroup defaultValue="hard">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="easy" id="design-easy" />
            <Label htmlFor="design-easy">Dễ</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="medium" id="design-medium" />
            <Label htmlFor="design-medium">Trung bình</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="hard" id="design-hard" />
            <Label htmlFor="design-hard">Khó</Label>
          </div>
        </RadioGroup>
      </Demo>

      <Demo label="Slider">
        <div className="max-w-xs space-y-3">
          <div className="flex justify-between">
            <Label>Thời gian thi</Label>
            <span className="text-label text-primary-700">{sliderValue[0]} phút</span>
          </div>
          <Slider value={sliderValue} onValueChange={setSliderValue} min={10} max={120} step={5} />
        </div>
      </Demo>
    </Section>
  );
}
