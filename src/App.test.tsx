import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { ThemeProvider } from './context/ThemeContext'

function renderApp() {
  return render(
    <ThemeProvider>
      <App />
    </ThemeProvider>,
  )
}

describe('App', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/')
  })

  it('renders the ERD explorer by default', () => {
    renderApp()

    expect(screen.getByRole('navigation', { name: /primary/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /resume story/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/entity relationship diagram workspace/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Employee' })).toBeInTheDocument()
    expect(screen.getByRole('separator', { name: /resize diagram and resume panes/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /arrange nodes in a different layout/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reset node arrangement/i })).toBeInTheDocument()
  })

  it('opens table details from URL and supports relationship navigation', async () => {
    window.history.replaceState(null, '', '/?table=employee')
    const user = userEvent.setup()
    renderApp()

    expect(screen.getByRole('button', { name: /resume story/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/entity relationship diagram workspace/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Employee' })).toBeInTheDocument()
    expect(screen.getByTestId('related-table-awards')).toBeInTheDocument()

    await user.click(screen.getByTestId('related-table-awards'))

    expect(screen.getByRole('heading', { level: 2, name: 'Awards' })).toBeInTheDocument()
    expect(screen.getByText(/recognition and awards from leadership and technical contributions/i)).toBeInTheDocument()
  })

  it('switches from ERD explorer to resume story from the navbar', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: /resume story/i }))

    expect(screen.getByRole('heading', { level: 2, name: 'Career Timeline' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /erd explorer/i }).length).toBeGreaterThan(0)
    expect(window.location.search).toBe('?view=resume')
  })

  it('respects explicit resume view from the URL', () => {
    window.history.replaceState(null, '', '/?view=resume')
    renderApp()

    expect(screen.getByRole('heading', { level: 2, name: 'Career Timeline' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /erd explorer/i }).length).toBeGreaterThan(0)
  })
})
