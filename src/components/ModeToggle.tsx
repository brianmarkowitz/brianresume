import clsx from 'clsx'
import { modeLabels, type GraphMode } from '../data/resumeGraph'

interface ModeToggleProps {
  mode: GraphMode
  onModeChange: (mode: GraphMode) => void
}

const MODES: GraphMode[] = ['architecture', 'impact', 'leadership']

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="mode-toggle" role="tablist" aria-label="Diagram view mode">
      {MODES.map((entry) => (
        <button
          key={entry}
          type="button"
          role="tab"
          className={clsx('mode-button', { active: mode === entry })}
          onClick={() => onModeChange(entry)}
          aria-selected={mode === entry}
          aria-label={modeLabels[entry]}
        >
          {modeLabels[entry]}
        </button>
      ))}
    </div>
  )
}
