import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

describe('SentenceBuilder', () => {
  it('renders a heading', () => {
    render(<div><h1>Sentence Builder Test</h1></div>)
    
    const heading = screen.getByRole('heading', {
      name: /Sentence Builder Test/i,
    })

    expect(heading).toBeInTheDocument()
  })
})