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

export function ErdTableNode({ data }: NodeProps<ErdTableNodeData>) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      data.onSelect(data.id)
    }
  }

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

      <div className="erd-table-header">{data.name}</div>
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
