export type AnalysisOptionKey =
  | "templategebruik"
  | "congruentie"
  | "taalgebruik"
  | "bedrijfsafspraken";

export interface DocuCheckFinding {
  title: string;
  detail: string;
  category: string;
  severity: "laag" | "middel" | "hoog";
}

export interface DocuCheckResult {
  summary: string;
  improvements: DocuCheckFinding[];
}

export interface DocuCheckRequest {
  fileName: string;
  fileText: string;
  selectedOptions: AnalysisOptionKey[];
}
