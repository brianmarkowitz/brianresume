import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react'
import clsx from 'clsx'
import {
  Background,
  MarkerType,
  ReactFlow,
  type FitViewOptions,
  type ReactFlowInstance,
  type Edge,
  type Node,
  type NodeTypes,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { ErdInspector } from './components/ErdInspector'
import { ErdTableNode, type ErdTableNodeData } from './components/ErdTableNode'
import { StandardResume } from './components/StandardResume'
import { ThemeToggle } from './components/ThemeToggle'
import { erdRelations, erdTables, type ErdRelation, type ErdTable } from './data/erdSchema'
import { tableBrowseContent } from './data/resumeBrowse'

const nodeTypes: NodeTypes = {
  erdTable: ErdTableNode,
}

const tableById = new Map(erdTables.map((table) => [table.id, table]))
const tablePositionById = new Map(erdTables.map((table) => [table.id, table.position]))
type ViewMode = 'erd' | 'resume'

const STACKED_LAYOUT_BREAKPOINT = 1300
const SPLITTER_WIDTH = 14
const DEFAULT_CANVAS_RATIO = 0.6
const MIN_CANVAS_WIDTH = 620
const MIN_INSPECTOR_WIDTH = 420
const SPLIT_RATIO_STORAGE_KEY = 'interactive-resume:erd-split-ratio'
const FIT_VIEW_OPTIONS: FitViewOptions = { padding: 0.045, maxZoom: 0.96 }

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

  const params = new URLSearchParams(window.location.search)
  const explicitView = params.get('view')

  if (explicitView === 'erd' || explicitView === 'resume') {
    return explicitView
  }

  const tableId = params.get('table')
  if (tableId && tableById.has(tableId)) {
    return 'erd'
  }

  return 'erd'
}

function readSplitRatioFromStorage(): number {
  if (typeof window === 'undefined') {
    return DEFAULT_CANVAS_RATIO
  }

  const stored = window.localStorage.getItem(SPLIT_RATIO_STORAGE_KEY)
  if (!stored) {
    return DEFAULT_CANVAS_RATIO
  }

  const parsed = Number.parseFloat(stored)
  return Number.isFinite(parsed) ? parsed : DEFAULT_CANVAS_RATIO
}

