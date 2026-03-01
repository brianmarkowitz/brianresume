import { useCallback, useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
  type NodeTypes,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { ErdInspector } from './components/ErdInspector'
import { ErdTableNode, type ErdTableNodeData } from './components/ErdTableNode'
import { StandardResume } from './components/StandardResume'
import { erdRelations, erdTables, type ErdRelation, type ErdTable } from './data/erdSchema'
import { tableBrowseContent } from './data/resumeBrowse'

const nodeTypes: NodeTypes = {
  erdTable: ErdTableNode,
}

const tableById = new Map(erdTables.map((table) => [table.id, table]))
const tablePositionById = new Map(erdTables.map((table) => [table.id, table.position]))
type ViewMode = 'erd' | 'resume'

function readTableFromUrl(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  const tableId = new URLSearchParams(window.location.search).get('table')
  if (!tableId || !tableById.has(tableId)) {
    return null
  }

  return tableId
}

function readViewFromUrl(): ViewMode {
  if (typeof window === 'undefined') {
    return 'erd'
  }

  const view = new URLSearchParams(window.location.search).get('view')
  return view === 'resume' ? 'resume' : 'erd'
}

function edgeHandles(sourceId: string, targetId: string) {
  const source = tablePositionById.get(sourceId)
  const target = tablePositionById.get(targetId)

  if (!source || !target) {
    return { sourceHandle: 's-right', targetHandle: 't-left' }
  }

  const dx = target.x - source.x
  const dy = target.y - source.y

  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0
      ? { sourceHandle: 's-right', targetHandle: 't-left' }
      : { sourceHandle: 's-left', targetHandle: 't-right' }
  }

  return dy >= 0
    ? { sourceHandle: 's-bottom', targetHandle: 't-top' }
    : { sourceHandle: 's-top', targetHandle: 't-bottom' }
}

