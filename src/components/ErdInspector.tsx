import type { ErdTable } from '../data/erdSchema'
import type { BrowseRecord, TableBrowseContent } from '../data/resumeBrowse'

interface ErdInspectorProps {
  table: ErdTable | null
  content: TableBrowseContent | null
  relatedTables: ErdTable[]
  onSelectTable: (tableId: string) => void
}

function formatTableLabel(tableName: string): string {
  return tableName
    .split('_')
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(' ')
}

function RecordCard({ record }: { record: BrowseRecord }) {
  return (
    <article className="erd-record-card">
      <h4>{record.title}</h4>
      {record.subtitle ? <p className="erd-record-subtitle">{record.subtitle}</p> : null}
      <dl className="erd-field-list">
        {record.fields.map((field) => (
          <div key={`${record.title}-${field.label}`}>
            <dt>{field.label}</dt>
            <dd>{field.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  )
}

export function ErdInspector({ table, content, relatedTables, onSelectTable }: ErdInspectorProps) {
  if (!table) {
    return (
      <aside className="erd-inspector" aria-live="polite">
        <div className="erd-resume-context">
          <p className="panel-kicker">Brian Markowitz Resume</p>
          <p className="erd-resume-context-copy">Interactive resume entity browser.</p>
        </div>
        <h2>Resume Browser</h2>
        <p>Select any table in the ERD to browse resume records and navigate table relationships.</p>
      </aside>
    )
  }

  return (
    <aside className="erd-inspector" aria-live="polite">
      <div className="erd-resume-context">
        <p className="panel-kicker">Brian Markowitz Resume</p>
        <p className="erd-resume-context-copy">Interactive resume entity browser.</p>
      </div>

      <div className="erd-inspector-head">
        <p className="panel-kicker">Table</p>
        <h2>{formatTableLabel(table.name)}</h2>
        <p>{content?.description ?? 'No record preview is defined for this table.'}</p>
      </div>

      <section>
        <h3>Related Tables</h3>
        <div className="erd-chip-wrap">
          {relatedTables.length ? (
            relatedTables.map((relatedTable) => (
              <button
                key={relatedTable.id}
                type="button"
                className="erd-chip-button"
                data-testid={`related-table-${relatedTable.id}`}
                onClick={() => onSelectTable(relatedTable.id)}
              >
                {formatTableLabel(relatedTable.name)}
              </button>
            ))
          ) : (
            <p className="erd-empty-copy">No direct relationships.</p>
          )}
        </div>
      </section>

      <section>
        <h3>Record Preview</h3>
        {content?.records.length ? (
          <div className="erd-record-list">
            {content.records.map((record) => (
              <RecordCard key={record.title} record={record} />
            ))}
          </div>
        ) : (
          <p className="erd-empty-copy">No records configured.</p>
        )}
      </section>
    </aside>
  )
}
