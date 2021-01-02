import firebase from './client'

export enum ScorecardGame {
  DutchBlitz = 'dutch-blitz'
}

type GameStatus = 'finished' | 'playing'

interface GamePlayers {
  [id: string]: string
}

export interface GameInfo {
  createdAt: number
  currentRound: string
  game: ScorecardGame
  gameStatus: GameStatus
  owner: string
  players: GamePlayers
  roundStatus: string
  rounds: number
  updatedAt: number
}

interface CreateGameData {
  game: ScorecardGame
  name: string
  userId: string
}

interface JoinGameData {
  gameId: string
  name: string
  userId: string
}

export const createGame = async ({
  game,
  name,
  userId,
}: CreateGameData): Promise<string | null> => {
  const gameId = Math.random().toString(36).substr(2, 5).toUpperCase()
  const roundKey = firebase.database().ref(`rounds/${gameId}`).push().key
  const promises = [
    firebase
      .database()
      .ref(`games/${gameId}`)
      .set({
        currentRound: roundKey,
        game,
        gameStatus: 'playing',
        owner: userId,
        players: {
          [userId]: name,
        },
        rounds: 1,
        roundStatus: 'playing',
        voteStatus: null,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      }),
    firebase.database().ref(`rounds/${gameId}/${roundKey}`).set({
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      updatedAt: firebase.database.ServerValue.TIMESTAMP,
    }),
    firebase.database().ref(`players/${gameId}/${userId}`).set({
      name,
      dutchScore: 0,
      blitzScore: 0,
      totalScore: 0,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      updatedAt: firebase.database.ServerValue.TIMESTAMP,
    }),
    firebase.database().ref(`users/${userId}/${gameId}`).set({
      name,
      owner: true,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      updatedAt: firebase.database.ServerValue.TIMESTAMP,
    }),
  ]
  try {
    await Promise.all(promises)
    return gameId
  } catch (err) {
    console.error(err)
    return null
  }
}

export const joinGame = async ({
  gameId,
  name,
  userId,
}: JoinGameData): Promise<boolean> => {
  const updates = {
    [`/games/${gameId}/players/${userId}`]: name,
    [`/players/${gameId}/${userId}`]: {
      name: name,
      dutchScore: 0,
      blitzScore: 0,
      totalScore: 0,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      updatedAt: firebase.database.ServerValue.TIMESTAMP,
    },
    [`/users/${userId}/${gameId}`]: {
      name: name,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      updatedAt: firebase.database.ServerValue.TIMESTAMP,
    },
  }
  try {
    await firebase.database().ref().update(updates)
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export const doesGameExist = async (gameId: string): Promise<boolean> => {
  try {
    const snapshot = await firebase
      .database()
      .ref(`games/${gameId}/createdAt`)
      .once('value')
    return snapshot.exists()
  } catch (err) {
    console.error(err)
    return false
  }
}

export const listenForGameInfoChange = (
  gameId: string,
  listener: (gameInfo: GameInfo | null) => void
): (() => void) => {
  const onChange = (snapshot: firebase.database.DataSnapshot) => {
    listener(snapshot.val())
  }
  firebase.database().ref(`games/${gameId}`).on('value', onChange)
  return () => firebase.database().ref(`games/${gameId}`).off('value', onChange)
}

export const getGameInfo = async (gameId: string): Promise<GameInfo | null> => {
  try {
    const snapshot = await firebase.database().ref(`games/${gameId}`).once('value')
    return snapshot.val()
  } catch (err) {
    console.error(err)
    return null
  }
}

export const getGameCurrentRound = async (gameId: string): Promise<string | null> => {
  try {
    const snapshot = await firebase
      .database()
      .ref(`games/${gameId}/currentRound`)
      .once('value')
    return snapshot.val()
  } catch (err) {
    console.error(err)
    return null
  }
}

export const getGameRounds = async (gameId: string): Promise<number | null> => {
  try {
    const snapshot = await firebase
      .database()
      .ref(`games/${gameId}/rounds`)
      .once('value')
    return snapshot.val()
  } catch (err) {
    console.error(err)
    return null
  }
}

export const getGamePlayers = async (gameId: string): Promise<GamePlayers | null> => {
  try {
    const snapshot = await firebase
      .database()
      .ref(`games/${gameId}/players`)
      .once('value')
    return snapshot.val()
  } catch (err) {
    console.error(err)
    return null
  }
}

export const setGameFinished = async (gameId: string): Promise<boolean> => {
  const updates = {
    [`/games/${gameId}/gameStatus`]: 'finished',
    [`/games/${gameId}/updatedAt`]: firebase.database.ServerValue.TIMESTAMP,
  }
  try {
    await firebase.database().ref().update(updates)
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export const progressGameToNextRound = async (gameId: string): Promise<boolean> => {
  const newRoundKey = firebase.database().ref(`rounds/${gameId}`).push().key
  const updates = {
    [`/games/${gameId}/currentRound`]: newRoundKey,
    [`/games/${gameId}/roundStatus`]: 'playing',
    [`/games/${gameId}/rounds`]: (await getGameRounds(gameId) || 0) + 1,
    [`/rounds/${gameId}/${newRoundKey}`]: {
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      updatedAt: firebase.database.ServerValue.TIMESTAMP,
    },
  }
  try {
    await firebase.database().ref().update(updates)
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}