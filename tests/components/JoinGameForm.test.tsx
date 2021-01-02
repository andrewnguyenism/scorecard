import user from '@testing-library/user-event'
import { render, screen } from '../test-utils'

import { JoinGameFormError, JoinGameForm } from '@/components/JoinGameForm'
import { ScorecardGame } from '@/firebase/game'

describe('JoinGameForm component', () => {
  it('renders when no gameId is passed', () => {
    const { asFragment } = render(
      <JoinGameForm />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders when gameId, game, and playerCount is passed', () => {
    const { asFragment } = render(
      <JoinGameForm
        gameId="AB123"
        game={ScorecardGame.DutchBlitz}
        playerCount={4}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it ('renders when duplicate name error is passed', async () => {
    const { asFragment } = render(
      <JoinGameForm error={JoinGameFormError.DuplicateName} />
    )

    await screen.findByText(/Name already used, try another one\./i)
    expect(asFragment()).toMatchSnapshot()
  })

  it ('renders when no game error is passed', async () => {
    const { asFragment } = render(
      <JoinGameForm error={JoinGameFormError.DuplicateName} />
    )

    await screen.findByText(/Name already used, try another one\./i)
    expect(asFragment()).toMatchSnapshot()
  })

  it('calls clearError after changing input', () => {
    const clearError = jest.fn()
    const gameId = 'AB123'

    render(
      <JoinGameForm error={JoinGameFormError.GameNotExists} clearError={clearError} />
    )

    user.type(screen.getByLabelText(/game code/i), gameId)

    expect(clearError).toBeCalled()
  })

  it('calls onGameCodeEntered after entering code', () => {
    const onGameCodeEntered = jest.fn()
    const gameId = 'AB123'

    render(
      <JoinGameForm onGameCodeEntered={onGameCodeEntered} />
    )

    user.type(screen.getByLabelText(/game code/i), gameId)

    expect(onGameCodeEntered).toBeCalledWith(gameId)
  })

  it('calls onJoinGameClick after clicking "Join"', () => {
    const onJoinGameClicked = jest.fn()
    const gameId = 'AB123'
    const name = 'Name'

    render(
      <JoinGameForm onJoinGameClicked={onJoinGameClicked} />
    )

    user.type(screen.getByLabelText(/game code/i), gameId)
    user.type(screen.getByLabelText(/name/i), name)
    user.click(screen.getByText(/join/i))

    expect(onJoinGameClicked).toBeCalledWith(name, gameId)
  })
})
