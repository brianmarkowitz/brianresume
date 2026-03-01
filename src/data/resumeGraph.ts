export type GraphMode = 'architecture' | 'impact' | 'leadership'

export type NodeKind =
  | 'actor'
  | 'system'
  | 'capability'
  | 'legacy'
  | 'leadership'

export type EdgeRelation = 'data_flow' | 'ownership' | 'influence' | 'enables'

export interface ResumeLink {
  label: string
  href: string
}

export interface ResumeNode {
  id: string
  kind: NodeKind
  lane: 'actors' | 'systems' | 'capabilities'
  label: string
  summary: string
  role?: string
  problem?: string
  decisions: string[]
  tradeoffs: string[]
  impact: string[]
  tech: string[]
  microMetric?: string
  links?: ResumeLink[]
  activeModes: GraphMode[]
  usedIn?: string[]
  legacyProjects?: string[]
}

export interface ResumeEdge {
  id: string
  source: string
  target: string
  relation: EdgeRelation
  activeModes: GraphMode[]
  label?: string
}

export interface ResumePublication {
  title: string
  href: string
  source: string
}

export interface ResumeAward {
  title: string
  year: string
}

export const modeLabels: Record<GraphMode, string> = {
  architecture: 'Architecture View',
  impact: 'Impact View',
  leadership: 'Leadership View',
}

