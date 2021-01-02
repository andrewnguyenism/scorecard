import user from '@testing-library/user-event'
import { render, screen } from '../test-utils'

import { DutchBlitzScoreBoard } from '@/components/DutchBlitzScoreBoard'

describe('DutchBlitzScoreBoard component', () => {
  it('renders', () => {
    const { asFragment } = render(
      <DutchBlitzScoreBoard
        blitz={jest.fn()}
        round={7}
        canBlitz
        canFinishGame
        canNextRound={false}
        currentUserId="test-user-id"
        finishGame={jest.fn()}
        finished={false}
        gameId="AB123"
        isAdmin
        nextRound={jest.fn()}
        players={[{
          blitzScore: 0,
          createdAt: 1609481440,
          dutchScore: 10,
          id: 'player-1',
          name: 'Player 1',
          totalScore: 10,
          updatedAt: 1609481440,
        }, {
          blitzScore: 5,
          createdAt: 1609481440,
          dutchScore: 15,
          id: 'player-2',
          name: 'Player 2',
          totalScore: 5,
          updatedAt: 1609481440,
        }]}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('calls blitz when "Blitz" is clicked', () => {
    const blitz = jest.fn()
    render(
      <DutchBlitzScoreBoard
        blitz={blitz}
        round={7}
        canBlitz
        canFinishGame
        canNextRound
        currentUserId="test-user-id"
        finishGame={jest.fn()}
        finished={false}
        gameId="AB123"
        isAdmin
        nextRound={jest.fn()}
        players={[{
          blitzScore: 0,
          createdAt: 1609481440,
          dutchScore: 10,
          id: 'player-1',
          name: 'Player 1',
          totalScore: 10,
          updatedAt: 1609481440,
        }, {
          blitzScore: 5,
          createdAt: 1609481440,
          dutchScore: 15,
          id: 'player-2',
          name: 'Player 2',
          totalScore: 5,
          updatedAt: 1609481440,
        }]}
      />
    )

    user.click(screen.getByText(/blitz!/i))

    expect(blitz).toBeCalled()
  })

  it('calls finishGame when "Finish Game" is clicked', () => {
    const finishGame = jest.fn()
    render(
      <DutchBlitzScoreBoard
        blitz={jest.fn()}
        round={7}
        canBlitz
        canFinishGame
        canNextRound
        currentUserId="test-user-id"
        finishGame={finishGame}
        finished={false}
        gameId="AB123"
        isAdmin
        nextRound={jest.fn()}
        players={[{
          blitzScore: 0,
          createdAt: 1609481440,
          dutchScore: 10,
          id: 'player-1',
          name: 'Player 1',
          totalScore: 10,
          updatedAt: 1609481440,
        }, {
          blitzScore: 5,
          createdAt: 1609481440,
          dutchScore: 15,
          id: 'player-2',
          name: 'Player 2',
          totalScore: 5,
          updatedAt: 1609481440,
        }]}
      />
    )

    user.click(screen.getByText(/finish game/i))

    expect(finishGame).toBeCalled()
  })

  it('calls nextRound when "Next Round" is clicked', () => {
    const nextRound = jest.fn()
    render(
      <DutchBlitzScoreBoard
        blitz={jest.fn()}
        round={7}
        canBlitz
        canFinishGame
        canNextRound
        currentUserId="test-user-id"
        finishGame={jest.fn()}
        finished={false}
        gameId="AB123"
        isAdmin
        nextRound={nextRound}
        players={[{
          blitzScore: 0,
          createdAt: 1609481440,
          dutchScore: 10,
          id: 'player-1',
          name: 'Player 1',
          totalScore: 10,
          updatedAt: 1609481440,
        }, {
          blitzScore: 5,
          createdAt: 1609481440,
          dutchScore: 15,
          id: 'player-2',
          name: 'Player 2',
          totalScore: 5,
          updatedAt: 1609481440,
        }]}
      />
    )

    user.click(screen.getByText(/next round/i))

    expect(nextRound).toBeCalled()
  })
})
