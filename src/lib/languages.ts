/**
 * Supported patient languages.
 * Add a new entry here to extend the platform — every consumer (assessment
 * flow, records, doctor dashboard) reads from this single source of truth.
 */
export type LanguageCode = "te" | "ta" | "kn" | "hi" | "en";

export interface LanguageOption {
  code: LanguageCode;
  /** English label, for clinicians */
  label: string;
  /** Native label, for patients */
  native: string;
  /** BCP-47 locale used by browser speech APIs */
  locale: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "te", label: "Telugu", native: "తెలుగు", locale: "te-IN" },
  { code: "ta", label: "Tamil", native: "தமிழ்", locale: "ta-IN" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ", locale: "kn-IN" },
  { code: "hi", label: "Hindi", native: "हिन्दी", locale: "hi-IN" },
  { code: "en", label: "English", native: "English", locale: "en-IN" },
];

export const LANGUAGE_CODES = LANGUAGES.map((l) => l.code);

export function isLanguageCode(value: string): value is LanguageCode {
  return (LANGUAGE_CODES as string[]).includes(value);
}

export function languageLabel(code: string | null | undefined): string {
  if (!code) return "Not provided";
  const match = LANGUAGES.find((l) => l.code === code);
  return match ? `${match.label} (${match.native})` : code;
}
