// Types and helpers for company data

export interface CompanyIndex {
  name: string;
  problems: number;
}

export interface ProblemRecord {
  id?: string;
  Difficulty: "EASY" | "MEDIUM" | "HARD";
  Title: string;
  Frequency: number;
  "Acceptance Rate": number;
  Link: string;
  companies:string;
  Topics: string;
}

export interface DurationData {
  source_file: string;
  record_count: number;
  columns: string[];
  records: ProblemRecord[];
}

export interface CompanyData {
  company: string;
  total_records_across_durations: number;
  durations_available: string[];
  data: {
    "30_days"?: DurationData;
    "3_months"?: DurationData;
    "6_months"?: DurationData;
    all?: DurationData;
    [key: string]: DurationData | undefined;
  };
}

/** Normalize raw EASY/MEDIUM/HARD to display-friendly format */
export function normalizeDifficulty(raw: string): "Easy" | "Medium" | "Hard" {
  const upper = raw.toUpperCase();
  if (upper === "EASY") return "Easy";
  if (upper === "HARD") return "Hard";
  return "Medium";
}

/** Convert 0–1 acceptance rate to percentage string */
export function formatAcceptance(rate: number): string {
  const pct = rate <= 1 ? rate * 100 : rate;
  return `${pct.toFixed(1)}%`;
}

/** Extract unique topics from a records array */
export function extractTopics(records: ProblemRecord[]): { name: string; count: number }[] {
  const topicsMap = new Map<string, number>();
  for (const record of records) {
    if (!record.Topics) continue;
    for (const topic of record.Topics.split(",").map((t) => t.trim()).filter(Boolean)) {
      topicsMap.set(topic, (topicsMap.get(topic) ?? 0) + 1);
    }
  }
  return Array.from(topicsMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/** Compute difficulty stats for a set of records */
export function computeStats(records: ProblemRecord[]) {
  const stats = { easy: 0, medium: 0, hard: 0 };
  for (const r of records) {
    const d = r.Difficulty?.toUpperCase();
    if (d === "EASY") stats.easy++;
    else if (d === "HARD") stats.hard++;
    else stats.medium++;
  }
  return stats;
}

/**
 * Resolve which duration key to use given what the user selected.
 * Falls back gracefully if the key isn't present.
 */
export function resolveDuration(
  companyData: CompanyData,
  selected: string
): DurationData | null {
  const map: Record<string, string[]> = {
    "30 Days": ["30_days"],
    "3 Months": ["3_months"],
    "6 Months": ["6_months"],
    All: ["all", "all_time"],
  };

  const candidates = map[selected] ?? ["all", "all_time"];
  for (const key of candidates) {
    const d = companyData.data[key];
    if (d && d.record_count > 0) return d;
  }

  // Final fallback: any key with data
  for (const key of ["all", "all_time", "6_months", "3_months", "30_days"]) {
    const d = companyData.data[key];
    if (d && d.record_count > 0) return d;
  }
  return null;
}
