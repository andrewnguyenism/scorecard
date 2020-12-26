import {
  DutchBlitzScoreBoardHeader,
  DutchBlitzScoreBoardPlayer,
} from "../DutchBlitzScoreBoard";

export const DutchBlitzRoundTimeline = ({ currentUserId, rounds }) => (
  <div>
    <div className="text-center uppercase text-lg font-bold">
      Round Timeline
    </div>
    {rounds ? (
      Object.entries(rounds)
        .reverse()
        .map(([roundId, round], index) => {
          if (round.players) {
            const currentUserRound = Object.entries(round.players).find(
              ([playerId, _]) => playerId === currentUserId
            );
            if (currentUserRound) {
              const [_, currentUserScores] = currentUserRound;
              return (
                <div className="m-4 rounded-2xl overflow-hidden border-2" key={roundId}>
                  <DutchBlitzScoreBoardHeader round={Math.abs(index - Object.keys(rounds).length)} />
                  <DutchBlitzScoreBoardPlayer player={currentUserScores} />
                </div>
              );
            }
          }
        })
    ) : (
      <div className="text-center uppercase text-sm">
        No scores submitted yet.
      </div>
    )}
  </div>
);
