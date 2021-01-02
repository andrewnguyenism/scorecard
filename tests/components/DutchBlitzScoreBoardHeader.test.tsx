import { render } from '../test-utils'

import { DutchBlitzScoreBoardHeader } from '@/components/DutchBlitzScoreBoard'

describe('DutchBlitzScoreBoardHeader component', () => {
  it('renders', () => {
    const { asFragment } = render(
      <DutchBlitzScoreBoardHeader
        round={7}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
