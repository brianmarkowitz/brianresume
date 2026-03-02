import { tableBrowseContent, type BrowseField, type BrowseRecord } from '../data/resumeBrowse'

interface StandardResumeProps {
  onOpenErd?: () => void
}

function findField(record: BrowseRecord | undefined, label: string): string | null {
  if (!record) {
    return null
  }

  const field = record.fields.find((entry) => entry.label.toLowerCase() === label.toLowerCase())
  return field?.value ?? null
}

function asLink(field: BrowseField): string | null {
  const value = field.value.trim()

  if (!value) {
    return null
  }

  if (field.label.toLowerCase() === 'email') {
    return `mailto:${value}`
  }

  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value
  }

  if (
    field.label.toLowerCase().includes('url') ||
    field.label.toLowerCase().includes('linkedin') ||
    field.label.toLowerCase().includes('github') ||
    field.label.toLowerCase().includes('doi')
  ) {
    return `https://${value}`
  }

  return null
}

function extractFirstYear(value: string | null): number | null {
  if (!value) {
    return null
  }

  const match = value.match(/\b(19|20)\d{2}\b/)
  if (!match) {
    return null
  }

  const year = Number.parseInt(match[0], 10)
  return Number.isFinite(year) ? year : null
}

function splitCsv(value: string | null): string[] {
  if (!value) {
    return []
  }

  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
}

