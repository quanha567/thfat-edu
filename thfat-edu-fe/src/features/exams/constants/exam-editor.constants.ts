import {
  type TQuizQuestion,
  type TQuizSection,
  type TQuizSubItem,
  type TSectionType,
} from "../types";

export type TMathSnippet = {
  label: string;
  snippet: string;
  title: string;
};

export const MATH_SNIPPETS: TMathSnippet[] = [
  { label: "a/b", snippet: "$\\frac{a}{b}$", title: "Phân số" },
  { label: "√x", snippet: "$\\sqrt{x}$", title: "Căn bậc hai" },
  { label: "x²", snippet: "$x^{2}$", title: "Lũy thừa" },
  { label: "x₁", snippet: "$x_{1}$", title: "Chỉ số dưới" },
  { label: "→", snippet: "$\\rightarrow$", title: "Mũi tên" },
  { label: "⇌", snippet: "$\\rightleftharpoons$", title: "Phản ứng thuận nghịch" },
  { label: "Δ", snippet: "$\\Delta$", title: "Delta" },
  { label: "Hóa học", snippet: "$\\ce{H2SO4}$", title: "Công thức hóa học" },
  { label: "±", snippet: "$\\pm$", title: "Cộng trừ" },
  { label: "°C", snippet: "$^\\circ\\text{C}$", title: "Độ C" },
];

export const VSAT_SECTION_CONFIG: Record<
  TSectionType,
  {
    title: string;
    sectionType: TSectionType;
    expectedQuestions: number;
    pointsLabel: string;
    description: string;
  }
> = {
  true_false: {
    title: "Phần I: Câu hỏi đúng / sai",
    sectionType: "true_false",
    expectedQuestions: 9,
    pointsLabel: "54.00 điểm (Tối đa 6đ/câu)",
    description: "Mỗi câu gồm 4 ý a, b, c, d. Đúng 1 ý = 1đ, 2 ý = 2đ, 3 ý = 3đ, 4 ý = 6đ.",
  },
  group_mcq: {
    title: "Phần II: Câu hỏi trắc nghiệm dạng nhóm",
    sectionType: "group_mcq",
    expectedQuestions: 6,
    pointsLabel: "36.00 điểm (6đ/câu)",
    description: "Nhóm câu hỏi chung ngữ cảnh, mỗi câu có 4 lựa chọn (A, B, C, D).",
  },
  matching: {
    title: "Phần III: Câu hỏi ghép đôi",
    sectionType: "matching",
    expectedQuestions: 5,
    pointsLabel: "30.00 điểm (1.5đ/tiểu mục)",
    description: "Ghép các vế tương ứng giữa hai cột thông tin.",
  },
  short_answer: {
    title: "Phần IV: Câu hỏi trả lời ngắn",
    sectionType: "short_answer",
    expectedQuestions: 5,
    pointsLabel: "30.00 điểm (6đ/câu)",
    description: "Thí sinh điền kết quả hoặc số cụ thể vào ô trả lời.",
  },
};

export function createEmptySubItem(options: {
  sectionType: TSectionType;
  orderIndex: number;
  label?: string;
}): TQuizSubItem {
  const { sectionType, orderIndex, label } = options;

  if (sectionType === "true_false") {
    const defaultLabels = ["a", "b", "c", "d"];

    return {
      orderIndex,
      label: label ?? defaultLabels[orderIndex % 4] ?? "a",
      content: "",
      correctAnswer: "Đúng",
      points: "1.50",
      explanation: "",
    };
  }

  if (sectionType === "group_mcq") {
    return {
      orderIndex,
      label: label ?? `Câu ${orderIndex + 1}`,
      content: "",
      options: ["", "", "", ""],
      correctAnswer: "A",
      points: "6.00",
      explanation: "",
    };
  }

  if (sectionType === "matching") {
    return {
      orderIndex,
      label: label ?? `Cặp ${orderIndex + 1}`,
      content: "",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      points: "1.50",
      explanation: "",
    };
  }

  return {
    orderIndex,
    label: label ?? `Câu ${orderIndex + 1}`,
    content: "",
    correctAnswer: "",
    acceptableAnswers: [],
    points: "6.00",
    explanation: "",
  };
}

export function createEmptyQuestion(options: {
  sectionType: TSectionType;
  orderIndex: number;
}): TQuizQuestion {
  const { sectionType, orderIndex } = options;

  if (sectionType === "true_false") {
    return {
      orderIndex,
      contextContent: "",
      subItems: ["a", "b", "c", "d"].map((label, idx) =>
        createEmptySubItem({ sectionType, orderIndex: idx, label }),
      ),
    };
  }

  if (sectionType === "group_mcq") {
    return {
      orderIndex,
      contextContent: "",
      subItems: [0, 1, 2].map((idx) =>
        createEmptySubItem({ sectionType, orderIndex: idx, label: `Câu ${idx + 1}` }),
      ),
    };
  }

  if (sectionType === "matching") {
    return {
      orderIndex,
      contextContent: "",
      subItems: [0, 1, 2, 3].map((idx) =>
        createEmptySubItem({ sectionType, orderIndex: idx, label: `Cặp ${idx + 1}` }),
      ),
    };
  }

  return {
    orderIndex,
    contextContent: "",
    subItems: [createEmptySubItem({ sectionType, orderIndex: 0 })],
  };
}

export function createDefaultSections(): TQuizSection[] {
  const types: TSectionType[] = ["true_false", "group_mcq", "matching", "short_answer"];

  return types.map((sectionType, index) => {
    const config = VSAT_SECTION_CONFIG[sectionType];

    return {
      orderIndex: index,
      sectionType,
      title: config.title,
      questions: [],
    };
  });
}
