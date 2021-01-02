import user from '@testing-library/user-event'
import { render, screen } from '../test-utils'

import { DutchBlitzScoreForm } from '@/components/DutchBlitzScoreForm'

describe('DutchBlitzScoreForm component', () => {
  it('renders', () => {
    const { asFragment } = render(
      <DutchBlitzScoreForm />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders in edit mode', () => {
    const { asFragment } = render(
      <DutchBlitzScoreForm editMode />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('calls submitScore when user presses "Submit"', () => {
    const submitScore = jest.fn()
    const dutchScore = 15
    const blitzScore = 5

    render(
      <DutchBlitzScoreForm submitScore={submitScore} />
    )

    user.type(screen.getByLabelText(/dutch score/i), `${dutchScore}`)
    user.clear(screen.getByLabelText(/blitz score/i))
    user.type(screen.getByLabelText(/blitz score/i), `${blitzScore}`)
    user.click(screen.getByText(/submit/i))

    expect(submitScore).toBeCalledWith(dutchScore, blitzScore)
  })
})