function App() {
  const [selectedTableId, setSelectedTableId] = useState<string | null>(() => readTableFromUrl() ?? 'employee')
  const [selectedRelationId, setSelectedRelationId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>(() => readViewFromUrl())

  useEffect(() => {
    const onPopState = () => {
      setSelectedTableId(readTableFromUrl() ?? 'employee')
      setViewMode(readViewFromUrl())
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    if (selectedTableId) {
      params.set('table', selectedTableId)
    } else {
      params.delete('table')
    }

    if (viewMode === 'resume') {
      params.set('view', 'resume')
    } else {
      params.delete('view')
    }

    const next = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`
    window.history.replaceState(null, '', next)
  }, [selectedTableId, viewMode])

  const selectedTable = useMemo<ErdTable | null>(() => {
    if (!selectedTableId) {
      return null
    }

    return tableById.get(selectedTableId) ?? null
  }, [selectedTableId])

  const activeRelation = useMemo<ErdRelation | null>(() => {
    if (!selectedRelationId) {
      return null
    }

    return erdRelations.find((relation) => relation.id === selectedRelationId) ?? null
  }, [selectedRelationId])

  const selectedRelations = useMemo<ErdRelation[]>(() => {
    if (!selectedTableId) {
      return []
    }

    return erdRelations.filter((relation) => relation.source === selectedTableId || relation.target === selectedTableId)
  }, [selectedTableId])

  const relatedTables = useMemo<ErdTable[]>(() => {
    if (!selectedTableId) {
      return []
    }

    const relatedIds = new Set<string>()

    for (const relation of selectedRelations) {
      if (relation.source === selectedTableId) {
        relatedIds.add(relation.target)
      }

      if (relation.target === selectedTableId) {
        relatedIds.add(relation.source)
      }
    }

    return Array.from(relatedIds)
      .map((tableId) => tableById.get(tableId))
      .filter((table): table is ErdTable => Boolean(table))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [selectedRelations, selectedTableId])

  const content = selectedTableId ? tableBrowseContent[selectedTableId] ?? null : null

  const highlighted = useMemo(() => {
    const highlightedTableIds = new Set<string>()
    const highlightedRelationIds = new Set<string>()

    const pivotTableIds = [selectedTableId].filter(Boolean) as string[]

    for (const pivotId of pivotTableIds) {
      highlightedTableIds.add(pivotId)

      for (const relation of erdRelations) {
        if (relation.source === pivotId || relation.target === pivotId) {
          highlightedRelationIds.add(relation.id)
          highlightedTableIds.add(relation.source)
          highlightedTableIds.add(relation.target)
        }
      }
    }

    if (selectedRelationId) {
      highlightedRelationIds.add(selectedRelationId)
      const selectedRelation = erdRelations.find((relation) => relation.id === selectedRelationId)
      if (selectedRelation) {
        highlightedTableIds.add(selectedRelation.source)
        highlightedTableIds.add(selectedRelation.target)
      }
    }

    return { highlightedTableIds, highlightedRelationIds }
  }, [selectedRelationId, selectedTableId])

  const focusContextActive = Boolean(selectedTableId || selectedRelationId)

  const handleSelectTable = useCallback((tableId: string) => {
    setSelectedTableId(tableId)
    setSelectedRelationId(null)
  }, [])

  const handleHoverTable = useCallback(() => {
    // Hover state is intentionally no-op to avoid graph-wide hover flicker.
  }, [])

  const flowNodes = useMemo<Array<Node<ErdTableNodeData>>>(() => {
    return erdTables.map((table) => {
      const width = table.id === 'employee' ? 360 : table.id === 'employee_skills' ? 290 : 340
      const isSelected = table.id === selectedTableId
      const isConnected = highlighted.highlightedTableIds.has(table.id)
      const isDimmed = focusContextActive && !isSelected && !isConnected

      return {
        id: table.id,
        type: 'erdTable',
        position: table.position,
        draggable: false,
        selectable: true,
        focusable: true,
        data: {
          id: table.id,
          name: table.name,
          columns: table.columns,
          isSelected,
          isConnected,
          isDimmed,
          onSelect: handleSelectTable,
          onHover: handleHoverTable,
        },
        style: { width },
      }
    })
  }, [focusContextActive, handleHoverTable, handleSelectTable, highlighted.highlightedTableIds, selectedTableId])

  const flowEdges = useMemo<Array<Edge>>(() => {
    return erdRelations.map((relation) => {
      const handles = edgeHandles(relation.source, relation.target)
      const isHighlighted = highlighted.highlightedRelationIds.has(relation.id)
      const isSelected = selectedRelationId === relation.id
      const isDimmed = focusContextActive && !isHighlighted
      const color = isDimmed ? '#9aa8bc' : isSelected ? '#0f5a94' : '#4f647d'

      return {
        id: relation.id,
        source: relation.source,
        target: relation.target,
        sourceHandle: handles.sourceHandle,
        targetHandle: handles.targetHandle,
        type: 'smoothstep',
        label: relation.cardinality,
        labelStyle: {
          fontSize: 11,
          fill: '#334155',
          fontFamily: '"IBM Plex Mono", monospace',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 16,
          height: 16,
          color,
        },
        className: clsx('erd-edge', {
          'is-highlighted': isHighlighted,
          'is-selected': isSelected,
          'is-dimmed': isDimmed,
        }),
        style: {
          stroke: color,
          strokeWidth: isSelected ? 3.1 : isHighlighted ? 2.6 : 1.7,
          opacity: isDimmed ? 0.36 : 0.95,
        },
      }
    })
  }, [focusContextActive, highlighted.highlightedRelationIds, selectedRelationId])

  return (
    <div className="page-shell erd-page" id="top">
      <nav className="erd-navbar" aria-label="Primary">
        <a href="#top" className="erd-brand">
          Brian Markowitz
        </a>
        <div className="erd-view-toggle" role="tablist" aria-label="View switch">
          <button
            type="button"
            role="tab"
            className={clsx('erd-view-button', { active: viewMode === 'erd' })}
            aria-selected={viewMode === 'erd'}
            onClick={() => setViewMode('erd')}
          >
            ERD Controller
          </button>
          <button
            type="button"
            role="tab"
            className={clsx('erd-view-button', { active: viewMode === 'resume' })}
            aria-selected={viewMode === 'resume'}
            onClick={() => setViewMode('resume')}
          >
            Standard Resume
          </button>
        </div>
        <div className="erd-social-links" aria-label="Social links">
          <a
            href="https://www.linkedin.com/in/brian-markowitz-126709/"
            target="_blank"
            rel="noreferrer"
            className="erd-icon-link linkedin"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.28 8.1h4.4V24H.28V8.1ZM8.42 8.1h4.21v2.17h.06c.58-1.11 2.03-2.29 4.18-2.29 4.47 0 5.29 2.94 5.29 6.77V24h-4.4v-7.98c0-1.9-.03-4.34-2.64-4.34-2.64 0-3.04 2.06-3.04 4.2V24H8.42V8.1Z" />
            </svg>
          </a>
          <a
            href="https://github.com/bmarko"
            target="_blank"
            rel="noreferrer"
            className="erd-icon-link github"
            aria-label="GitHub"
            title="GitHub"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.1c-3.34.73-4.04-1.42-4.04-1.42-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.83 1.23 1.83 1.23 1.08 1.84 2.82 1.31 3.5 1 .1-.78.42-1.31.77-1.61-2.67-.3-5.48-1.33-5.48-5.93 0-1.31.47-2.39 1.23-3.23-.12-.3-.53-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.65.24 2.87.12 3.17.77.84 1.23 1.92 1.23 3.23 0 4.61-2.82 5.62-5.5 5.92.43.37.82 1.1.82 2.22v3.3c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
            </svg>
          </a>
        </div>
      </nav>

      {viewMode === 'resume' ? (
        <StandardResume />
      ) : (
        <section className="erd-layout" aria-label="Entity relationship diagram workspace" id="diagram">
          <div className="erd-canvas-wrap" aria-label="Entity relationship diagram">
            <div className="erd-canvas-hint">
              <strong>Control Mode</strong>
              <span>Table click: browse records</span>
              <span>Edge click: move to related table</span>
            </div>
            {activeRelation ? (
              <div className="erd-active-relation" aria-live="polite">
                Active Path: {activeRelation.source}.{activeRelation.sourceColumn} -&gt; {activeRelation.target}.
                {activeRelation.targetColumn}
              </div>
            ) : null}
            <ReactFlow
              fitView
              fitViewOptions={{ padding: 0.045, maxZoom: 0.96 }}
              nodes={flowNodes}
              edges={flowEdges}
              nodeTypes={nodeTypes}
              minZoom={0.12}
              maxZoom={1.4}
              panOnDrag
              zoomOnDoubleClick={false}
              nodesConnectable={false}
              elementsSelectable
              onNodeClick={(_, node) => {
                setSelectedTableId(node.id)
                setSelectedRelationId(null)
              }}
              onEdgeClick={(_, edge) => {
                const relation = erdRelations.find((item) => item.id === edge.id)
                if (!relation) {
                  return
                }

                setSelectedRelationId(relation.id)

                if (selectedTableId === relation.target) {
                  setSelectedTableId(relation.source)
                } else {
                  setSelectedTableId(relation.target)
                }
              }}
              onPaneClick={() => {
                setSelectedRelationId(null)
              }}
            >
              <Background gap={24} color="#d7e0ea" />
              <Controls showInteractive={false} />
              <MiniMap pannable zoomable position="bottom-right" nodeBorderRadius={8} />
            </ReactFlow>
          </div>

          <div id="browser">
            <ErdInspector
              table={selectedTable}
              content={content}
              relatedTables={relatedTables}
              onSelectTable={handleSelectTable}
            />
          </div>
        </section>
      )}
    </div>
  )
}

export default App
