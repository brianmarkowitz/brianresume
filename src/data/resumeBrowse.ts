export interface BrowseField {
  label: string
  value: string
}

export interface BrowseRecord {
  title: string
  subtitle?: string
  fields: BrowseField[]
}

export interface TableBrowseContent {
  description: string
  records: BrowseRecord[]
}

export const tableBrowseContent: Record<string, TableBrowseContent> = {
  employee: {
    description: 'Primary profile record for the resume owner.',
    records: [
      {
        title: 'Brian Markowitz',
        subtitle: 'Principal Data Architect and Functional Manager',
        fields: [
          { label: 'Email', value: 'bmarko@gmail.com' },
          { label: 'Phone', value: '(301) 555-0142' },
          { label: 'LinkedIn', value: 'linkedin.com/in/brian-markowitz-126709' },
          { label: 'GitHub', value: 'github.com/brianmarkowitz' },
          { label: 'Google Scholar', value: 'scholar.google.com/citations?user=bmarko' },
          {
            label: 'Summary',
            value:
              'Cloud-native data architect focused on scientific research platforms, serverless systems, and AI-enabled discovery workflows.',
          },
        ],
      },
    ],
  },
  resume: {
    description: 'Resume ingestion and extraction history for uploaded source files.',
    records: [
      {
        title: 'brian_markowitz_resume_2026.pdf',
        subtitle: 'Processed and indexed profile',
        fields: [
          { label: 'File Type', value: 'application/pdf' },
          { label: 'Extraction Status', value: 'completed' },
          { label: 'Upload Date', value: '2026-02-28 14:12:06 EST' },
          { label: 'Processed Date', value: '2026-02-28 14:12:18 EST' },
        ],
      },
      {
        title: 'brian_markowitz_cv_research.pdf',
        subtitle: 'Long-form CV for publications and grants',
        fields: [
          { label: 'File Type', value: 'application/pdf' },
          { label: 'Extraction Status', value: 'completed' },
          { label: 'Upload Date', value: '2026-02-28 14:18:44 EST' },
          { label: 'Processed Date', value: '2026-02-28 14:19:02 EST' },
        ],
      },
    ],
  },
  experience: {
    description: 'Chronological roles and major responsibilities.',
    records: [
      {
        title: 'Digital Infuzion',
        subtitle: 'Principal Data Architect & Functional Manager',
        fields: [
          { label: 'Period', value: '2016 - Present' },
          { label: 'Focus', value: 'NIH/NIAID/NCI research modernization and analytics infrastructure' },
          { label: 'Technologies', value: 'AWS Lambda, DynamoDB, Athena, OpenSearch, CloudFormation, Python' },
        ],
      },
      {
        title: 'Digital Infuzion',
        subtitle: 'Chief of Staff',
        fields: [
          { label: 'Period', value: '2022 - Present' },
          { label: 'Focus', value: 'Budgeting, staffing, mentorship, cross-team leadership systems' },
          { label: 'Tools', value: 'Operating cadences, performance planning, enablement programs' },
        ],
      },
      {
        title: 'IBM Global Services',
        subtitle: 'Principal Data Architect & ETL Lead',
        fields: [
          { label: 'Period', value: '1998 - 2016' },
          { label: 'Focus', value: 'Enterprise ETL and data integration across healthcare, finance, and public sector' },
          { label: 'Technologies', value: 'Enterprise ETL stacks, RDBMS, data governance, continuity planning' },
        ],
      },
    ],
  },
  projects: {
    description: 'Program and platform implementations represented in the resume.',
    records: [
      {
        title: 'iDPCC / CEIRR Platform Modernization',
        subtitle: 'Cloud migration and AI-assisted biospecimen discovery',
        fields: [
          { label: 'Type', value: 'Research data platform' },
          { label: 'Role', value: 'Principal Data Architect' },
          { label: 'Date Range', value: '2021 - Present' },
          { label: 'Technologies', value: 'AWS serverless, DynamoDB, Athena, OpenSearch, RAG workflows' },
        ],
      },
      {
        title: 'NCI / DCTD Integrated Analytics',
        subtitle: 'Unified oncology analytics across 30+ source systems',
        fields: [
          { label: 'Type', value: 'Integrated analytics platform' },
          { label: 'Role', value: 'Principal Data Architect' },
          { label: 'Date Range', value: '2019 - 2024' },
          { label: 'Technologies', value: 'AWS serverless, data modeling, audit pipelines' },
        ],
      },
      {
        title: 'SDMCC / CIVICs Data Infrastructure',
        subtitle: 'Collaborative statistical data pipelines and exports',
        fields: [
          { label: 'Type', value: 'Data infrastructure' },
          { label: 'Role', value: 'Principal Data Architect' },
          { label: 'Date Range', value: '2018 - 2023' },
          { label: 'Technologies', value: 'Lambda, CloudFormation, ETL pipelines, operational auditing' },
        ],
      },
      {
        title: 'CCOS / NCATS Service Modernization',
        subtitle: 'Serverless performance upgrade for oncology services',
        fields: [
          { label: 'Type', value: 'Legacy modernization' },
          { label: 'Role', value: 'Principal Data Architect' },
          { label: 'Date Range', value: '2017 - 2021' },
          { label: 'Technologies', value: 'Serverless architecture, database optimization, workflow orchestration' },
        ],
      },
    ],
  },
  skills: {
    description: 'Canonical skill dictionary and categories used across projects.',
    records: [
      {
        title: 'AWS Lambda',
        subtitle: 'Cloud Platform',
        fields: [{ label: 'Category', value: 'Serverless' }],
      },
      {
        title: 'DynamoDB',
        subtitle: 'Data Platform',
        fields: [{ label: 'Category', value: 'NoSQL Database' }],
      },
      {
        title: 'Athena',
        subtitle: 'Analytics',
        fields: [{ label: 'Category', value: 'Serverless Query' }],
      },
      {
        title: 'OpenSearch',
        subtitle: 'Search',
        fields: [{ label: 'Category', value: 'Discovery / Indexing' }],
      },
      {
        title: 'CloudFormation',
        subtitle: 'Infrastructure as Code',
        fields: [{ label: 'Category', value: 'IaC / Governance' }],
      },
      {
        title: 'OpenAI + RAG Workflows',
        subtitle: 'AI Engineering',
        fields: [{ label: 'Category', value: 'GenAI / LLM' }],
      },
    ],
  },
  employee_skills: {
    description: 'Skill proficiency assignments for the employee profile.',
    records: [
      {
        title: 'employee_id=1 -> skill_id=1',
        subtitle: 'AWS Lambda',
        fields: [{ label: 'Proficiency', value: 'Expert' }],
      },
      {
        title: 'employee_id=1 -> skill_id=2',
        subtitle: 'DynamoDB',
        fields: [{ label: 'Proficiency', value: 'Expert' }],
      },
      {
        title: 'employee_id=1 -> skill_id=3',
        subtitle: 'Athena',
        fields: [{ label: 'Proficiency', value: 'Advanced' }],
      },
      {
        title: 'employee_id=1 -> skill_id=4',
        subtitle: 'OpenSearch',
        fields: [{ label: 'Proficiency', value: 'Advanced' }],
      },
      {
        title: 'employee_id=1 -> skill_id=6',
        subtitle: 'OpenAI + RAG Workflows',
        fields: [{ label: 'Proficiency', value: 'Advanced' }],
      },
    ],
  },
  certifications: {
    description: 'Certifications and credentials attached to the resume profile.',
    records: [
      {
        title: 'AWS Certified Solutions Architect',
        subtitle: 'Amazon Web Services',
        fields: [
          { label: 'Issue Date', value: '2022-06-10' },
          { label: 'Expiry Date', value: '2025-06-10' },
          { label: 'Type', value: 'Cloud Architecture' },
        ],
      },
      {
        title: 'AWS Certified Data Analytics',
        subtitle: 'Amazon Web Services',
        fields: [
          { label: 'Issue Date', value: '2021-09-15' },
          { label: 'Expiry Date', value: '2024-09-15' },
          { label: 'Type', value: 'Data Engineering' },
        ],
      },
    ],
  },
  publications: {
    description: 'Selected technical writing and public thought leadership.',
    records: [
      {
        title: 'ETLlm: Enhancing Data Pipelines with Large Language Models',
        subtitle: 'Medium',
        fields: [
          { label: 'Publication Date', value: '2024-01-11' },
          {
            label: 'DOI/URL',
            value: 'medium.com/@bmarko_99572/etllm-enhancing-data-pipelines-with-large-language-models-d37eec2d5dc6',
          },
          { label: 'Research Area', value: 'LLM-augmented data engineering' },
        ],
      },
      {
        title: 'How Digital Infuzion Solves Large-Scale Scientific Data Collaboration with Amazon QuickSight',
        subtitle: 'AWS Big Data Blog',
        fields: [
          { label: 'Publication Date', value: '2023-10-17' },
          {
            label: 'DOI/URL',
            value: 'aws.amazon.com/blogs/big-data/how-digital-infuzion-solves-the-challenge-of-large-scale-scientific-data-collaboration-with-amazon-quicksight/',
          },
          { label: 'Research Area', value: 'Scientific analytics collaboration' },
        ],
      },
      {
        title: 'Efficient Data Analysis: Analyzing DynamoDB Data in Real-Time with AWS Athena',
        subtitle: 'Medium',
        fields: [
          { label: 'Publication Date', value: '2023-06-07' },
          {
            label: 'DOI/URL',
            value: 'medium.com/@bmarko_99572/using-aws-athena-with-dynamodb-896f7a59af57',
          },
          { label: 'Research Area', value: 'Serverless analytics' },
        ],
      },
    ],
  },
  awards: {
    description: 'Recognition and awards from leadership and technical contributions.',
    records: [
      {
        title: 'Digital Infuzion Manager of the Year',
        fields: [
          { label: 'Awarding Body', value: 'Digital Infuzion' },
          { label: 'Award Date', value: '2023-12-01' },
          { label: 'Category', value: 'Leadership' },
        ],
      },
      {
        title: 'Most Innovative & Employee of the Year Nominee',
        fields: [
          { label: 'Awarding Body', value: 'Digital Infuzion' },
          { label: 'Award Date', value: '2018-12-01' },
          { label: 'Category', value: 'Innovation' },
        ],
      },
      {
        title: 'IBM Services Excellence Award',
        fields: [
          { label: 'Awarding Body', value: 'IBM' },
          { label: 'Award Date', value: '2015-11-01' },
          { label: 'Category', value: 'Delivery Excellence' },
        ],
      },
    ],
  },
}
