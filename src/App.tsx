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
import { AnimatePresence, motion } from 'framer-motion'
import 'reactflow/dist/style.css'
import { ArchitectureNode, type ArchitectureNodeData } from './components/ArchitectureNode'
import { DetailPanel } from './components/DetailPanel'
import { ModeToggle } from './components/ModeToggle'
import {
  awards,
  publications,
  resumeEdges,
  resumeNodes,
  type EdgeRelation,
  type GraphMode,
  type ResumeNode,
} from './data/resumeGraph'

const nodeTypes: NodeTypes = {
  architectureNode: ArchitectureNode,
}

const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  'actor-researchers': { x: 30, y: 34 },
  'actor-leadership': { x: 380, y: 34 },
  'actor-providers': { x: 760, y: 34 },
  'actor-repositories': { x: 1120, y: 34 },
  'system-idpcc': { x: 70, y: 270 },
  'system-sdmcc': { x: 350, y: 270 },
  'system-nci': { x: 630, y: 270 },
  'system-ccos': { x: 910, y: 270 },
  'system-ibm': { x: 1190, y: 270 },
  'system-chief-of-staff': { x: 980, y: 412 },
  'cap-ingestion': { x: 24, y: 596 },
  'cap-modeling': { x: 214, y: 596 },
  'cap-nosql-query': { x: 404, y: 596 },
  'cap-search': { x: 594, y: 596 },
  'cap-quality': { x: 784, y: 596 },
  'cap-export': { x: 974, y: 596 },
  'cap-audit': { x: 1164, y: 596 },
  'cap-genai': { x: 1354, y: 596 },
}

const MODE_VALUES: GraphMode[] = ['architecture', 'impact', 'leadership']

const relationColors: Record<EdgeRelation, string> = {
  data_flow: '#0f766e',
  ownership: '#1d3557',
  influence: '#915f00',
  enables: '#2f855a',
}

const laneHeights = {
  actors: 122,
  systems: 348,
  capabilities: 578,
}

const nodeById = new Map(resumeNodes.map((node) => [node.id, node]))

function readModeFromUrl(): GraphMode {
  if (typeof window === 'undefined') {
    return 'architecture'
  }

  const mode = new URLSearchParams(window.location.search).get('mode')
  if (!mode || !MODE_VALUES.includes(mode as GraphMode)) {
    return 'architecture'
  }

  return mode as GraphMode
}

function readNodeFromUrl(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  const node = new URLSearchParams(window.location.search).get('node')
  if (!node) {
    return null
  }

  return nodeById.has(node) ? node : null
}

function edgeHandles(sourceId: string, targetId: string) {
  const sourcePosition = NODE_POSITIONS[sourceId]
  const targetPosition = NODE_POSITIONS[targetId]

  if (!sourcePosition || !targetPosition) {
    return { sourceHandle: 's-bottom', targetHandle: 't-top' }
  }

  return sourcePosition.y <= targetPosition.y
    ? { sourceHandle: 's-bottom', targetHandle: 't-top' }
    : { sourceHandle: 's-top', targetHandle: 't-bottom' }
}

