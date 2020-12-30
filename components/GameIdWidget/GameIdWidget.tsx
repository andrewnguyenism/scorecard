import { createRef, FunctionComponent } from "react";

interface Props {
  gameId: string;
}

export const GameIdWidget: FunctionComponent<Props> = ({ gameId }) => {
  const ref = createRef<HTMLDivElement>();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(gameId);
  };

  return (
    <div
      className="cursor-pointer rounded-2xl bg-gray-300 hover:bg-gray-400 px-3 inline-flex items-center font-bold"
      onClick={copyToClipboard}
      ref={ref}
      role="button"
    >
      <span className="text-gray-800 text-xl font-mono font-bold tracking-widest">
        {gameId}
      </span>
      <svg
        className="h-4 w-4 ml-0.5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
        <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
      </svg>
    </div>
  );
};