export function StandardResume({ onOpenErd }: StandardResumeProps) {
  const profile = tableBrowseContent.employee.records[0]
  const summary = findField(profile, 'Summary')
  const experience = tableBrowseContent.experience.records
  const projects = tableBrowseContent.projects.records
  const skills = tableBrowseContent.skills.records
  const skillAssignments = tableBrowseContent.employee_skills.records
  const certifications = tableBrowseContent.certifications.records
  const publications = tableBrowseContent.publications.records
  const awards = tableBrowseContent.awards.records

  const startYears = experience
    .map((record) => extractFirstYear(findField(record, 'Period')))
    .filter((year): year is number => year !== null)
  const earliestYear = startYears.length ? Math.min(...startYears) : new Date().getFullYear()
  const yearsOfExperience = Math.max(1, new Date().getFullYear() - earliestYear)

  const activePrograms = projects.filter((record) => (findField(record, 'Date Range') ?? '').includes('Present')).length

  const contactLabels = ['Email', 'Phone', 'LinkedIn', 'GitHub', 'Google Scholar']
  const proficiencyBySkill = new Map(skillAssignments.map((record) => [record.subtitle, findField(record, 'Proficiency')]))
  const groupedSkills = new Map<string, Array<{ skill: string; proficiency: string | null }>>()

  for (const skill of skills) {
    const lane = skill.subtitle ?? 'Core'
    const row = groupedSkills.get(lane) ?? []
    row.push({ skill: skill.title, proficiency: proficiencyBySkill.get(skill.title) ?? null })
    groupedSkills.set(lane, row)
  }

  const metrics = [
    { label: 'Years in Data Architecture', value: `${yearsOfExperience}+` },
    { label: 'Active Research Programs', value: `${activePrograms}` },
    { label: 'Published Articles', value: `${publications.length}` },
    { label: 'Certifications + Awards', value: `${certifications.length + awards.length}` },
  ]

  return (
    <main className="resume-story-shell" aria-label="Resume narrative view">
      <header className="resume-story-hero">
        <div className="resume-story-intro">
          <p className="resume-story-kicker">Resume Story</p>
          <h1>{profile?.title ?? 'Brian Markowitz'}</h1>
          <p className="resume-story-role">{profile?.subtitle ?? 'Principal Data Architect'}</p>
          {summary ? <p className="resume-story-summary">{summary}</p> : null}
          <div className="resume-story-actions">
            {onOpenErd ? (
              <button type="button" className="resume-explorer-button" onClick={onOpenErd}>
                Open ERD Explorer
              </button>
            ) : null}
          </div>
        </div>

        <ul className="resume-contact-strip">
          {contactLabels.map((label) => {
            const value = findField(profile, label)
            if (!value) {
              return null
            }

            const href = asLink({ label, value })

            return (
              <li key={label}>
                <span>{label}</span>
                {href ? (
                  <a href={href} target={href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer">
                    {value}
                  </a>
                ) : (
                  <strong>{value}</strong>
                )}
              </li>
            )
          })}
        </ul>
      </header>

      <section className="resume-metric-band" aria-label="Resume impact snapshot">
        {metrics.map((metric) => (
          <article key={metric.label} className="resume-metric-card">
            <p>{metric.label}</p>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </section>

      <section className="resume-story-grid">
        <article className="resume-story-panel timeline-panel">
          <header className="resume-panel-head">
            <h2>Career Timeline</h2>
            <p>Core positions and focus areas.</p>
          </header>
          <div className="timeline-list">
            {experience.map((record, index) => (
              <article key={`${record.title}-${record.subtitle}-${index}`} className="timeline-item">
                <span className="timeline-period">{findField(record, 'Period') ?? 'Current'}</span>
                <div className="timeline-content">
                  <h3>{record.subtitle ?? record.title}</h3>
                  <p className="timeline-company">{record.title}</p>
                  <p>{findField(record, 'Focus') ?? 'No focus details provided.'}</p>
                  <div className="timeline-chip-wrap">
                    {splitCsv(findField(record, 'Technologies') ?? findField(record, 'Tools')).map((chip) => (
                      <span key={`${record.title}-${chip}`} className="timeline-chip">
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="resume-story-panel projects-panel">
          <header className="resume-panel-head">
            <h2>Flagship Projects</h2>
            <p>Modernization programs with measurable platform impact.</p>
          </header>
          <div className="project-story-grid">
            {projects.map((record) => (
              <article key={record.title} className="project-story-card">
                <p className="project-range">{findField(record, 'Date Range') ?? 'Current'}</p>
                <h3>{record.title}</h3>
                <p>{record.subtitle ?? 'Program detail'}</p>
                <div className="timeline-chip-wrap">
                  {splitCsv(findField(record, 'Technologies')).map((chip) => (
                    <span key={`${record.title}-${chip}`} className="timeline-chip">
                      {chip}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="resume-story-grid bottom">
        <article className="resume-story-panel skills-panel">
          <header className="resume-panel-head">
            <h2>Skill Lanes</h2>
            <p>Primary technology lanes and depth level.</p>
          </header>
          <div className="skill-lane-grid">
            {Array.from(groupedSkills.entries()).map(([lane, laneSkills]) => (
              <article key={lane} className="skill-lane-card">
                <h3>{lane}</h3>
                <ul>
                  {laneSkills.map((entry) => (
                    <li key={`${lane}-${entry.skill}`}>
                      <span>{entry.skill}</span>
                      <strong>{entry.proficiency ?? 'Core'}</strong>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </article>

        <article className="resume-story-panel thought-panel">
          <header className="resume-panel-head">
            <h2>Publications</h2>
            <p>Selected writing and thought leadership.</p>
          </header>
          <div className="thought-list">
            {publications.map((record) => (
              <article key={record.title} className="thought-item">
                <h3>{record.title}</h3>
                <p>{record.subtitle ?? 'Publication'}</p>
                <p className="thought-meta">{findField(record, 'Publication Date')}</p>
                {findField(record, 'DOI/URL') ? (
                  <a
                    href={asLink({ label: 'DOI/URL', value: findField(record, 'DOI/URL') ?? '' }) ?? undefined}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open publication
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </article>

        <article className="resume-story-panel credentials-panel">
          <header className="resume-panel-head">
            <h2>Credentials and Recognition</h2>
            <p>Recent certifications and awards.</p>
          </header>
          <div className="credential-block">
            <h3>Certifications</h3>
            <ul>
              {certifications.map((record) => (
                <li key={record.title}>
                  <span>{record.title}</span>
                  <strong>{findField(record, 'Issue Date') ?? 'N/A'}</strong>
                </li>
              ))}
            </ul>
          </div>
          <div className="credential-block">
            <h3>Awards</h3>
            <ul>
              {awards.map((record) => (
                <li key={record.title}>
                  <span>{record.title}</span>
                  <strong>{findField(record, 'Award Date') ?? 'N/A'}</strong>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </section>
    </main>
  )
}
