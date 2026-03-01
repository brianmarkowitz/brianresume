import { tableBrowseContent, type BrowseField, type BrowseRecord } from '../data/resumeBrowse'

interface ResumeSection {
  id: string
  title: string
  contentId: keyof typeof tableBrowseContent
}

const sectionOrder: ResumeSection[] = [
  { id: 'experience', title: 'Experience', contentId: 'experience' },
  { id: 'projects', title: 'Projects', contentId: 'projects' },
  { id: 'skills', title: 'Skills', contentId: 'skills' },
  { id: 'certifications', title: 'Certifications', contentId: 'certifications' },
  { id: 'publications', title: 'Publications', contentId: 'publications' },
  { id: 'awards', title: 'Awards', contentId: 'awards' },
]

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
    field.label.toLowerCase().includes('github')
  ) {
    return `https://${value}`
  }

  return null
}

function ResumeRecordCard({ record }: { record: BrowseRecord }) {
  return (
    <article className="resume-record-card">
      <header className="resume-record-head">
        <h3>{record.title}</h3>
        {record.subtitle ? <p>{record.subtitle}</p> : null}
      </header>
      <dl className="resume-field-grid">
        {record.fields.map((field, index) => {
          const href = asLink(field)

          return (
            <div key={`${record.title}-${field.label}-${index}`}>
              <dt>{field.label}</dt>
              <dd>
                {href ? (
                  <a href={href} target={href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer">
                    {field.value}
                  </a>
                ) : (
                  field.value
                )}
              </dd>
            </div>
          )
        })}
      </dl>
    </article>
  )
}

export function StandardResume() {
  const profile = tableBrowseContent.employee.records[0]
  const summary = findField(profile, 'Summary')
  const contactLabels = ['Email', 'Phone', 'LinkedIn', 'GitHub', 'Google Scholar']

  return (
    <main className="resume-shell" aria-label="Standard resume view">
      <header className="resume-header">
        <div className="resume-title-block">
          <p className="resume-kicker">Standard Resume</p>
          <h1>{profile?.title ?? 'Brian Markowitz'}</h1>
          <p className="resume-role">{profile?.subtitle ?? 'Principal Data Architect'}</p>
          {summary ? <p className="resume-summary">{summary}</p> : null}
        </div>

        <ul className="resume-contact-list">
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

      <nav className="resume-jump-nav" aria-label="Resume section links">
        {sectionOrder.map((section) => (
          <a key={section.id} href={`#resume-${section.id}`}>
            {section.title}
          </a>
        ))}
      </nav>

      <div className="resume-section-list">
        {sectionOrder.map((section) => {
          const content = tableBrowseContent[section.contentId]

          return (
            <section key={section.id} className="resume-section" id={`resume-${section.id}`}>
              <header className="resume-section-head">
                <h2>{section.title}</h2>
                <p>{content.description}</p>
              </header>

              <div className="resume-record-grid">
                {content.records.map((record, index) => (
                  <ResumeRecordCard key={`${section.id}-${record.title}-${index}`} record={record} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </main>
  )
}
