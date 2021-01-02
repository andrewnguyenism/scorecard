import firebase from './client'
import { DutchBlitzPlayerInfo } from './player'

export interface RoundInfo {
  createdAt: number
  updatedAt: number
}

export interface DutchBlitzRoundInfo extends RoundInfo {
  players: {
    [playerId: string]: Omit<DutchBlitzPlayerInfo, 'createdAt' | 'lastRoundSubmitted' | 'name' | 'updatedAt'>
  }
}

export interface RoundsInfo {
  [id: string]: DutchBlitzRoundInfo
}

export const listenForRoundsChange = (
  gameId: string,
  listener: (rounds: RoundsInfo | null) => void
): (() => void) => {
  const onChange = (snapshot: firebase.database.DataSnapshot) => {
    listener(snapshot.val())
  }
  firebase.database().ref(`rounds/${gameId}`).on('value', onChange)
  return () => firebase.database().ref(`rounds/${gameId}`).off('value', onChange)
}

export const getUserRoundInfo = async (gameId: string, roundId: string, userId: string): Promise<DutchBlitzPlayerInfo | null> => {
  try {
    const snapshot = await firebase.database().ref(`rounds/${gameId}/${roundId}/players/${userId}`).once('value')
    return snapshot.val()
  } catch (err) {
    console.error(err)
    return null
  }
}