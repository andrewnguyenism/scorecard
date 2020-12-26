import Head from "next/head";
import Link from "next/link";
import { JoinGameForm } from "../components/JoinGameForm/JoinGameForm";

export default function Home() {
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
        <div className="text-2xl text-center uppercase mb-4">Join Game</div>
        <JoinGameForm />
      </main>
    </div>
  );
}
