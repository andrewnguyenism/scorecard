import { FunctionComponent } from "react";

interface Props {
  round: number;
}

export const DutchBlitzScoreBoardHeader: FunctionComponent<Props> = ({
  round,
}) => (
  <div className="flex items-center px-4 py-2 text-gray-600 bg-gray-200 text-sm">
    <div className="w-8/12 text-gray-800 font-bold">Round {round}</div>
    <div className="w-12 text-center">Dutch</div>
    <div className="w-12 text-center">Blitz</div>
    <div className="w-12 text-center">Total</div>
  </div>
);