export const resumeNodes: ResumeNode[] = [
  {
    id: 'actor-researchers',
    kind: 'actor',
    lane: 'actors',
    label: 'Researchers',
    summary: 'Scientists and analysts who need fast discovery across complex study data.',
    decisions: [
      'Prioritized discovery speed and context-rich query pathways.',
      'Used search, exports, and conversational AI to reduce retrieval friction.',
    ],
    tradeoffs: [
      'Flexible search interfaces can increase curation complexity.',
      'Balancing broad data access with governance controls required layered permissions.',
    ],
    impact: [
      'Improved discovery across millions of biospecimen and study records.',
      'Reduced time from question to usable dataset.',
    ],
    tech: ['OpenSearch', 'DynamoDB', 'Athena', 'LLM workflows'],
    microMetric: 'Millions of records discoverable',
    activeModes: ['architecture', 'impact'],
  },
  {
    id: 'actor-leadership',
    kind: 'actor',
    lane: 'actors',
    label: 'Program Leadership (NIH/NIAID/NCI)',
    summary: 'Executive and program stakeholders accountable for outcomes, compliance, and funding value.',
    decisions: [
      'Introduced serverless and IaC patterns for transparent operations.',
      'Structured platforms for traceability and reusable governance controls.',
    ],
    tradeoffs: [
      'Governance-first architecture can slow early feature velocity.',
      'Standardization across programs can constrain bespoke workflows.',
    ],
    impact: [
      'Higher confidence in data integrity and operational accountability.',
      'Clearer alignment of architecture decisions to mission outcomes.',
    ],
    tech: ['AWS Lambda', 'CloudFormation', 'Auditing pipelines'],
    activeModes: ['architecture', 'impact', 'leadership'],
  },
  {
    id: 'actor-providers',
    kind: 'actor',
    lane: 'actors',
    label: 'Data Providers / Studies',
    summary: 'Clinical and research contributors submitting heterogeneous data across studies.',
    decisions: [
      'Built standardized ETL/ELT submission paths and metadata contracts.',
      'Designed adaptable mapping patterns for diverse source structures.',
    ],
    tradeoffs: [
      'Strict schema governance versus contributor flexibility.',
      'Automated validation coverage versus onboarding simplicity.',
    ],
    impact: [
      'Improved submission quality and consistency.',
      'Faster ingestion into downstream analytics and discovery systems.',
    ],
    tech: ['ETL/ELT', 'Metadata validation', 'State machines'],
    microMetric: '30+ integrated source patterns',
    activeModes: ['architecture', 'impact'],
  },
  {
    id: 'actor-repositories',
    kind: 'actor',
    lane: 'actors',
    label: 'Public Repositories',
    summary: 'External systems for scientific data distribution and reuse.',
    decisions: [
      'Implemented standardized export pipelines for repository submissions.',
      'Maintained interoperable formats and quality checkpoints.',
    ],
    tradeoffs: [
      'External schema constraints can limit internal data model freedom.',
      'Release reliability requires additional validation and staging effort.',
    ],
    impact: [
      'Expanded data discoverability and scientific collaboration.',
      'Streamlined repeatable submissions to public repositories.',
    ],
    tech: ['Export pipelines', 'Schema validation', 'Workflow orchestration'],
    links: [
      { label: 'ImmPort', href: 'https://www.immport.org' },
      { label: 'GenBank', href: 'https://www.ncbi.nlm.nih.gov/genbank/' },
      { label: 'BV-BRC', href: 'https://www.bv-brc.org/' },
    ],
    activeModes: ['architecture', 'impact'],
  },
  {
    id: 'system-idpcc',
    kind: 'system',
    lane: 'systems',
    label: 'iDPCC / CEIRR Platform',
    summary:
      'Modernized influenza research platform supporting high-scale biospecimen discovery and AI-assisted data interaction.',
    role: 'Principal Data Architect & Functional Manager (Digital Infuzion)',
    problem:
      'Legacy monolithic applications limited scalability, discoverability, and flexible access to historical research data.',
    decisions: [
      'Migrated monolithic workflows to a fully serverless AWS architecture.',
      'Replicated and migrated historical MySQL datasets into NoSQL and serverless query pathways.',
      'Built ETL workflows and data models for large-scale biospecimen discovery.',
      'Added on-demand data export and public repository submission pipelines.',
      'Launched an LLM chatbot with agentic workflows for repository interaction.',
    ],
    tradeoffs: [
      'Shifted from relational familiarity to NoSQL patterns for scale and access speed.',
      'Accepted increased observability and orchestration complexity to gain elasticity and cost control.',
      'Balanced rapid AI feature delivery with governance and relevance safeguards.',
    ],
    impact: [
      'Enabled efficient access to 4M+ biospecimens from completed clinical trials.',
      'Decommissioned legacy AWS resources and reduced infrastructure overhead.',
      'Improved researcher discovery and external data sharing workflows.',
    ],
    tech: [
      'AWS Lambda',
      'DynamoDB',
      'Athena',
      'Glue',
      'OpenSearch',
      'Python',
      'CloudFormation/SAM',
      'LLM + RAG workflows',
    ],
    microMetric: '4M+ biospecimens',
    activeModes: ['architecture', 'impact'],
  },
  {
    id: 'system-sdmcc',
    kind: 'system',
    lane: 'systems',
    label: 'SDMCC / CIVICs Data Infrastructure',
    summary:
      'AWS-based statistical data infrastructure that improved collaboration and streamlined data export operations.',
    role: 'Principal Data Architect & Functional Manager (Digital Infuzion)',
    problem:
      'Research collaboration required reliable cross-study data access, consistent exports, and lightweight operational auditing.',
    decisions: [
      'Architected AWS-native data infrastructure for analytics and collaboration.',
      'Built serverless export pipelines to simplify downstream sharing.',
      'Implemented Lambda + CloudFormation auditing for workflow reliability.',
    ],
    tradeoffs: [
      'Invested in IaC discipline upfront to reduce recurring operations burden.',
      'Balanced pipeline flexibility with tighter operational controls.',
    ],
    impact: [
      'Improved operational reliability across processing workflows.',
      'Faster and more dependable data export execution.',
    ],
    tech: ['AWS Lambda', 'CloudFormation', 'ETL pipelines', 'Analytics infrastructure'],
    microMetric: 'Serverless auditing at scale',
    activeModes: ['architecture', 'impact'],
  },
  {
    id: 'system-nci',
    kind: 'system',
    lane: 'systems',
    label: 'NCI / DCTD Integrated Analytics Platform',
    summary: 'Unified analytics environment integrating diverse oncology and treatment data sources.',
    role: 'Principal Data Architect & Functional Manager (Digital Infuzion)',
    problem:
      'Program data was fragmented across dozens of sources, limiting analytic accessibility, traceability, and trust.',
    decisions: [
      'Integrated 30+ diverse NCI sources into a scalable AWS platform.',
      'Designed common data models for coherent analytics access.',
      'Implemented serverless auditing for integrity and traceability.',
    ],
    tradeoffs: [
      'Source normalization complexity increased as heterogeneity grew.',
      'Governed model changes to prevent downstream analytic drift.',
    ],
    impact: [
      'Improved accessibility and consistency of integrated analytics data.',
      'Strengthened data integrity and operational traceability.',
    ],
    tech: ['AWS serverless', 'Data modeling', 'Auditing pipelines'],
    microMetric: '30+ sources integrated',
    activeModes: ['architecture', 'impact'],
  },
  {
    id: 'system-ccos',
    kind: 'system',
    lane: 'systems',
    label: 'CCOS / NCATS Modernization',
    summary:
      'Led modernization of oncology research services to a serverless architecture for improved performance.',
    role: 'Principal Data Architect & Functional Manager (Digital Infuzion)',
    problem:
      'Legacy architecture constrained performance and slowed computational workflow delivery for oncology research teams.',
    decisions: [
      'Directed migration to modern serverless architecture patterns.',
      'Optimized data services to improve query and workflow throughput.',
    ],
    tradeoffs: [
      'Phased rollout strategy reduced risk but required longer transition windows.',
      'Migration planning prioritized continuity over aggressive rewrites.',
    ],
    impact: [
      'Improved database performance for oncology research applications.',
      'Streamlined computational workflow execution paths.',
    ],
    tech: ['AWS serverless', 'Workflow modernization', 'Database optimization'],
    microMetric: 'Legacy architecture modernized',
    activeModes: ['architecture', 'impact'],
  },
  {
    id: 'system-ibm',
    kind: 'legacy',
    lane: 'systems',
    label: 'IBM Foundation Systems (1998-2016)',
    summary: 'Foundational ETL and architecture leadership across healthcare, finance, and public sector programs.',
    role: 'Principal Data Architect & Functional Manager (IBM Global Services)',
    problem:
      'Enterprise programs needed resilient data movement, recovery planning, and operational continuity across varied domains.',
    decisions: [
      'Led ETL architecture and delivery across highly regulated environments.',
      'Applied reusable reliability patterns across healthcare and public sector implementations.',
    ],
    tradeoffs: [
      'Standardized delivery frameworks versus client-specific process variation.',
      'Reliability controls could extend implementation timelines.',
    ],
    impact: [
      'Established long-running data engineering foundation later extended into cloud-native modernization work.',
      'Delivered reliable ETL outcomes for high-profile clients across multiple industries.',
    ],
    tech: ['ETL', 'RDBMS', 'Business continuity', 'Enterprise data integration'],
    legacyProjects: [
      'Emory University Healthcare - Lead ETL Developer',
      'United States Postal Service - Lead ETL Developer',
      'Department of Public Safety, Texas - Lead ETL Developer',
      'Morgan Stanley Dean Witter - ETL Developer',
      'Blue Cross Blue Shield of N.J. - ETL Developer',
    ],
    activeModes: ['architecture'],
  },
  {
    id: 'system-chief-of-staff',
    kind: 'leadership',
    lane: 'systems',
    label: 'Chief of Staff and People Systems',
    summary: 'Built management operating systems for budgeting, staffing, mentorship, and team alignment.',
    role: 'Chief of Staff (Digital Infuzion)',
    problem:
      'Multiple teams needed coordinated planning, talent development, and conflict resolution to scale delivery effectively.',
    decisions: [
      'Led strategic budgeting and resource allocation across teams.',
      'Created structured mentorship and career development programs.',
      'Established recurring operating cadences for alignment and communication.',
      'Recruited and trained a GenAI engineer with an onboarding curriculum.',
    ],
    tradeoffs: [
      'Formal process increases clarity but can feel rigid for rapid teams.',
      'Short-term staffing flexibility traded for long-term capability growth.',
    ],
    impact: [
      'Improved engagement, collaboration, and leadership alignment.',
      'Increased team readiness for emerging AI and platform initiatives.',
    ],
    tech: ['Team operations', 'Mentorship systems', 'Strategic planning'],
    microMetric: 'Cross-team mentorship program',
    activeModes: ['architecture', 'leadership', 'impact'],
  },
  {
    id: 'cap-ingestion',
    kind: 'capability',
    lane: 'capabilities',
    label: 'Ingestion and ETL/ELT',
    summary: 'Designed ingestion patterns that normalize heterogeneous research and enterprise sources.',
    decisions: [
      'Standardized ingestion contracts to reduce downstream modeling churn.',
      'Used serverless orchestration for resilient, repeatable data movement.',
    ],
    tradeoffs: [
      'Schema rigor versus source onboarding speed.',
      'Automation depth versus maintainability of custom transforms.',
    ],
    impact: ['Lower-friction data onboarding across programs and repositories.'],
    tech: ['ETL/ELT', 'State orchestration', 'Validation rules'],
    usedIn: ['system-idpcc', 'system-sdmcc', 'system-nci', 'system-ibm'],
    activeModes: ['architecture', 'impact'],
  },
  {
    id: 'cap-modeling',
    kind: 'capability',
    lane: 'capabilities',
    label: 'Data Modeling',
    summary: 'Created reusable data models that preserve traceability while supporting high-scale analytics.',
    decisions: [
      'Used domain-aligned model boundaries for clearer ownership.',
      'Embedded audit and lineage considerations in schema design.',
    ],
    tradeoffs: [
      'Model consistency versus flexibility for rapidly changing use cases.',
      'Normalization depth versus query performance.',
    ],
    impact: ['Improved data integrity and cross-system interoperability.'],
    tech: ['Conceptual and physical modeling', 'Governance conventions'],
    usedIn: ['system-idpcc', 'system-nci', 'system-sdmcc'],
    activeModes: ['architecture', 'impact'],
  },
  {
    id: 'cap-nosql-query',
    kind: 'capability',
    lane: 'capabilities',
    label: 'NoSQL + Serverless Query',
    summary: 'Combined NoSQL storage with serverless query layers for scale and flexible access patterns.',
    decisions: [
      'Moved selected workloads from RDBMS to DynamoDB + Athena paths.',
      'Optimized storage/query boundaries for performance and cost.',
    ],
    tradeoffs: [
      'Denormalized design complexity versus performance gains.',
      'Query flexibility required careful partitioning and indexing strategy.',
    ],
    impact: ['Scalable retrieval on large historical datasets.'],
    tech: ['DynamoDB', 'Athena', 'Glue'],
    usedIn: ['system-idpcc', 'system-ccos'],
    activeModes: ['architecture', 'impact'],
  },
  {
    id: 'cap-search',
    kind: 'capability',
    lane: 'capabilities',
    label: 'Search and Discovery',
    summary: 'Search-first experience patterns for scientific dataset discovery and exploration.',
    decisions: [
      'Built index strategies for fast exploratory filtering.',
      'Layered conversational access over structured search artifacts.',
    ],
    tradeoffs: [
      'Broader recall can reduce precision if not tuned carefully.',
      'Context-rich search requires ongoing relevance optimization.',
    ],
    impact: ['Faster path from user question to relevant data assets.'],
    tech: ['OpenSearch', 'Metadata indexing', 'Query optimization'],
    usedIn: ['system-idpcc', 'system-nci'],
    activeModes: ['architecture', 'impact'],
  },
  {
    id: 'cap-quality',
    kind: 'capability',
    lane: 'capabilities',
    label: 'Metadata and Data Quality',
    summary: 'Operational metadata and quality controls to strengthen trust and reuse.',
    decisions: [
      'Implemented validation and metadata requirements in ingestion workflows.',
      'Promoted standards that support auditability and interoperability.',
    ],
    tradeoffs: [
      'Higher quality gates can slow initial contributor onboarding.',
      'Balancing strict controls with research workflow flexibility.',
    ],
    impact: ['More reliable data products and reduced downstream remediation.'],
    tech: ['Quality rules', 'Metadata systems', 'Governance'],
    usedIn: ['system-idpcc', 'system-nci', 'system-sdmcc'],
    activeModes: ['architecture', 'impact'],
  },
  {
    id: 'cap-export',
    kind: 'capability',
    lane: 'capabilities',
    label: 'Export and Interoperability',
    summary: 'On-demand and standardized exports for downstream consumers and public repositories.',
    decisions: [
      'Built flexible export pathways to support external data exchange.',
      'Aligned outputs with repository-specific format needs.',
    ],
    tradeoffs: [
      'Format support breadth versus pipeline maintenance burden.',
      'Export speed versus final-stage validation depth.',
    ],
    impact: ['Improved collaboration and external data discoverability.'],
    tech: ['Serverless pipelines', 'Schema transforms', 'Submission automation'],
    usedIn: ['system-idpcc', 'system-sdmcc'],
    activeModes: ['architecture', 'impact'],
  },
  {
    id: 'cap-audit',
    kind: 'capability',
    lane: 'capabilities',
    label: 'Auditing and Observability',
    summary: 'Serverless operational audit trails and reliability controls across pipelines.',
    decisions: [
      'Implemented lightweight, repeatable auditing with Lambda + IaC.',
      'Embedded traceability into platform operations and data flows.',
    ],
    tradeoffs: [
      'More observability signals require disciplined alert tuning.',
      'Audit capture depth can raise operational storage costs.',
    ],
    impact: ['Higher operational confidence and traceable data processing.'],
    tech: ['AWS Lambda', 'CloudFormation', 'Monitoring patterns'],
    usedIn: ['system-sdmcc', 'system-nci', 'system-idpcc'],
    activeModes: ['architecture', 'impact', 'leadership'],
  },
  {
    id: 'cap-genai',
    kind: 'capability',
    lane: 'capabilities',
    label: 'GenAI Assistant Layer',
    summary: 'LLM and agentic workflow overlay for contextual repository interaction.',
    decisions: [
      'Built chatbot and workflow demos using RAG and vector retrieval concepts.',
      'Used AI to categorize and summarize unstructured reports into JSON.',
      'Promoted AI capability through demos and strategic enablement.',
    ],
    tradeoffs: [
      'Rapid AI iteration requires active guardrails and evaluation discipline.',
      'Context quality directly impacts usefulness of generated responses.',
    ],
    impact: [
      'Simplified complex data search and interaction for end users.',
      'Accelerated organizational readiness for GenAI initiatives.',
    ],
    tech: ['OpenAI GPT', 'AWS Bedrock', 'LangChain', 'RAG', 'Vector workflows'],
    microMetric: 'Agentic workflows demonstrated',
    usedIn: ['system-idpcc', 'system-chief-of-staff'],
    activeModes: ['architecture', 'impact', 'leadership'],
  },
]

