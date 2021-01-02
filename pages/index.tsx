import { useState } from 'react'

import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { JoinGameForm, JoinGameFormError } from '@/components/JoinGameForm'
import { useUser } from '@/context/UserContext'
import { GameInfo, getGameInfo, getGamePlayers, joinGame } from '@/firebase/game'

export default function Home(): JSX.Element {
  const { user } = useUser()
  const router = useRouter()

  const [joinGameInfo, setJoinGameInfo] = useState<GameInfo | null>(null)
  const [joinGameError, setJoinGameError] = useState<JoinGameFormError | null>(null)

  return (
    <div>
      <Head>
        <title>Scorecard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="text-2xl mt-4 text-center uppercase mb-4">New Game</div>
        <Link href="/new-game/dutch-blitz">
          <a className="flex group rounded-2xl border-2 overflow-hidden m-4">
            <div className="w-36 relative overflow-hidden">
              <img
                className="absolute inset-0 w-full h-full object-cover transition duration-200 transform group-hover:scale-110"
                src="https://www.dutchblitz.com/wp-content/uploads/dbhed.jpg"
              />
            </div>
            <div className="flex-auto py-12 text-center group-hover:bg-gray-100">
              <div className="uppercase font-bold">Dutch Blitz</div>
              <div className="uppercase text-sm">2 - 8 players</div>
            </div>
          </a>
        </Link>
        <Link href="/new-game/7-wonders">
          <a className="flex group rounded-2xl border-2 overflow-hidden m-4">
            <div className="w-36 relative overflow-hidden">
              <img
                className="absolute inset-0 w-full h-full object-cover transition duration-200 transform group-hover:scale-110"
                src="https://www.7wonders.net//storage/games/7-wonders/sev-content-159243209212Feq.png"
              />
            </div>
            <div className="flex-auto py-12 text-center group-hover:bg-gray-100">
              <div className="uppercase font-bold">7 Wonders</div>
              <div className="uppercase text-sm">2 - 8 players</div>
            </div>
          </a>
        </Link>
        {user && (
          <>
            <div className="text-2xl text-center uppercase mb-4">Join Game</div>
            <JoinGameForm
              clearError={() => setJoinGameError(null)}
              error={joinGameError}
              game={joinGameInfo?.game}
              onGameCodeEntered={async (gameCode) => {
                const gameInfo = await getGameInfo(gameCode)
                if (gameInfo) {
                  setJoinGameInfo(gameInfo)
                } else {
                  setJoinGameError(JoinGameFormError.GameNotExists)
                }
              }}
              onJoinGameClicked={async (name, gameCode) => {
                if (gameCode) {
                  const players = await getGamePlayers(gameCode)
                  if (
                    players && Object.values(players).find(
                      (playerName) => playerName.toLowerCase() === name.toLowerCase()
                    )
                  ) {
                    setJoinGameError(JoinGameFormError.DuplicateName)
                  } else {
                    const joinedGame = await joinGame({
                      gameId: gameCode,
                      name,
                      userId: user.uid,
                    })
                    if (joinedGame) {
                      router.push(`/game/${gameCode}`)
                    }
                  }
                }
              }}
              playerCount={joinGameInfo ? Object.keys(joinGameInfo?.players).length : undefined}
            />
          </>
        )}
      </main>
    </div>
  )
}
