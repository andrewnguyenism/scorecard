import { useState } from 'react'

import Head from 'next/head'
import { useRouter } from 'next/router'

import { useUser } from '@/context/UserContext'
import { createGame, ScorecardGame } from '@/firebase/game'

export default function NewGame(): JSX.Element {
  const { user } = useUser()
  const router = useRouter()
  const {
    query: { game },
  } = router

  const [name, setName] = useState('')
  const [, setStatus] = useState('idle')

  const onCreateClick = async () => {
    setStatus('creating')
    if (game === ScorecardGame.DutchBlitz && user) {
      const gameId = await createGame({
        game,
        name,
        userId: user.uid,
      })
      if (gameId) {
        setStatus('created')
        router.push(`/game/${gameId}`)
      } else {
        setStatus('error')
      }
    }
  }

  return (
    <div>
      <Head>
        <title>New Dutch Blitz Game - Scorecard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="text-2xl mt-4 text-center uppercase mb-4">New Game</div>
        <div className="rounded-2xl overflow-hidden border-2 m-4">
          <div className="flex relative overflow-hidden">
            {game === ScorecardGame.DutchBlitz && (
              <img
                className="absolute z-0 inset-0 w-full h-full object-cover"
                src="https://www.dutchblitz.com/wp-content/uploads/dbhed.jpg"
              />
            )}

            {game === '7-wonders' && (
              <img
                className="absolute z-0 inset-0 w-full h-full object-cover"
                src="https://www.7wonders.net//storage/games/7-wonders/sev-content-159243209212Feq.png"
              />
            )}

            <div className="flex-auto relative z-10 px-4 pb-4 pt-24 text-white bg-gradient-to-t from-gray-900">
              <div className="uppercase font-medium text-xl">
                {game === ScorecardGame.DutchBlitz && 'Dutch Blitz'}
                {game === '7-wonders' && '7 Wonders'}
              </div>
              <div className="uppercase text-xs mb-2">2 - 8 players</div>
            </div>
          </div>
          <div className="p-4">
            <div className="flex flex-col mb-4">
              <input
                className="border py-2 px-3 text-grey-darkest text-center"
                id="name"
                type="text"
                onChange={(event) => setName(event.currentTarget.value)}
                placeholder="Your name"
                value={name}
              />
            </div>
            {user?.uid && (
              <button
                className="block bg-indigo-800 hover:bg-indigo-700 text-white uppercase text-sm font-semibold mx-auto px-4 py-2 rounded"
                onClick={onCreateClick}
              >
                Create
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
