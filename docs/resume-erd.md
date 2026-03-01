# Resume ERD

```mermaid
erDiagram
  employee {
    int employee_id PK
    varchar_50 first_name
    varchar_50 last_name
    varchar_100 email
    varchar_20 phone_number
    varchar_255 linkedin_url
    varchar_255 github_url
    varchar_255 google_scholar_url
    varchar_50 role
    text professional_summary
    timestamp created_at
    timestamp updated_at
  }

  resume {
    int resume_id PK
    int employee_id FK
    varchar_100 file_name
    varchar_20 file_type
    longtext raw_text
    varchar_50 extraction_status
    timestamp upload_date
    timestamp processed_date
  }

  experience {
    int experience_id PK
    int employee_id FK
    varchar_100 company_name
    varchar_100 role_title
    date start_date
    date end_date
    text technologies
    text scientific_focus
    text project_management_tools
    text description
  }

  projects {
    int project_id PK
    int employee_id FK
    varchar_100 project_name
    varchar_50 project_type
    varchar_100 role
    text description
    text technologies_used
    date start_date
    date end_date
  }

  awards {
    int award_id PK
    int employee_id FK
    varchar_100 award_name
    varchar_100 awarding_body
    date award_date
    varchar_50 award_category
  }

  certifications {
    int certification_id PK
    int employee_id FK
    varchar_100 certification_name
    varchar_100 issuing_body
    date issue_date
    date expiry_date
    varchar_50 certification_type
  }

  publications {
    int publication_id PK
    int employee_id FK
    varchar_255 title
    varchar_255 journal_name
    date publication_date
    varchar_255 doi_url
    varchar_100 research_area
  }

  skills {
    int skill_id PK
    varchar_100 skill_name
    varchar_50 skill_category
  }

  employee_skills {
    int employee_id FK
    int skill_id FK
    varchar_50 proficiency
  }

  employee ||--o{ resume : has
  employee ||--o{ experience : has
  employee ||--o{ projects : has
  employee ||--o{ awards : has
  employee ||--o{ certifications : has
  employee ||--o{ publications : has
  employee ||--o{ employee_skills : has
  skills ||--o{ employee_skills : has
```

## Notes

- `employee_skills` is the join table for the many-to-many relationship between `employee` and `skills`.
- `employee_skills.employee_id` + `employee_skills.skill_id` should be treated as a composite primary key.
- The ERD mirrors the schema shown in your reference diagram.
