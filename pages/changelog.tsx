import Head from 'next/head'

export default function Changelog(): JSX.Element {
  return (
    <div>
      <Head>
        <title>Changelog - Scorecard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="text-2xl mt-4 text-center uppercase mb-4">
          Changelog
        </div>
        <div className="rounded border-2 m-4 p-4">
          <div className="text-xl font-bold">Version 3</div>
          <div className="text-sm">31/12/2020</div>
          <ul className="list-disc ml-4 mt-4">
            <li>Fixed Dutch Blitz Score Submission not allowing &quot;blank&quot; values.</li>
            <li>Pulse the &quot;LIVE&quot; indicator on the scoreboard.</li>
          </ul>
        </div>
        <div className="rounded border-2 m-4 p-4">
          <div className="text-xl font-bold">Version 2</div>
          <div className="text-sm">28/12/2020</div>
          <ul className="list-disc ml-4 mt-4">
            <li>Fixed Join Game functionality on homepage.</li>
          </ul>
        </div>
        <div className="rounded border-2 m-4 p-4">
          <div className="text-xl font-bold">Version 1</div>
          <div className="text-sm">27/12/2020</div>
          <ul className="list-disc ml-4 mt-4">
            <li>Added Dutch Blitz scoring.</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
