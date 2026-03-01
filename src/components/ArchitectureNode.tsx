import type { KeyboardEvent, MouseEvent, PointerEvent } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import clsx from 'clsx'
import type { NodeKind } from '../data/resumeGraph'

export interface ArchitectureNodeData {
  id: string
  label: string
  kind: NodeKind
  microMetric?: string
  isDimmed: boolean
  isSelected: boolean
  isConnected: boolean
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}

export function ArchitectureNode({ data }: NodeProps<ArchitectureNodeData>) {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      data.onSelect(data.id)
    }
  }

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    data.onSelect(data.id)
  }

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.stopPropagation()
  }

  return (
    <>
      <Handle type="source" id="s-top" position={Position.Top} className="hidden-handle" />
      <Handle type="source" id="s-bottom" position={Position.Bottom} className="hidden-handle" />
      <Handle type="target" id="t-top" position={Position.Top} className="hidden-handle" />
      <Handle type="target" id="t-bottom" position={Position.Bottom} className="hidden-handle" />
      <button
        type="button"
        className={clsx('arch-node', `kind-${data.kind}`, {
          'is-selected': data.isSelected,
          'is-dimmed': data.isDimmed,
          'is-connected': data.isConnected,
        })}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onMouseEnter={() => data.onHover(data.id)}
        onMouseLeave={() => data.onHover(null)}
        onFocus={() => data.onHover(data.id)}
        onBlur={() => data.onHover(null)}
        onKeyDown={handleKeyDown}
        aria-label={data.label}
      >
        <span className="node-label">{data.label}</span>
        {data.microMetric ? <span className="metric-pill">{data.microMetric}</span> : null}
      </button>
    </>
  )
}
