// Types and helpers for global problems and topics data

export interface GlobalProblem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  acceptance: number;
  frequency: number;
  companies: string[];
  topics: string[];
  link: string;
}

export interface GlobalTopic {
  name: string;
  count: number;
}

/**
 * Converts a flat topics string "Array, Hash Table, Sorting"
 * to an array ["Array", "Hash Table", "Sorting"]
 */
export function parseTopics(topics: string | string[]): string[] {
  if (Array.isArray(topics)) return topics;
  if (!topics) return [];
  return topics
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}