export const resumeEdges: ResumeEdge[] = [
  {
    id: 'e-providers-idpcc',
    source: 'actor-providers',
    target: 'system-idpcc',
    relation: 'data_flow',
    activeModes: ['architecture', 'impact'],
    label: 'submission',
  },
  {
    id: 'e-providers-nci',
    source: 'actor-providers',
    target: 'system-nci',
    relation: 'data_flow',
    activeModes: ['architecture', 'impact'],
  },
  {
    id: 'e-leadership-idpcc',
    source: 'actor-leadership',
    target: 'system-idpcc',
    relation: 'ownership',
    activeModes: ['architecture', 'leadership'],
  },
  {
    id: 'e-leadership-sdmcc',
    source: 'actor-leadership',
    target: 'system-sdmcc',
    relation: 'ownership',
    activeModes: ['architecture', 'leadership'],
  },
  {
    id: 'e-leadership-nci',
    source: 'actor-leadership',
    target: 'system-nci',
    relation: 'ownership',
    activeModes: ['architecture', 'leadership'],
  },
  {
    id: 'e-idpcc-researchers',
    source: 'system-idpcc',
    target: 'actor-researchers',
    relation: 'data_flow',
    activeModes: ['architecture', 'impact'],
    label: 'discovery',
  },
  {
    id: 'e-sdmcc-researchers',
    source: 'system-sdmcc',
    target: 'actor-researchers',
    relation: 'data_flow',
    activeModes: ['architecture', 'impact'],
  },
  {
    id: 'e-nci-researchers',
    source: 'system-nci',
    target: 'actor-researchers',
    relation: 'data_flow',
    activeModes: ['architecture', 'impact'],
  },
  {
    id: 'e-idpcc-repositories',
    source: 'system-idpcc',
    target: 'actor-repositories',
    relation: 'data_flow',
    activeModes: ['architecture', 'impact'],
    label: 'export',
  },
  {
    id: 'e-chief-idpcc',
    source: 'system-chief-of-staff',
    target: 'system-idpcc',
    relation: 'influence',
    activeModes: ['architecture', 'leadership'],
  },
  {
    id: 'e-chief-sdmcc',
    source: 'system-chief-of-staff',
    target: 'system-sdmcc',
    relation: 'influence',
    activeModes: ['architecture', 'leadership'],
  },
  {
    id: 'e-chief-nci',
    source: 'system-chief-of-staff',
    target: 'system-nci',
    relation: 'influence',
    activeModes: ['architecture', 'leadership'],
  },
  {
    id: 'e-chief-ccos',
    source: 'system-chief-of-staff',
    target: 'system-ccos',
    relation: 'influence',
    activeModes: ['architecture', 'leadership'],
  },
  {
    id: 'e-ingestion-idpcc',
    source: 'cap-ingestion',
    target: 'system-idpcc',
    relation: 'enables',
    activeModes: ['architecture', 'impact'],
  },
  {
    id: 'e-ingestion-sdmcc',
    source: 'cap-ingestion',
    target: 'system-sdmcc',
    relation: 'enables',
    activeModes: ['architecture', 'impact'],
  },
  {
    id: 'e-ingestion-nci',
    source: 'cap-ingestion',
    target: 'system-nci',
    relation: 'enables',
    activeModes: ['architecture', 'impact'],
  },
  {
    id: 'e-modeling-idpcc',
    source: 'cap-modeling',
    target: 'system-idpcc',
    relation: 'enables',
    activeModes: ['architecture', 'impact'],
  },
  {
    id: 'e-modeling-nci',
    source: 'cap-modeling',
    target: 'system-nci',
    relation: 'enables',
    activeModes: ['architecture', 'impact'],
  },
  {
    id: 'e-nosql-idpcc',
    source: 'cap-nosql-query',
    target: 'system-idpcc',
    relation: 'enables',
    activeModes: ['architecture', 'impact'],
  },
  {
    id: 'e-nosql-ccos',
    source: 'cap-nosql-query',
    target: 'system-ccos',
    relation: 'enables',
    activeModes: ['architecture', 'impact'],
  },
  {
    id: 'e-search-idpcc',
    source: 'cap-search',
    target: 'system-idpcc',
    relation: 'enables',
    activeModes: ['architecture', 'impact'],
  },
  {
    id: 'e-search-nci',
    source: 'cap-search',
    target: 'system-nci',
    relation: 'enables',
    activeModes: ['architecture', 'impact'],
  },
  {
    id: 'e-quality-idpcc',
    source: 'cap-quality',
    target: 'system-idpcc',
    relation: 'enables',
    activeModes: ['architecture', 'impact'],
  },
  {
    id: 'e-quality-nci',
    source: 'cap-quality',
    target: 'system-nci',
    relation: 'enables',
    activeModes: ['architecture', 'impact'],
  },
  {
    id: 'e-export-idpcc',
    source: 'cap-export',
    target: 'system-idpcc',
    relation: 'enables',
    activeModes: ['architecture', 'impact'],
  },
  {
    id: 'e-export-sdmcc',
    source: 'cap-export',
    target: 'system-sdmcc',
    relation: 'enables',
    activeModes: ['architecture', 'impact'],
  },
  {
    id: 'e-audit-idpcc',
    source: 'cap-audit',
    target: 'system-idpcc',
    relation: 'enables',
    activeModes: ['architecture', 'impact', 'leadership'],
  },
  {
    id: 'e-audit-sdmcc',
    source: 'cap-audit',
    target: 'system-sdmcc',
    relation: 'enables',
    activeModes: ['architecture', 'impact', 'leadership'],
  },
  {
    id: 'e-audit-nci',
    source: 'cap-audit',
    target: 'system-nci',
    relation: 'enables',
    activeModes: ['architecture', 'impact', 'leadership'],
  },
  {
    id: 'e-genai-idpcc',
    source: 'cap-genai',
    target: 'system-idpcc',
    relation: 'enables',
    activeModes: ['architecture', 'impact', 'leadership'],
  },
  {
    id: 'e-genai-chief',
    source: 'cap-genai',
    target: 'system-chief-of-staff',
    relation: 'influence',
    activeModes: ['architecture', 'leadership'],
  },
  {
    id: 'e-ibm-idpcc',
    source: 'system-ibm',
    target: 'system-idpcc',
    relation: 'influence',
    activeModes: ['architecture'],
    label: 'foundation',
  },
]

