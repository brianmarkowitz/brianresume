import type { KeyboardEvent } from 'react'
import clsx from 'clsx'
import { Handle, Position, type NodeProps } from 'reactflow'
import type { ErdColumn } from '../data/erdSchema'

export interface ErdTableNodeData {
  id: string
  name: string
  columns: ErdColumn[]
  isSelected: boolean
  isConnected: boolean
  isDimmed: boolean
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}

function formatTableName(name: string): string {
  return name
    .split('_')
    .map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`)
    .join(' ')
}

function TableIcon({ tableId }: { tableId: string }) {
  switch (tableId) {
    case 'employee':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 12c2.9 0 5.2-2.35 5.2-5.25S14.9 1.5 12 1.5 6.8 3.85 6.8 6.75 9.1 12 12 12Z" />
          <path d="M3.2 21.5c.9-4.5 4.5-7 8.8-7s7.9 2.5 8.8 7" />
        </svg>
      )
    case 'resume':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 2.5h6l4 4v14a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-17a1 1 0 0 1 1-1Z" />
          <path d="M14 2.5v4h4" />
          <path d="M9.5 11h5M9.5 14h5M9.5 17h3.5" />
        </svg>
      )
    case 'experience':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8.5 5.5h7v3h-7z" />
          <path d="M4 8.5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1Z" />
          <path d="M3 13h18" />
        </svg>
      )
    case 'projects':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M2.5 6.5A1.5 1.5 0 0 1 4 5h5l1.6 2H20a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 20 19H4a1.5 1.5 0 0 1-1.5-1.5v-11Z" />
          <path d="M2.5 9.5h19" />
        </svg>
      )
    case 'skills':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m12 2.5 2.3 4.65 5.2.75-3.75 3.65.88 5.15L12 14.35 7.37 16.7l.88-5.15L4.5 7.9l5.2-.75L12 2.5Z" />
        </svg>
      )
    case 'employee_skills':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9.5 8.5 7 6a3 3 0 0 0-4.25 4.25l2.5 2.5A3 3 0 0 0 9.5 8.5Z" />
          <path d="m14.5 15.5 2.5 2.5a3 3 0 0 0 4.25-4.25l-2.5-2.5a3 3 0 0 0-4.25 4.25Z" />
          <path d="m8 16 8-8" />
        </svg>
      )
    case 'certifications':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.5 14.7 5l3.6-.2.8 3.5 3 2.1-1.9 3.1.2 3.6-3.5.8-2.1 3-3.1-1.9-3.6.2-.8-3.5-3-2.1 1.9-3.1-.2-3.6 3.5-.8 2.1-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      )
    case 'publications':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 4.5h7a3 3 0 0 1 3 3v12a3 3 0 0 0-3-3H4v-12Z" />
          <path d="M20 4.5h-7a3 3 0 0 0-3 3v12a3 3 0 0 1 3-3h7v-12Z" />
        </svg>
      )
    case 'awards':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 3.5h8v2.7a4 4 0 0 1-4 4 4 4 0 0 1-4-4V3.5Z" />
          <path d="M6 5.5H3.5A2.5 2.5 0 0 0 6 8h1M18 5.5h2.5A2.5 2.5 0 0 1 18 8h-1" />
          <path d="M12 10.2v4.3M9 20.5h6M10 14.5h4v2H10z" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 7.5 12 3l8 4.5-8 4.5L4 7.5Z" />
          <path d="M4 12.5 12 17l8-4.5M4 17.5 12 22l8-4.5" />
        </svg>
      )
  }
}

export function ErdTableNode({ data }: NodeProps<ErdTableNodeData>) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      data.onSelect(data.id)
    }
  }

  const displayName = formatTableName(data.name)

  return (
    <div
      className={clsx('erd-table-node', {
        'is-selected': data.isSelected,
        'is-connected': data.isConnected,
        'is-dimmed': data.isDimmed,
      })}
      aria-label={data.name}
      role="button"
      tabIndex={0}
      aria-pressed={data.isSelected}
      onFocus={() => data.onHover(data.id)}
      onBlur={() => data.onHover(null)}
      onKeyDown={handleKeyDown}
      onClick={() => data.onSelect(data.id)}
    >
      <Handle type="source" id="s-top" position={Position.Top} className="hidden-handle" />
      <Handle type="source" id="s-right" position={Position.Right} className="hidden-handle" />
      <Handle type="source" id="s-bottom" position={Position.Bottom} className="hidden-handle" />
      <Handle type="source" id="s-left" position={Position.Left} className="hidden-handle" />
      <Handle type="target" id="t-top" position={Position.Top} className="hidden-handle" />
      <Handle type="target" id="t-right" position={Position.Right} className="hidden-handle" />
      <Handle type="target" id="t-bottom" position={Position.Bottom} className="hidden-handle" />
      <Handle type="target" id="t-left" position={Position.Left} className="hidden-handle" />

      <div className="erd-table-header" title={data.name}>
        <span className="erd-table-icon">
          <TableIcon tableId={data.id} />
        </span>
        <span className="erd-table-title">{displayName}</span>
      </div>
      <ul className="erd-columns">
        {data.columns.map((column) => (
          <li key={column.name} className="erd-column-row">
            <div className="erd-column-name-wrap">
              {column.isPrimaryKey ? <span className="key-badge pk">PK</span> : null}
              {column.isForeignKey ? <span className="key-badge fk">FK</span> : null}
              <span className="erd-column-name">{column.name}</span>
            </div>
            <span className="erd-column-type">{column.type}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
