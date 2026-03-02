import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/')
  })

  it('renders the resume story view by default', () => {
    render(<App />)

    expect(screen.getByRole('navigation', { name: /primary/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: /brian markowitz/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Career Timeline' })).toBeInTheDocument()
    expect(screen.getByText(/resume story/i)).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /erd explorer/i }).length).toBeGreaterThan(0)
  })

  it('opens table details from URL and supports relationship navigation', async () => {
    window.history.replaceState(null, '', '/?table=employee')
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByRole('button', { name: /resume story/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/entity relationship diagram workspace/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Employee' })).toBeInTheDocument()
    expect(screen.getByTestId('related-table-resume')).toBeInTheDocument()

    await user.click(screen.getByTestId('related-table-resume'))

    expect(screen.getByRole('heading', { level: 2, name: 'Resume' })).toBeInTheDocument()
    expect(screen.getByText(/resume ingestion and extraction history for uploaded source files/i)).toBeInTheDocument()
  })

  it('switches from resume story to ERD explorer from the navbar', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getAllByRole('button', { name: /erd explorer/i })[0])

    expect(screen.getByRole('button', { name: /resume story/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/entity relationship diagram workspace/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Employee' })).toBeInTheDocument()
    expect(window.location.search).toMatch(/table=employee/)
  })
})
