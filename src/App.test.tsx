import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders app content', () => {
    render(<App />)
    expect(screen.getByText('App')).toBeInTheDocument()
  })
})
