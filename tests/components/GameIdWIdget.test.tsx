import { fireEvent, render, screen } from '../test-utils'

import { GameIdWidget } from '@/components/GameIdWidget'

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn()
  }
})

describe('GameIdWidget component', () => {
  it('renders component', () => {
    const { asFragment } = render(<GameIdWidget gameId="AB123" />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('copies to clipboard when clicked', () => {
    const gameId = 'AB123'
    render(<GameIdWidget gameId={gameId} />)

    fireEvent.click(screen.getByText(gameId))

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(gameId)
  })
})
