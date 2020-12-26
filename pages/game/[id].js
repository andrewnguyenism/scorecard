import { useEffect, useState } from "react";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useUser } from "../../context/userContext";
import firebase from "../../firebase/client";
import { DutchBlitzScoreBoard } from "../../components/DutchBlitzScoreBoard";
import { DutchBlitzScoreForm } from "../../components/DutchBlitzScoreForm";
import { JoinGameForm } from "../../components/JoinGameForm/JoinGameForm";
import { DutchBlitzRoundTimeline } from "../../components/DutchBlitzRoundTimeline/DutchBlitzRoundTimeline";

export default function Game({ data }) {
  const { user } = useUser();
  const router = useRouter();
  const {
    query: { id: gameId },
  } = router;

  const [status, setStatus] = useState();
  const [gameInfo, setGameInfo] = useState(null);
  const [playersObject, setPlayersObject] = useState({});
  const [players, setPlayers] = useState([]);
  const [rounds, setRounds] = useState({});
  const [lastRoundSubmitted, setLastRoundSubmitted] = useState(null);

  useEffect(() => {
    const onInfoChange = (snapshot) => {
      const remoteGameInfo = snapshot.val();
      if (remoteGameInfo) {
        setGameInfo(remoteGameInfo);
        setStatus("loaded");
      } else if (status === "loaded") {
        setStatus("closed");
      } else {
        setStatus("notexists");
      }
    };
    firebase.database().ref(`games/${gameId}`).on("value", onInfoChange);
    return () =>
      firebase.database().ref(`games/${gameId}`).off("value", onInfoChange);
  }, []);

  useEffect(() => {
    const onPlayersChange = (snapshot) => {
      const remotePlayers = snapshot.val();
      if (remotePlayers) {
        const remotePlayersArray = Object.entries(remotePlayers)
          .map(([id, info]) => ({
            id,
            ...info,
          }))
          .sort((playerA, playerB) => {
            return gameInfo?.rounds > 1 || gameInfo?.roundStatus === "blitz"
              ? playerB.totalScore - playerA.totalScore
              : playerA.createdAt - playerB.createdAt;
          });
        setPlayers(remotePlayersArray);
        setPlayersObject(remotePlayers);
        setLastRoundSubmitted(remotePlayers[user.uid].lastRoundSubmitted);
      }
    };
    firebase.database().ref(`players/${gameId}`).on("value", onPlayersChange);
    return () =>
      firebase
        .database()
        .ref(`players/${gameId}`)
        .off("value", onPlayersChange);
  }, []);

  useEffect(() => {
    const onRoundsChange = (snapshot) => {
      const remoteRounds = snapshot.val();
      if (remoteRounds) {
        setRounds(remoteRounds);
      }
    };
    firebase.database().ref(`rounds/${gameId}`).on("value", onRoundsChange);
    return () =>
      firebase.database().ref(`rounds/${gameId}`).off("value", onRoundsChange);
  }, []);

  const blitz = () => {
    const updates = {
      [`/games/${gameId}/roundStatus`]: "blitz",
      [`/players/${gameId}/${user.uid}/blitz`]: true,
    };
    try {
      firebase.database().ref().update(updates);
    } catch (err) {
      console.error(err);
    }
  };

  const submitScore = async (dutch, blitz) => {
    let updates = {
      [`/rounds/${gameId}/${gameInfo.currentRound}/players/${user.uid}/dutchScore`]: dutch,
      [`/rounds/${gameId}/${gameInfo.currentRound}/players/${user.uid}/blitzScore`]: blitz,
      [`/rounds/${gameId}/${gameInfo.currentRound}/players/${user.uid}/totalScore`]:
        dutch - blitz * 2,
      [`/rounds/${gameId}/${gameInfo.currentRound}/players/${user.uid}/updatedAt`]: firebase
        .database.ServerValue.TIMESTAMP,
    };
    if (lastRoundSubmitted !== gameInfo.currentRound) {
      updates = {
        ...updates,
        [`/players/${gameId}/${user.uid}/dutchScore`]:
          (playersObject[user.uid].dutchScore || 0) + dutch,
        [`/players/${gameId}/${user.uid}/blitzScore`]:
          (playersObject[user.uid].blitzScore || 0) + blitz,
        [`/players/${gameId}/${user.uid}/totalScore`]:
          (playersObject[user.uid].totalScore || 0) + (dutch - blitz * 2),
        [`/players/${gameId}/${user.uid}/updatedAt`]: firebase.database
          .ServerValue.TIMESTAMP,
        [`/players/${gameId}/${user.uid}/lastRoundSubmitted`]: gameInfo.currentRound,
      };
    } else {
      const snapshot = await firebase
        .database()
        .ref(`rounds/${gameId}/${gameInfo.currentRound}/players/${user.uid}`)
        .once("value");
      const currentRoundScore = snapshot.val();
      updates = {
        ...updates,
        [`/players/${gameId}/${user.uid}/dutchScore`]:
          (playersObject[user.uid].dutchScore || 0) -
          (currentRoundScore?.dutchScore || 0) +
          dutch,
        [`/players/${gameId}/${user.uid}/blitzScore`]:
          (playersObject[user.uid].blitzScore || 0) -
          (currentRoundScore?.blitzScore || 0) +
          blitz,
        [`/players/${gameId}/${user.uid}/totalScore`]:
          (playersObject[user.uid].totalScore || 0) -
          (currentRoundScore?.totalScore || 0) +
          (dutch - blitz * 2),
        [`/players/${gameId}/${user.uid}/updatedAt`]: firebase.database
          .ServerValue.TIMESTAMP,
      };
    }
    try {
      firebase.database().ref().update(updates);
    } catch (err) {
      console.error(err);
    }
  };

  const nextRound = () => {
    const newRoundKey = firebase.database().ref(`rounds/${gameId}`).push().key;
    const updates = {
      [`/games/${gameId}/currentRound`]: newRoundKey,
      [`/games/${gameId}/roundStatus`]: "playing",
      [`/games/${gameId}/rounds`]: gameInfo.rounds + 1,
      [`/rounds/${gameId}/${newRoundKey}`]: {
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      },
    };
    try {
      firebase.database().ref().update(updates);
    } catch (err) {
      console.error(err);
    }
  };

  const finishGame = () => {
    const updates = {
      [`/games/${gameId}/gameStatus`]: "finished",
      [`/games/${gameId}/updatedAt`]: firebase.database.ServerValue.TIMESTAMP,
    };
    try {
      firebase.database().ref().update(updates);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Head>
        <title>Game {gameId} - Scorecard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="text-center text-2xl my-4">
          {status === "notexists" && <p>Game doesn't exist!</p>}
          {status === "loading" && <p>Loading game...</p>}
          {status === "closed" && <p>Game doesn't exist!</p>}
        </div>

        {status === "loaded" && (
          <>
            {gameInfo.players[user.uid] ? (
              <>
                <DutchBlitzScoreBoard
                  blitz={blitz}
                  canBlitz={
                    gameInfo.roundStatus === "playing" &&
                    gameInfo.gameStatus !== "finished"
                  }
                  canFinishGame={
                    gameInfo.gameStatus === "playing" &&
                    gameInfo.gameStatus !== "finished"
                  }
                  canNextRound={
                    gameInfo.roundStatus === "blitz" &&
                    gameInfo.gameStatus !== "finished"
                  }
                  currentUserId={user.uid}
                  finished={gameInfo.gameStatus === "finished"}
                  finishGame={finishGame}
                  gameId={gameId}
                  isAdmin={user.uid === gameInfo.owner}
                  nextRound={nextRound}
                  players={players}
                  round={gameInfo.rounds}
                />
                {gameInfo.roundStatus === "blitz" && (
                  <>
                    <div className="text-center uppercase text-lg font-bold mb-4">
                      Submit Score
                    </div>
                    <DutchBlitzScoreForm
                      editMode={lastRoundSubmitted === gameInfo.currentRound}
                      submitScore={submitScore}
                    />
                  </>
                )}
                <DutchBlitzRoundTimeline
                  currentUserId={user.uid}
                  rounds={rounds}
                />
              </>
            ) : (
              <JoinGameForm
                currentUserId={user.uid}
                gameId={gameId}
                game={gameInfo.game}
                playerCount={players.length}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
