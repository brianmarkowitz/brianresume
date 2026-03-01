import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/')
  })

  it('renders the architecture resume shell', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /principal data architect and functional manager/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /architecture view/i })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByLabelText(/interactive system architecture diagram/i)).toBeInTheDocument()
  })

  it('opens detail panel when a system node is selected in query params', () => {
    window.history.replaceState(null, '', '/?mode=impact&node=system-idpcc')

    render(<App />)

    expect(screen.getAllByRole('heading', { name: /iDPCC \/ CEIRR Platform/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('heading', { name: /decisions made/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('heading', { name: /tradeoffs/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('heading', { name: /impact metrics/i }).length).toBeGreaterThan(0)
  })

  it('updates mode and url when tab is changed', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('tab', { name: /leadership view/i }))

    expect(screen.getByRole('tab', { name: /leadership view/i })).toHaveAttribute('aria-selected', 'true')
    expect(window.location.search).toContain('mode=leadership')
  })
})