function App() {
  const [mode, setMode] = useState<GraphMode>(readModeFromUrl)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(readNodeFromUrl)
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)

  const selectedNode = useMemo<ResumeNode | null>(() => {
    if (!selectedNodeId) {
      return null
    }

    return nodeById.get(selectedNodeId) ?? null
  }, [selectedNodeId])

  useEffect(() => {
    const onPopState = () => {
      setMode(readModeFromUrl())
      setSelectedNodeId(readNodeFromUrl())
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    params.set('mode', mode)

    if (selectedNodeId) {
      params.set('node', selectedNodeId)
    } else {
      params.delete('node')
    }

    const next = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState(null, '', next)
  }, [mode, selectedNodeId])

  const highlighted = useMemo(() => {
    const highlightedNodeIds = new Set<string>()
    const highlightedEdgeIds = new Set<string>()

    const pivotNodes = [hoveredNodeId, selectedNodeId].filter(Boolean) as string[]

    for (const pivot of pivotNodes) {
      highlightedNodeIds.add(pivot)

      for (const edge of resumeEdges) {
        if (edge.source === pivot || edge.target === pivot) {
          highlightedEdgeIds.add(edge.id)
          highlightedNodeIds.add(edge.source)
          highlightedNodeIds.add(edge.target)
        }
      }
    }

    return { highlightedNodeIds, highlightedEdgeIds }
  }, [hoveredNodeId, selectedNodeId])

  const focusContextActive = Boolean(hoveredNodeId || selectedNodeId)

  const handleSelect = useCallback((id: string) => {
    setSelectedNodeId(id)
  }, [])

  const handleHover = useCallback((id: string | null) => {
    setHoveredNodeId(id)
  }, [])

  const flowNodes = useMemo<Array<Node<ArchitectureNodeData>>>(() => {
    return resumeNodes.map((node) => {
      const modeActive = node.activeModes.includes(mode)
      const isSelected = node.id === selectedNodeId
      const isConnected = highlighted.highlightedNodeIds.has(node.id)

      const isDimmed =
        !modeActive || (focusContextActive && !isConnected && !isSelected && node.id !== hoveredNodeId)

      const widthByKind =
        node.kind === 'capability' ? 182 : node.kind === 'actor' ? 248 : node.kind === 'leadership' ? 265 : 252

      return {
        id: node.id,
        type: 'architectureNode',
        position: NODE_POSITIONS[node.id],
        draggable: false,
        selectable: true,
        focusable: true,
        data: {
          id: node.id,
          kind: node.kind,
          label: node.label,
          microMetric: node.microMetric,
          isSelected,
          isDimmed,
          isConnected,
          onSelect: handleSelect,
          onHover: handleHover,
        },
        style: { width: widthByKind },
      }
    })
  }, [focusContextActive, handleHover, handleSelect, highlighted.highlightedNodeIds, hoveredNodeId, mode, selectedNodeId])

  const flowEdges = useMemo<Array<Edge>>(() => {
    return resumeEdges.map((edge) => {
      const modeActive = edge.activeModes.includes(mode)
      const isHighlighted = highlighted.highlightedEdgeIds.has(edge.id)
      const isDimmed = !modeActive || (focusContextActive && !isHighlighted)

      const color = isDimmed ? '#9ca3af' : relationColors[edge.relation]
      const handles = edgeHandles(edge.source, edge.target)

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: handles.sourceHandle,
        targetHandle: handles.targetHandle,
        type: 'smoothstep',
        label: edge.label,
        labelStyle: {
          fontSize: 11,
          fill: '#344055',
          fontFamily: '"IBM Plex Mono", monospace',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 18,
          height: 18,
          color,
        },
        className: clsx('arch-edge', `relation-${edge.relation}`, {
          'edge-active': isHighlighted,
          'edge-dimmed': isDimmed,
        }),
        style: {
          stroke: color,
          strokeWidth: isHighlighted ? 3 : 1.9,
          opacity: isDimmed ? 0.4 : 0.92,
        },
      }
    })
  }, [focusContextActive, highlighted.highlightedEdgeIds, mode])

  return (
    <div className="page-shell" data-mode={mode}>
      <motion.header
        className="hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <p className="eyebrow">Brian Markowitz | Systems I Have Built</p>
        <h1>Principal Data Architect and Functional Manager</h1>
        <p className="lead-copy">
          I design and modernize cloud-native platforms for healthcare and scientific research, focusing
          on serverless architecture, high-scale discovery, governance, and GenAI-driven user
          experiences.
        </p>
        <div className="hero-links">
          <a href="https://www.linkedin.com/in/brian-markowitz-126709/" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href="mailto:bmarko@gmail.com">bmarko@gmail.com</a>
          <span>Rockville, MD</span>
        </div>
      </motion.header>

      <ModeToggle mode={mode} onModeChange={setMode} />

      <section className="canvas-layout" aria-label="Interactive system architecture diagram">
        <motion.div
          className="flow-shell"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.12 }}
        >
          <div className="lane-markers">
            <span style={{ top: laneHeights.actors }}>Users and Stakeholders</span>
            <span style={{ top: laneHeights.systems }}>Core Platforms and Leadership Systems</span>
            <span style={{ top: laneHeights.capabilities }}>Reusable Architecture Capabilities</span>
          </div>
          <ReactFlow
            fitView
            fitViewOptions={{ padding: 0.15, maxZoom: 1.02 }}
            nodes={flowNodes}
            edges={flowEdges}
            nodeTypes={nodeTypes}
            elementsSelectable
            nodesConnectable={false}
            minZoom={0.35}
            maxZoom={1.5}
            panOnDrag={false}
            onNodeClick={(_, node) => setSelectedNodeId(node.id)}
            onNodeMouseEnter={(_, node) => setHoveredNodeId(node.id)}
            onNodeMouseLeave={() => setHoveredNodeId(null)}
          >
            <Background gap={26} color="#dbe3ec" />
            <Controls showInteractive={false} />
            <MiniMap pannable zoomable nodeBorderRadius={10} position="bottom-right" />
          </ReactFlow>
        </motion.div>

        <aside className="panel-wrap desktop-panel">
          <DetailPanel node={selectedNode} onClose={() => setSelectedNodeId(null)} />
        </aside>
      </section>

      <AnimatePresence>
        {selectedNode ? (
          <motion.div
            className="mobile-panel"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <DetailPanel node={selectedNode} onClose={() => setSelectedNodeId(null)} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.section
        className="meta-grid"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <article className="meta-card">
          <h2>Publications</h2>
          <ul>
            {publications.map((publication) => (
              <li key={publication.href}>
                <a href={publication.href} target="_blank" rel="noreferrer">
                  {publication.title}
                </a>
                <small>{publication.source}</small>
              </li>
            ))}
          </ul>
        </article>

        <article className="meta-card">
          <h2>Awards</h2>
          <ul className="award-list">
            {awards.map((award) => (
              <li key={`${award.title}-${award.year}`}>
                <span>{award.title}</span>
                <strong>{award.year}</strong>
              </li>
            ))}
          </ul>
        </article>

        <article className="meta-card">
          <h2>Contact</h2>
          <p>
            Built for recruiters, engineering leaders, and research stakeholders who want to evaluate
            systems thinking, decision quality, and execution impact.
          </p>
          <div className="hero-links stacked">
            <a href="mailto:bmarko@gmail.com">Email Brian</a>
            <a href="https://www.linkedin.com/in/brian-markowitz-126709/" target="_blank" rel="noreferrer">
              Connect on LinkedIn
            </a>
          </div>
        </article>
      </motion.section>
    </div>
  )
}

export default App
