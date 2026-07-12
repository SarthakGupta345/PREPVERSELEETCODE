const fs = require('fs');
const path = require('path');

const SEEDS_PATH = path.join(__dirname, 'data.json');
const OUT_DIR = path.join(__dirname, '..', 'constants', 'data');
const OUT_COMPANIES_DIR = path.join(OUT_DIR, 'companies');

// Ensure output directories exist
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}
if (!fs.existsSync(OUT_COMPANIES_DIR)) {
  fs.mkdirSync(OUT_COMPANIES_DIR, { recursive: true });
}

console.log('Reading seeds data.json...');
const rawData = fs.readFileSync(SEEDS_PATH, 'utf8');
const data = JSON.parse(rawData);

const companies = data.companies;
const totalCompanies = Object.keys(companies).length;
console.log(`Loaded ${totalCompanies} companies. Starting processing...`);

// 1. Create Companies Index & write individual company files
const companiesIndex = [];
const topicsMap = new Map();
const problemsMap = new Map();

for (const [companyKey, companyData] of Object.entries(companies)) {
  const companyName = companyData.company;
  const totalRecords = companyData.total_records_across_durations || 0;

  companiesIndex.push({
    name: companyName,
    problems: totalRecords
  });

  // Save individual company file
  // Sanitize filename: replace characters like / \ ? * : | " < > with underscores
  const safeFilename = companyName.replace(/[\/\\?%*:|"<>]/g, '_');
  const companyFilePath = path.join(OUT_COMPANIES_DIR, `${safeFilename}.json`);
  fs.writeFileSync(companyFilePath, JSON.stringify(companyData, null, 2), 'utf8');

  // Process problems and topics for global aggregation
  // We use the "all" duration or merge across all available durations for global lists
  const allData = companyData.data && (companyData.data.all || companyData.data.all_time || Object.values(companyData.data)[0]);
  if (allData && allData.records) {
    for (const record of allData.records) {
      if (!record.Title) continue;

      // Extract topics
      let topicList = [];
      if (record.Topics && typeof record.Topics === 'string') {
        topicList = record.Topics.split(',')
          .map(t => t.trim())
          .filter(t => t.length > 0);
      }

      for (const topic of topicList) {
        topicsMap.set(topic, (topicsMap.get(topic) || 0) + 1);
      }

      // Extract and merge problems
      const key = record.Title.toLowerCase().trim();
      const existing = problemsMap.get(key);

      // Normalize difficulty to capital case (e.g. EASY -> Easy)
      let difficulty = 'Medium';
      if (record.Difficulty) {
        const diffUpper = record.Difficulty.toUpperCase();
        if (diffUpper === 'EASY') difficulty = 'Easy';
        else if (diffUpper === 'MEDIUM') difficulty = 'Medium';
        else if (diffUpper === 'HARD') difficulty = 'Hard';
      }

      // Normalize acceptance
      let acceptance = 0;
      if (record['Acceptance Rate'] !== undefined) {
        const acc = record['Acceptance Rate'];
        acceptance = acc <= 1 ? Number((acc * 100).toFixed(1)) : Number(acc.toFixed(1));
      }

      if (existing) {
        existing.companies.add(companyName);
        existing.frequencies.push(record.Frequency || 0);
        // Union of topics
        topicList.forEach(t => existing.topics.add(t));
      } else {
        problemsMap.set(key, {
          title: record.Title,
          difficulty: difficulty,
          acceptance: acceptance,
          frequencies: [record.Frequency || 0],
          companies: new Set([companyName]),
          topics: new Set(topicList),
          link: record.Link || '#'
        });
      }
    }
  }
}

// 2. Format and Save Companies Index
companiesIndex.sort((a, b) => b.problems - a.problems);
fs.writeFileSync(
  path.join(OUT_DIR, 'companiesIndex.json'),
  JSON.stringify(companiesIndex, null, 2),
  'utf8'
);
console.log(`Saved ${companiesIndex.length} companies to companiesIndex.json`);

// 3. Format and Save Global Topics
const globalTopics = [];
for (const [name, count] of topicsMap.entries()) {
  globalTopics.push({ name, count });
}
globalTopics.sort((a, b) => b.count - a.count);
fs.writeFileSync(
  path.join(OUT_DIR, 'globalTopics.json'),
  JSON.stringify(globalTopics, null, 2),
  'utf8'
);
console.log(`Saved ${globalTopics.length} unique topics to globalTopics.json`);

// 4. Format and Save Global Problems (Top 150 sorted by frequency and popularity)
const globalProblems = [];
let idCounter = 1;

for (const [key, rawProblem] of problemsMap.entries()) {
  const avgFrequency = rawProblem.frequencies.length > 0
    ? Number((rawProblem.frequencies.reduce((a, b) => a + b, 0) / rawProblem.frequencies.length).toFixed(1))
    : 0;

  globalProblems.push({
    id: 0, // Placeholder, will set sorted ids next
    title: rawProblem.title,
    difficulty: rawProblem.difficulty,
    acceptance: rawProblem.acceptance,
    frequency: avgFrequency,
    companies: Array.from(rawProblem.companies),
    topics: Array.from(rawProblem.topics),
    link: rawProblem.link
  });
}

// Sort by number of companies that ask the problem, then by average frequency
globalProblems.sort((a, b) => {
  if (b.companies.length !== a.companies.length) {
    return b.companies.length - a.companies.length;
  }
  return b.frequency - a.frequency;
});

// Take all problems
const topGlobalProblems = globalProblems.map((p, idx) => {
  p.id = idx + 1;
  // Keep all companies for filtering and display
  return p;
});

fs.writeFileSync(
  path.join(OUT_DIR, 'globalProblems.json'),
  JSON.stringify(topGlobalProblems, null, 2),
  'utf8'
);
console.log(`Saved ${topGlobalProblems.length} global problems to globalProblems.json`);

console.log('Seed data processing completed successfully!');
