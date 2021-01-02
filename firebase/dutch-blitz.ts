import firebase from './client'
import { getGameCurrentRound } from './game'
import { getUserPlayerInfo } from './player'
import { getUserRoundInfo } from './round'

export const callBlitz = async (
  gameId: string,
  userId: string
): Promise<boolean> => {
  const updates = {
    [`/games/${gameId}/roundStatus`]: 'blitz',
    [`/players/${gameId}/${userId}/blitz`]: true,
  }
  try {
    await firebase.database().ref().update(updates)
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export const submitDutchBlitzScore = async (
  gameId: string,
  userId: string,
  dutchScore: number,
  blitzScore: number,
  lastSubmittedRoundId: string | null
): Promise<boolean> => {
  const currentRoundId = await getGameCurrentRound(gameId)
  if (currentRoundId) {
    const currentPlayerInfo = await getUserPlayerInfo(gameId, userId)
    let updates = {
      [`/rounds/${gameId}/${currentRoundId}/players/${userId}/dutchScore`]: dutchScore,
      [`/rounds/${gameId}/${currentRoundId}/players/${userId}/blitzScore`]: blitzScore,
      [`/rounds/${gameId}/${currentRoundId}/players/${userId}/totalScore`]:
        dutchScore - blitzScore * 2,
      [`/rounds/${gameId}/${currentRoundId}/players/${userId}/updatedAt`]: firebase
        .database.ServerValue.TIMESTAMP,
    }
    if (lastSubmittedRoundId !== currentRoundId) {
      updates = {
        ...updates,
        [`/players/${gameId}/${userId}/dutchScore`]:
          (currentPlayerInfo?.dutchScore || 0) + dutchScore,
        [`/players/${gameId}/${userId}/blitzScore`]:
          (currentPlayerInfo?.blitzScore || 0) + blitzScore,
        [`/players/${gameId}/${userId}/totalScore`]:
          (currentPlayerInfo?.totalScore || 0) + (dutchScore - blitzScore * 2),
        [`/players/${gameId}/${userId}/updatedAt`]: firebase.database.ServerValue
          .TIMESTAMP,
        [`/players/${gameId}/${userId}/lastRoundSubmitted`]: currentRoundId,
      }
    } else {
      const currentRoundInfo = await getUserRoundInfo(
        gameId,
        currentRoundId,
        userId
      )
      updates = {
        ...updates,
        [`/players/${gameId}/${userId}/dutchScore`]:
          (currentPlayerInfo?.dutchScore || 0) -
          (currentRoundInfo?.dutchScore || 0) +
          dutchScore,
        [`/players/${gameId}/${userId}/blitzScore`]:
          (currentPlayerInfo?.blitzScore || 0) -
          (currentRoundInfo?.blitzScore || 0) +
          blitzScore,
        [`/players/${gameId}/${userId}/totalScore`]:
          (currentPlayerInfo?.totalScore || 0) -
          (currentRoundInfo?.totalScore || 0) +
          (dutchScore - blitzScore * 2),
        [`/players/${gameId}/${userId}/updatedAt`]: firebase.database.ServerValue
          .TIMESTAMP,
      }
    }
    try {
      await firebase.database().ref().update(updates)
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  } else {
    return false
  }
}
