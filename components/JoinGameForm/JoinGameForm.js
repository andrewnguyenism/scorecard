import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { useUser } from "../../context/userContext";
import firebase from "../../firebase/client";

import { GameIdWidget } from "../GameIdWidget";

export const JoinGameForm = ({ gameId, game, playerCount }) => {
  const { user } = useUser();
  const router = useRouter();

  const [status, setStatus] = useState("idle");
  const [gameCode, setGameCode] = useState("");
  const [gameInfo, setGameInfo] = useState(null);
  const [noGameError, setNoGameError] = useState(false);
  const [joinGameName, setJoinGameName] = useState("");
  const [duplicateNameError, setDuplicateNameError] = useState(false);

  useEffect(() => {
    const onGameInfo = (snapshot) => {
      if (snapshot.val()) {
        setGameInfo(snapshot.val());
      } else {
        setNoGameError(true);
      }
    };
    if (gameCode.length === 5) {
      firebase.database().ref(`games/${gameCode}`).on("value", onGameInfo);
    } else {
      firebase.database().ref(`games/${gameCode}`).off("value", onGameInfo);
    }
  }, [gameCode]);

  const joinGame = async () => {
    setStatus("joining");
    const gameStatus = await firebase
      .database()
      .ref(`games/${gameCode}/gameStatus`)
      .on("value");
      
    if (!gameId && !gameStatus.val()) {
      setNoGameError(true);
      setStatus("error");
      return false;
    }

    const players = await firebase
      .database()
      .ref(`games/${gameId || gameCode}/players`)
      .once("value");
    if (
      Object.values(players.val())
        .find((player) => player.toLowerCase() === joinGameName.toLowerCase())
    ) {
      setDuplicateNameError(true);
    } else {
      const updates = {
        [`/games/${gameId || gameCode}/players/${user.uid}`]: true,
        [`/players/${gameId || gameCode}/${user.uid}`]: {
          name: joinGameName,
          dutchScore: 0,
          blitzScore: 0,
          totalScore: 0,
          createdAt: firebase.database.ServerValue.TIMESTAMP,
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        },
        [`/users/${user.uid}/${gameId || gameCode}`]: {
          name: joinGameName,
          createdAt: firebase.database.ServerValue.TIMESTAMP,
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        },
      };
      await firebase.database().ref().update(updates);
      setStatus("joined");
      router.push(`/game/${gameId || gameCode}`);
    }
  };

  return (
    <div className="rounded-2xl border-2 overflow-hidden m-4 p-6 text-center">
      {(game || gameInfo?.game) && (
        <div className="font-bold uppercase mb-2">
          {(game || gameInfo?.game) === "dutch-blitz" && "Dutch Blitz"}
        </div>
      )}
      {gameId && (
        <div className="mb-4 text-lg">
          <GameIdWidget gameId={gameId} />
        </div>
      )}
      {(playerCount || (gameInfo && Object.keys(gameInfo.players).length > 0)) && (
        <div className="mb-4 text-sm">
          {playerCount || Object.keys(gameInfo.players).length} player
          {`${(playerCount || Object.keys(gameInfo.players).length) > 1 ? "s" : ""}`} in
          game
        </div>
      )}
      {!gameId && (
        <div className="flex flex-col mb-4">
          <label
            className="uppercase font-bold text-gray-900 mb-2"
            htmlFor="code"
          >
            Game Code
          </label>
          <input
            className={`border py-2 px-3 text-grey-darkest uppercase text-xl text-center font-mono tracking-widest ${
              noGameError && "border-red-500"
            }`}
            id="code"
            maxLength="5"
            type="text"
            placeholder="AB123"
            onChange={(event) => {
              setGameCode(event.currentTarget.value);
              if (noGameError) {
                setNoGameError(false);
              }
            }}
            value={gameCode}
          />
          {noGameError && (
            <div className="text-sm mt-1">
              Game doesn't exist, make suer you got the code right.
            </div>
          )}
        </div>
      )}
      <div className="flex flex-col mb-4">
        <label
          className="uppercase font-bold text-gray-900 mb-2"
          htmlFor="name"
        >
          Display Name
        </label>
        <input
          className={`border py-2 px-3 text-grey-darkest text-center ${
            duplicateNameError && "border-red-500"
          }`}
          id="name"
          type="text"
          placeholder="Your Name"
          onChange={(event) => {
            setJoinGameName(event.currentTarget.value);
            if (duplicateNameError) {
              setDuplicateNameError(false);
            }
          }}
          value={joinGameName}
        />
        {duplicateNameError && (
          <div className="text-sm mt-1">
            Name already used, try another one.
          </div>
        )}
      </div>
      <button
        className="block bg-indigo-800 hover:bg-indigo-700 text-white uppercase text-sm font-semibold mx-auto px-4 py-2 rounded-2xl"
        onClick={() => joinGame()}
      >
        Join
      </button>
    </div>
  );
};