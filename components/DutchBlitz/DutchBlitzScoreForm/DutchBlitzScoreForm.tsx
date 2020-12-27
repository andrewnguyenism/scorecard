import { useState } from "react";

export const DutchBlitzScoreForm = ({ editMode, submitScore }) => {
  const [dutchScore, setDutchScore] = useState(0);
  const [dutchScoreError, setDutchScoreError] = useState(false);
  const [blitzScore, setBlitzScore] = useState(10);
  const [blitzScoreError, setBlitzScoreError] = useState(false);

  return (
    <div className="rounded-2xl border-2 overflow-hidden m-4 p-6">
      <div className="flex flex-col mb-4">
        <label className="uppercase font-bold text-gray-900" htmlFor="dutch">
          Dutch Score
        </label>
        <input
          className={`border py-2 px-3 text-grey-darkest ${
            dutchScoreError && "border-red-500"
          }`}
          id="dutch"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Dutch score"
          onChange={(event) => {
            const parsedValue = Number.parseInt(event.currentTarget.value, 10);
            if (Number.isNaN(parsedValue)) {
              setDutchScoreError(true);
            } else {
              setDutchScore(parsedValue);
            }
          }}
          value={dutchScore}
        />
      </div>
      <div className="flex flex-col mb-4">
        <label className="uppercase font-bold text-gray-900" htmlFor="blitz">
          Blitz Score
        </label>
        <input
          className={`border py-2 px-3 text-grey-darkest ${
            blitzScoreError && "border-red-500"
          }`}
          id="blitz"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Blitz score"
          onChange={(event) => {
            const parsedValue = Number.parseInt(event.currentTarget.value, 10);
            if (Number.isNaN(parsedValue)) {
              setBlitzScoreError(true);
            } else {
              setBlitzScore(parsedValue);
            }
          }}
          value={blitzScore}
        />
      </div>
      <div className="flex flex-col mb-4 text-center">
        <div className="uppercase font-bold text-gray-900">Score</div>
        <div className="text-lg font-bold">
          {(dutchScore - blitzScore * 2) || 0}
        </div>
      </div>
      <div>
        <button
          className="block bg-indigo-800 hover:bg-indigo-700 text-white uppercase text-sm font-semibold mx-auto px-4 py-2 rounded-2xl"
          onClick={() => {
            if (!dutchScoreError && !blitzScoreError) {
              submitScore(dutchScore, blitzScore);
              setDutchScore(0);
              setBlitzScore(10);
            }
          }}
        >
          {editMode ? "Edit Score" : "Submit"}
        </button>
      </div>
    </div>
  );
};