export const publications: ResumePublication[] = [
  {
    title: 'ETLlm: Enhancing Data Pipelines with Large Language Models',
    href: 'https://medium.com/@bmarko_99572/etllm-enhancing-data-pipelines-with-large-language-models-d37eec2d5dc6',
    source: 'Medium',
  },
  {
    title: 'How Digital Infuzion Solves Large-Scale Scientific Data Collaboration with Amazon QuickSight',
    href: 'https://aws.amazon.com/blogs/big-data/how-digital-infuzion-solves-the-challenge-of-large-scale-scientific-data-collaboration-with-amazon-quicksight/',
    source: 'AWS Big Data Blog',
  },
  {
    title: 'Unleash Your Inner Dynamo: Write to DynamoDB with AWS State Machines and Impress Your Data',
    href: 'https://medium.com/@bmarko_99572/unleash-your-inner-dynamo-write-to-dynamodb-with-aws-state-machines-and-impress-your-data-4b13c3a7fb28',
    source: 'Medium',
  },
  {
    title: 'Efficient Data Analysis: Analyzing DynamoDB Data in Real-Time with AWS Athena',
    href: 'https://medium.com/@bmarko_99572/using-aws-athena-with-dynamodb-896f7a59af57',
    source: 'Medium',
  },
]

export const awards: ResumeAward[] = [
  { title: 'Digital Infuzion Manager of the Year', year: '2023' },
  { title: 'Most Innovative & Employee of the Year Nominee', year: '2018' },
  { title: 'Digital Infuzion Action of Talk Award', year: '2017' },
  { title: 'IBM Services Excellence Award', year: '2015' },
  { title: 'IBM Managers Choice Award', year: '2014' },
  { title: 'IBM Eminence & Excellence Award', year: '2012' },
]
