import firebase from './client'

export interface PlayerInfo {
  createdAt: number
  name: string
  updatedAt: number
}

export interface DutchBlitzPlayerInfo extends PlayerInfo {
  blitzScore: number
  dutchScore: number
  lastRoundSubmitted?: string
  totalScore: number
}

export interface PlayersInfo {
  [id: string]: DutchBlitzPlayerInfo
}

export const listenForPlayersChange = (
  gameId: string,
  listener: (players: PlayersInfo | null) => void
): (() => void) => {
  const onChange = (snapshot: firebase.database.DataSnapshot) => {
    listener(snapshot.val())
  }
  firebase.database().ref(`players/${gameId}`).on('value', onChange)
  return () => firebase.database().ref(`players/${gameId}`).off('value', onChange)
}

export const getUserPlayerInfo = async (gameId: string, userId: string): Promise<DutchBlitzPlayerInfo | null> => {
  try {
    const snapshot = await firebase.database().ref(`players/${gameId}/${userId}`).once('value')
    return snapshot.val()
  } catch (err) {
    console.error(err)
    return null
  }
}