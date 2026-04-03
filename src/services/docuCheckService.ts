import { createAzureChatCompletion } from "./azureOpenAiClient";
import type { DocuCheckRequest, DocuCheckResult } from "../types/docucheck";

const parseResult = (raw: string): DocuCheckResult => {
  const parsed = JSON.parse(raw) as Partial<DocuCheckResult>;

  const summary = typeof parsed.summary === "string" ? parsed.summary : "Geen samenvatting ontvangen.";

  const improvements = Array.isArray(parsed.improvements)
    ? parsed.improvements
        .map((item) => {
          if (!item || typeof item !== "object") {
            return null;
          }

          const title = typeof item.title === "string" ? item.title : "Verbeterpunt";
          const detail = typeof item.detail === "string" ? item.detail : "Geen details";
          const category = typeof item.category === "string" ? item.category : "algemeen";
          const severity =
            item.severity === "hoog" || item.severity === "middel" || item.severity === "laag"
              ? item.severity
              : "middel";

          return { title, detail, category, severity };
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item))
    : [];

  return {
    summary,
    improvements,
  };
};

export async function runDocuCheckAnalysis(request: DocuCheckRequest): Promise<DocuCheckResult> {
  const selected = request.selectedOptions.join(", ");
  const textSnippet = request.fileText.slice(0, 12000);

  const systemPrompt =
    "Je bent een Nederlandse document-review assistent. Geef alleen geldige JSON terug zonder markdown.";

  const userPrompt = [
    "Analyseer het document op basis van de geselecteerde controles.",
    `Bestandsnaam: ${request.fileName}`,
    `Controles: ${selected}`,
    "",
    "Output JSON exact in dit format:",
    '{"summary":"korte samenvatting","improvements":[{"title":"...","detail":"...","category":"templategebruik|congruentie|taalgebruik|bedrijfsafspraken","severity":"laag|middel|hoog"}]}',
    "",
    "Documentinhoud (kan ingekort zijn):",
    textSnippet || "[Geen leesbare tekst beschikbaar uit het bestand. Geef algemene verbeterpunten op basis van bestandsnaam en controles.]",
  ].join("\n");

  const raw = await createAzureChatCompletion([
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ]);

  return parseResult(raw);
}
