import { forwardRef } from "react";

export interface DutchBlitzPlayer {
  blitzScore: number;
  createdAt: number;
  dutchScore: number;
  id?: string;
  lastRoundSubmitted?: string;
  name?: string;
  totalScore: number;
  updatedAt: number;
}

interface Props {
  currentUserId?: string;
  place?: number;
  player: DutchBlitzPlayer;
}

export const DutchBlitzScoreBoardPlayer = forwardRef<HTMLDivElement, Props>(
  ({ currentUserId, place, player }, ref) => (
    <div className="flex items-center px-4 py-2" ref={ref}>
      <div className="flex items-center w-8/12">
        {place && place >= 0 && place <= 2 && (
          <span className="w-8 font-bold">
            {place === 1 && <span>🥇</span>}
            {place === 2 && <span>🥈</span>}
            {place === 3 && <span>🥉</span>}
          </span>
        )}
        {player.name}
        {currentUserId && player.id === currentUserId && (
          <span className="text-xs ml-1">(You)</span>
        )}
      </div>
      <div className="w-12 text-center">{player.dutchScore || 0}</div>
      <div className="w-12 text-center">{player.blitzScore || 0}</div>
      <div className="w-12 text-center text-lg font-bold">
        {player.totalScore || 0}
      </div>
    </div>
  )
);

DutchBlitzScoreBoardPlayer.displayName = "DutchBlitzScoreBoardPlayer";
