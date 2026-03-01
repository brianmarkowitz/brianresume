export interface ErdColumn {
  name: string
  type: string
  isPrimaryKey?: boolean
  isForeignKey?: boolean
}

export interface ErdTable {
  id: string
  name: string
  columns: ErdColumn[]
  position: {
    x: number
    y: number
  }
}

export interface ErdRelation {
  id: string
  source: string
  target: string
  sourceColumn: string
  targetColumn: string
  cardinality: '1:1' | '1:N' | 'N:N'
}

export const erdTables: ErdTable[] = [
  {
    id: 'employee',
    name: 'employee',
    position: { x: 20, y: 24 },
    columns: [
      { name: 'employee_id', type: 'int', isPrimaryKey: true },
      { name: 'first_name', type: 'varchar(50)' },
      { name: 'last_name', type: 'varchar(50)' },
      { name: 'email', type: 'varchar(100)' },
      { name: 'phone_number', type: 'varchar(20)' },
      { name: 'linkedin_url', type: 'varchar(255)' },
      { name: 'github_url', type: 'varchar(255)' },
      { name: 'google_scholar_url', type: 'varchar(255)' },
      { name: 'role', type: 'varchar(50)' },
      { name: 'professional_summary', type: 'text' },
      { name: 'created_at', type: 'timestamp' },
      { name: 'updated_at', type: 'timestamp' },
    ],
  },
  {
    id: 'resume',
    name: 'resume',
    position: { x: 390, y: 24 },
    columns: [
      { name: 'resume_id', type: 'int', isPrimaryKey: true },
      { name: 'employee_id', type: 'int', isForeignKey: true },
      { name: 'file_name', type: 'varchar(100)' },
      { name: 'file_type', type: 'varchar(20)' },
      { name: 'raw_text', type: 'longtext' },
      { name: 'extraction_status', type: 'varchar(50)' },
      { name: 'upload_date', type: 'timestamp' },
      { name: 'processed_date', type: 'timestamp' },
    ],
  },
  {
    id: 'skills',
    name: 'skills',
    position: { x: 760, y: 24 },
    columns: [
      { name: 'skill_id', type: 'int', isPrimaryKey: true },
      { name: 'skill_name', type: 'varchar(100)' },
      { name: 'skill_category', type: 'varchar(50)' },
    ],
  },
  {
    id: 'employee_skills',
    name: 'employee_skills',
    position: { x: 1130, y: 24 },
    columns: [
      { name: 'employee_id', type: 'int', isPrimaryKey: true, isForeignKey: true },
      { name: 'skill_id', type: 'int', isPrimaryKey: true, isForeignKey: true },
      { name: 'proficiency', type: 'varchar(50)' },
    ],
  },
  {
    id: 'experience',
    name: 'experience',
    position: { x: 20, y: 458 },
    columns: [
      { name: 'experience_id', type: 'int', isPrimaryKey: true },
      { name: 'employee_id', type: 'int', isForeignKey: true },
      { name: 'company_name', type: 'varchar(100)' },
      { name: 'role_title', type: 'varchar(100)' },
      { name: 'start_date', type: 'date' },
      { name: 'end_date', type: 'date' },
      { name: 'technologies', type: 'text' },
      { name: 'scientific_focus', type: 'text' },
      { name: 'project_management_tools', type: 'text' },
      { name: 'description', type: 'text' },
    ],
  },
  {
    id: 'projects',
    name: 'projects',
    position: { x: 390, y: 458 },
    columns: [
      { name: 'project_id', type: 'int', isPrimaryKey: true },
      { name: 'employee_id', type: 'int', isForeignKey: true },
      { name: 'project_name', type: 'varchar(100)' },
      { name: 'project_type', type: 'varchar(50)' },
      { name: 'role', type: 'varchar(100)' },
      { name: 'description', type: 'text' },
      { name: 'technologies_used', type: 'text' },
      { name: 'start_date', type: 'date' },
      { name: 'end_date', type: 'date' },
    ],
  },
  {
    id: 'certifications',
    name: 'certifications',
    position: { x: 760, y: 458 },
    columns: [
      { name: 'certification_id', type: 'int', isPrimaryKey: true },
      { name: 'employee_id', type: 'int', isForeignKey: true },
      { name: 'certification_name', type: 'varchar(100)' },
      { name: 'issuing_body', type: 'varchar(100)' },
      { name: 'issue_date', type: 'date' },
      { name: 'expiry_date', type: 'date' },
      { name: 'certification_type', type: 'varchar(50)' },
    ],
  },
  {
    id: 'publications',
    name: 'publications',
    position: { x: 1130, y: 458 },
    columns: [
      { name: 'publication_id', type: 'int', isPrimaryKey: true },
      { name: 'employee_id', type: 'int', isForeignKey: true },
      { name: 'title', type: 'varchar(255)' },
      { name: 'journal_name', type: 'varchar(255)' },
      { name: 'publication_date', type: 'date' },
      { name: 'doi_url', type: 'varchar(255)' },
      { name: 'research_area', type: 'varchar(100)' },
    ],
  },
  {
    id: 'awards',
    name: 'awards',
    position: { x: 390, y: 865 },
    columns: [
      { name: 'award_id', type: 'int', isPrimaryKey: true },
      { name: 'employee_id', type: 'int', isForeignKey: true },
      { name: 'award_name', type: 'varchar(100)' },
      { name: 'awarding_body', type: 'varchar(100)' },
      { name: 'award_date', type: 'date' },
      { name: 'award_category', type: 'varchar(50)' },
    ],
  },
]

export const erdRelations: ErdRelation[] = [
  {
    id: 'employee-resume',
    source: 'employee',
    target: 'resume',
    sourceColumn: 'employee_id',
    targetColumn: 'employee_id',
    cardinality: '1:N',
  },
  {
    id: 'employee-experience',
    source: 'employee',
    target: 'experience',
    sourceColumn: 'employee_id',
    targetColumn: 'employee_id',
    cardinality: '1:N',
  },
  {
    id: 'employee-projects',
    source: 'employee',
    target: 'projects',
    sourceColumn: 'employee_id',
    targetColumn: 'employee_id',
    cardinality: '1:N',
  },
  {
    id: 'employee-awards',
    source: 'employee',
    target: 'awards',
    sourceColumn: 'employee_id',
    targetColumn: 'employee_id',
    cardinality: '1:N',
  },
  {
    id: 'employee-certifications',
    source: 'employee',
    target: 'certifications',
    sourceColumn: 'employee_id',
    targetColumn: 'employee_id',
    cardinality: '1:N',
  },
  {
    id: 'employee-publications',
    source: 'employee',
    target: 'publications',
    sourceColumn: 'employee_id',
    targetColumn: 'employee_id',
    cardinality: '1:N',
  },
  {
    id: 'employee-employee_skills',
    source: 'employee',
    target: 'employee_skills',
    sourceColumn: 'employee_id',
    targetColumn: 'employee_id',
    cardinality: '1:N',
  },
  {
    id: 'skills-employee_skills',
    source: 'skills',
    target: 'employee_skills',
    sourceColumn: 'skill_id',
    targetColumn: 'skill_id',
    cardinality: '1:N',
  },
]
