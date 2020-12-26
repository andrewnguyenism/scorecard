import { useState } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import { useUser } from "../../context/userContext";
import firebase from "../../firebase/client";

export default function NewGame({ data }) {
  const { user } = useUser();
  const router = useRouter();
  const {
    query: { game },
  } = router;

  const [name, setName] = useState("");
  const [status, setStatus] = useState("idle");

  const createGame = async () => {
    setStatus("creating");
    const gameId = Math.random().toString(36).substr(2, 5).toUpperCase();
    const roundKey = firebase.database().ref(`rounds/${gameId}`).push().key;
    const promises = [
      firebase
        .database()
        .ref(`games/${gameId}`)
        .set({
          currentRound: roundKey,
          game,
          gameStatus: "playing",
          owner: user.uid,
          players: {
            [user.uid]: name,
          },
          rounds: 1,
          roundStatus: "playing",
          voteStatus: null,
          createdAt: firebase.database.ServerValue.TIMESTAMP,
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        }),
      firebase.database().ref(`rounds/${gameId}/${roundKey}`).set({
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      }),
      firebase.database().ref(`players/${gameId}/${user.uid}`).set({
        name,
        dutchScore: 0,
        blitzScore: 0,
        totalScore: 0,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      }),
      firebase.database().ref(`users/${user.uid}/${gameId}`).set({
        name,
        owner: true,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      }),
    ];
    try {
      await Promise.all(promises);
      setStatus("created");
      console.log("created game with id:", gameId, ", with owner: ", user.uid);
      router.push(`/game/${gameId}`);
    } catch (err) {
      setStatus("error");
      console.error(err);
    }
  };

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
            {game === "dutch-blitz" && (
              <img
                className="absolute z-0 inset-0 w-full h-full object-cover"
                src="https://www.dutchblitz.com/wp-content/uploads/dbhed.jpg" 
              />
            )}
            {game === "7-wonders" && (
              <img
                className="absolute z-0 inset-0 w-full h-full object-cover"
                src="https://www.7wonders.net//storage/games/7-wonders/sev-content-159243209212Feq.png" 
              />
            )}
            
            <div className="flex-auto relative z-10 px-4 pb-4 pt-24 text-white bg-gradient-to-t from-gray-900">
              <div className="uppercase font-medium text-xl">
                {game === "dutch-blitz" && "Dutch Blitz"}
                {game === "7-wonders" && "7 Wonders"}
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
            <button
              className="block bg-indigo-800 hover:bg-indigo-700 text-white uppercase text-sm font-semibold mx-auto px-4 py-2 rounded"
              onClick={() => createGame()}
            >
              Create
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
