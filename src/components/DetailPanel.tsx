import type { ResumeNode } from '../data/resumeGraph'

interface DetailPanelProps {
  node: ResumeNode | null
  onClose: () => void
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="panel-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

export function DetailPanel({ node, onClose }: DetailPanelProps) {
  if (!node) {
    return (
      <section className="panel-card panel-empty" aria-live="polite">
        <h2>Select a system node</h2>
        <p>
          Click any actor, platform, or capability in the architecture map to inspect role,
          decisions, tradeoffs, and outcomes.
        </p>
      </section>
    )
  }

  return (
    <section className="panel-card" aria-live="polite">
      <div className="panel-header">
        <div>
          <p className="panel-kicker">{node.kind.toUpperCase()}</p>
          <h2>{node.label}</h2>
          <p>{node.summary}</p>
        </div>
        <button type="button" className="ghost-button" onClick={onClose} aria-label="Close details panel">
          Close
        </button>
      </div>

      {node.role ? (
        <div>
          <h3>Role</h3>
          <p>{node.role}</p>
        </div>
      ) : null}

      {node.problem ? (
        <div>
          <h3>Problem</h3>
          <p>{node.problem}</p>
        </div>
      ) : null}

      <div>
        <h3>Decisions Made</h3>
        <BulletList items={node.decisions} />
      </div>

      <div>
        <h3>Tradeoffs</h3>
        <BulletList items={node.tradeoffs} />
      </div>

      <div>
        <h3>Impact Metrics</h3>
        <BulletList items={node.impact} />
      </div>

      <div>
        <h3>Tech Stack</h3>
        <div className="chip-wrap">
          {node.tech.map((item) => (
            <span className="chip" key={item}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {node.usedIn?.length ? (
        <div>
          <h3>Where I Used This</h3>
          <div className="chip-wrap">
            {node.usedIn.map((item) => (
              <span className="chip" key={item}>
                {item.replace('system-', '').replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {node.legacyProjects?.length ? (
        <details className="legacy-details">
          <summary>Expand selected legacy projects</summary>
          <ul className="panel-list">
            {node.legacyProjects.map((project) => (
              <li key={project}>{project}</li>
            ))}
          </ul>
        </details>
      ) : null}

      {node.links?.length ? (
        <div>
          <h3>Related Links</h3>
          <ul className="panel-list links">
            {node.links.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  )
}
