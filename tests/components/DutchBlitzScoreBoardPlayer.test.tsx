import { render } from '../test-utils'

import { DutchBlitzScoreBoardPlayer } from '@/components/DutchBlitzScoreBoard'

describe('DutchBlitzScoreBoardPlayer component', () => {
  it('renders', () => {
    const { asFragment } = render(
      <DutchBlitzScoreBoardPlayer
        blitzScore={10}
        dutchScore={15}
        name="Player"
        totalScore={5}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders with optional props', () => {
    const { asFragment } = render(
      <DutchBlitzScoreBoardPlayer
        blitzScore={10}
        dutchScore={15}
        name="Player"
        place={1}
        playerIsCurrentUser
        totalScore={5}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