function getCanvasRatioBounds(totalWidth: number): { min: number; max: number } {
  const availableWidth = totalWidth - SPLITTER_WIDTH
  if (availableWidth <= 0) {
    return { min: DEFAULT_CANVAS_RATIO, max: DEFAULT_CANVAS_RATIO }
  }

  const min = MIN_CANVAS_WIDTH / availableWidth
  const max = 1 - MIN_INSPECTOR_WIDTH / availableWidth

  if (min >= max) {
    return { min: DEFAULT_CANVAS_RATIO, max: DEFAULT_CANVAS_RATIO }
  }

  return { min, max }
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
  const [layoutWidth, setLayoutWidth] = useState(0)
  const [isResizingPanes, setIsResizingPanes] = useState(false)
  const [canvasRatio, setCanvasRatio] = useState<number>(() => readSplitRatioFromStorage())
  const layoutRef = useRef<HTMLElement | null>(null)
  const flowRef = useRef<ReactFlowInstance | null>(null)
  const fitFrameRef = useRef<number | null>(null)

  const clampCanvasRatio = useCallback((ratio: number, totalWidth: number) => {
    const { min, max } = getCanvasRatioBounds(totalWidth)
    return Math.min(Math.max(ratio, min), max)
  }, [])

  const syncLayoutWidth = useCallback(() => {
    const layoutElement = layoutRef.current
    if (!layoutElement) {
      return
    }

    const nextWidth = layoutElement.getBoundingClientRect().width
    setLayoutWidth(nextWidth)

    if (nextWidth >= STACKED_LAYOUT_BREAKPOINT) {
      setCanvasRatio((current) => clampCanvasRatio(current, nextWidth))
    }
  }, [clampCanvasRatio])

  const updateCanvasRatioFromClientX = useCallback(
    (clientX: number) => {
      const layoutElement = layoutRef.current
      if (!layoutElement) {
        return
      }

      const rect = layoutElement.getBoundingClientRect()
      if (rect.width < STACKED_LAYOUT_BREAKPOINT) {
        return
      }

      const availableWidth = rect.width - SPLITTER_WIDTH
      if (availableWidth <= 0) {
        return
      }

      const nextRatio = (clientX - rect.left - SPLITTER_WIDTH / 2) / availableWidth
      setCanvasRatio(clampCanvasRatio(nextRatio, rect.width))
    },
    [clampCanvasRatio],
  )

  const canResizePanes = viewMode === 'erd' && layoutWidth >= STACKED_LAYOUT_BREAKPOINT
  const splitterBounds = useMemo(() => getCanvasRatioBounds(layoutWidth), [layoutWidth])
  const scheduleFitView = useCallback(
    (duration = 120) => {
      if (typeof window === 'undefined') {
        return
      }

      if (fitFrameRef.current !== null) {
        window.cancelAnimationFrame(fitFrameRef.current)
      }

      fitFrameRef.current = window.requestAnimationFrame(() => {
        fitFrameRef.current = null
        flowRef.current?.fitView({
          ...FIT_VIEW_OPTIONS,
          duration: isResizingPanes ? 0 : duration,
        })
      })
    },
    [isResizingPanes],
  )

  const erdLayoutStyle = useMemo<CSSProperties | undefined>(() => {
    if (!canResizePanes) {
      return undefined
    }

    return {
      gridTemplateColumns: `minmax(${MIN_CANVAS_WIDTH}px, ${(canvasRatio * 100).toFixed(2)}%) ${SPLITTER_WIDTH}px minmax(${MIN_INSPECTOR_WIDTH}px, 1fr)`,
    }
  }, [canResizePanes, canvasRatio])

  const handleSplitterPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (!canResizePanes) {
        return
      }

      event.preventDefault()
      event.currentTarget.setPointerCapture(event.pointerId)
      setIsResizingPanes(true)
      updateCanvasRatioFromClientX(event.clientX)
    },
    [canResizePanes, updateCanvasRatioFromClientX],
  )

  const handleSplitterPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (!isResizingPanes) {
        return
      }

      event.preventDefault()
      updateCanvasRatioFromClientX(event.clientX)
    },
    [isResizingPanes, updateCanvasRatioFromClientX],
  )

  const handleSplitterPointerUp = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    setIsResizingPanes(false)
  }, [])

  const handleSplitterKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>) => {
      if (!canResizePanes) {
        return
      }

      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
        const delta = event.key === 'ArrowLeft' ? -0.02 : 0.02
        setCanvasRatio((current) => clampCanvasRatio(current + delta, layoutWidth))
      }

      if (event.key === 'Home') {
        event.preventDefault()
        setCanvasRatio(splitterBounds.min)
      }

      if (event.key === 'End') {
        event.preventDefault()
        setCanvasRatio(splitterBounds.max)
      }
    },
    [canResizePanes, clampCanvasRatio, layoutWidth, splitterBounds.max, splitterBounds.min],
  )

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

    if (viewMode === 'erd' && selectedTableId) {
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

  useEffect(() => {
    if (viewMode !== 'erd') {
      return
    }

    syncLayoutWidth()
    const layoutElement = layoutRef.current
    if (!layoutElement) {
      return
    }

    if (typeof window.ResizeObserver === 'function') {
      const observer = new window.ResizeObserver(() => {
        syncLayoutWidth()
      })
      observer.observe(layoutElement)
      return () => observer.disconnect()
    }

    window.addEventListener('resize', syncLayoutWidth)
    return () => window.removeEventListener('resize', syncLayoutWidth)
  }, [syncLayoutWidth, viewMode])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(SPLIT_RATIO_STORAGE_KEY, canvasRatio.toFixed(4))
  }, [canvasRatio])

  useEffect(() => {
    document.body.classList.toggle('is-resizing-erd-split', isResizingPanes)
    return () => document.body.classList.remove('is-resizing-erd-split')
  }, [isResizingPanes])

  useEffect(() => {
    if (viewMode !== 'erd') {
      return
    }

    scheduleFitView()
  }, [canvasRatio, layoutWidth, scheduleFitView, viewMode])

  useEffect(() => {
    return () => {
      if (fitFrameRef.current !== null) {
        window.cancelAnimationFrame(fitFrameRef.current)
      }
    }
  }, [])

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

  const handleSelectTable = useCallback((tableId: string) => {
    setSelectedTableId(tableId)
    setSelectedRelationId(null)
  }, [])

  const handleHoverTable = useCallback(() => {
    // Hover state is intentionally no-op to avoid graph-wide hover flicker.
  }, [])

  const flowNodes = useMemo<Array<Node<ErdTableNodeData>>>(() => {
    const activePath = selectedRelationId ? erdRelations.find((relation) => relation.id === selectedRelationId) : null

    return erdTables.map((table) => {
      const width = table.id === 'employee' ? 360 : table.id === 'employee_skills' ? 290 : 340
      const isSelected = table.id === selectedTableId
      const isConnected = Boolean(activePath && (table.id === activePath.source || table.id === activePath.target))

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
          isDimmed: false,
          onSelect: handleSelectTable,
          onHover: handleHoverTable,
        },
        style: { width },
      }
    })
  }, [handleHoverTable, handleSelectTable, selectedRelationId, selectedTableId])

  const flowEdges = useMemo<Array<Edge>>(() => {
    return erdRelations.map((relation) => {
      const handles = edgeHandles(relation.source, relation.target)
      const isSelected = selectedRelationId === relation.id

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
          fill: 'var(--slate-500)',
          fontFamily: 'var(--font-mono)',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 16,
          height: 16,
          color: isSelected ? 'var(--accent)' : 'var(--slate-500)',
        },
        className: clsx('erd-edge', {
          'is-selected': isSelected,
        }),
        style: {
          stroke: isSelected ? 'var(--accent)' : 'var(--line-strong)',
          strokeWidth: isSelected ? 3.1 : 1.9,
          opacity: 0.92,
        },
      }
    })
  }, [selectedRelationId])

  return (
    <div
      className={clsx('page-shell erd-page', {
        'is-erd-view': viewMode === 'erd',
        'is-resume-view': viewMode === 'resume',
      })}
      id="top"
    >
      <nav className="erd-navbar" aria-label="Primary">
        <div className="erd-brand-block">
          <span className="erd-brand-kicker">Interactive Resume</span>
          <a href="#top" className="erd-brand">
            Brian Markowitz
          </a>
        </div>
        <div className="erd-right-actions">
          <button
            type="button"
            className="erd-nav-switch"
            onClick={() => {
              setIsResizingPanes(false)
              setViewMode((currentViewMode) => (currentViewMode === 'erd' ? 'resume' : 'erd'))
            }}
            aria-label={viewMode === 'erd' ? 'Open resume story view' : 'Open ERD explorer'}
          >
            {viewMode === 'erd' ? 'Resume Story' : 'ERD Explorer'}
          </button>
          <div className="erd-social-links" aria-label="Social links">
            <ThemeToggle />
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
              href="https://github.com/brianmarkowitz"
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
        </div>
      </nav>

      {viewMode === 'resume' ? (
        <StandardResume onOpenErd={() => setViewMode('erd')} />
      ) : (
        <section
          ref={layoutRef}
          className={clsx('erd-layout', { 'is-resizing': isResizingPanes })}
          style={erdLayoutStyle}
          aria-label="Entity relationship diagram workspace"
          id="diagram"
        >
          <div className="erd-canvas-wrap" aria-label="Entity relationship diagram">
            {activeRelation ? (
              <div className="erd-active-relation" aria-live="polite">
                Active Path: {activeRelation.source}.{activeRelation.sourceColumn} -&gt; {activeRelation.target}.
                {activeRelation.targetColumn}
              </div>
            ) : null}
            <ReactFlow
              fitView
              fitViewOptions={FIT_VIEW_OPTIONS}
              nodes={flowNodes}
              edges={flowEdges}
              nodeTypes={nodeTypes}
              minZoom={0.12}
              maxZoom={1.4}
              panOnDrag={false}
              panOnScroll={false}
              zoomOnScroll={false}
              zoomOnPinch={false}
              zoomOnDoubleClick={false}
              nodesDraggable={false}
              selectionOnDrag={false}
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
              onInit={(instance) => {
                flowRef.current = instance
                scheduleFitView(0)
              }}
            >
              <Background gap={24} color="var(--grid-major)" />
            </ReactFlow>
          </div>

          <button
            type="button"
            className={clsx('erd-pane-divider', { 'is-active': isResizingPanes })}
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize diagram and resume panes"
            aria-valuemin={Math.round(splitterBounds.min * 100)}
            aria-valuemax={Math.round(splitterBounds.max * 100)}
            aria-valuenow={Math.round(canvasRatio * 100)}
            onPointerDown={handleSplitterPointerDown}
            onPointerMove={handleSplitterPointerMove}
            onPointerUp={handleSplitterPointerUp}
            onPointerCancel={handleSplitterPointerUp}
            onLostPointerCapture={() => setIsResizingPanes(false)}
            onKeyDown={handleSplitterKeyDown}
            disabled={!canResizePanes}
          />

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
