import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/')
  })

  it('renders the ERD shell and browser prompt', () => {
    render(<App />)

    expect(screen.getByRole('navigation', { name: /primary/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /erd controller/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /standard resume/i })).toBeInTheDocument()
    expect(screen.getByText(/control mode/i)).toBeInTheDocument()
    expect(screen.getByText(/table click: browse records/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/entity relationship diagram workspace/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'employee' })).toBeInTheDocument()
  })

  it('opens table details from URL and supports relationship navigation', async () => {
    window.history.replaceState(null, '', '/?table=employee')
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByRole('heading', { level: 2, name: 'employee' })).toBeInTheDocument()
    expect(screen.getByTestId('related-table-resume')).toBeInTheDocument()

    await user.click(screen.getByTestId('related-table-resume'))

    expect(screen.getByRole('heading', { level: 2, name: 'resume' })).toBeInTheDocument()
    expect(screen.getByText(/resume ingestion and extraction history for uploaded source files/i)).toBeInTheDocument()
  })

  it('switches to the standard resume view from the navbar', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('tab', { name: /standard resume/i }))

    expect(screen.getByRole('heading', { level: 1, name: /brian markowitz/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Experience' })).toBeInTheDocument()
    expect(screen.getByText(/chronological roles and major responsibilities/i)).toBeInTheDocument()
    expect(window.location.search).toMatch(/view=resume/)
  })
})
