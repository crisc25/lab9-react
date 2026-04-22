import { useReducer, useEffect, useState } from "react";

const initialState = {
  index: 0,
  selected: null,
  score: 0,
  streak: 0,
  maxStreak: 0,
  answers: []
};

function reducer(state, action) {
  switch (action.type) {

    case "ANSWER": {
      const isCorrect = action.isCorrect;
      const newStreak = isCorrect ? state.streak + 1 : 0;

      return {
        ...state,
        selected: action.value,
        score: isCorrect ? state.score + 1 : state.score,
        streak: newStreak,
        maxStreak: Math.max(state.maxStreak, newStreak),
        answers: [...state.answers, action.value]
      };
    }

    case "NEXT":
      return {
        ...state,
        index: state.index + 1,
        selected: null
      };

    default:
      return state;
  }
}

export default function Quiz({ questions, userData, onFinish }) {

  const [state, dispatch] = useReducer(reducer, initialState);

  const [timeLeft, setTimeLeft] = useState(
    userData?.time === "nelimitat" ? 0 : Number(userData?.time || 0)
  );

  const current = questions[state.index];

  // TIMER
 useEffect(() => {
  if (userData?.time === "nelimitat") return;

  const id = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        clearInterval(id);

        if (state.selected === null) {
          dispatch({
            type: "ANSWER",
            value: null,
            isCorrect: false
          });
        }

        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(id);

}, [state.index]);

  // AUTO NEXT
  useEffect(() => {
    if (state.selected !== null) {
      const t = setTimeout(() => {
        dispatch({ type: "NEXT" });
      }, 800);

      return () => clearTimeout(t);
    }
  }, [state.selected]);

  // FINAL
  if (state.index >= questions.length) {
    onFinish({
      score: state.score,
      answers: state.answers,
      maxStreak: state.maxStreak
    });
    return null;
  }

  return (
    <div className="quiz-container">

      <h3>
        Întrebarea {state.index + 1} / {questions.length}
      </h3>

      {userData?.time !== "nelimitat" && (
        <p className="timer">⏱ {timeLeft}s</p>
      )}

      <p className="meta">
        {current.category} | {current.difficulty}
      </p>

      <h2>{current.question}</h2>

      {current.answers.map((ans, i) => {

        let cls = "answer-btn";

        if (state.selected !== null) {
          if (ans === current.correctAnswer) cls += " correct";
          else if (ans === state.selected) cls += " wrong";
        }

        return (
          <button
            key={i}
            className={cls}
            disabled={state.selected !== null}
            onClick={() =>
              dispatch({
                type: "ANSWER",
                value: ans,
                isCorrect: ans === current.correctAnswer
              })
            }
          >
            {ans}
          </button>
        );
      })}

      {state.streak >= 2 && (
        <p className="streak">🔥 {state.streak}</p>
      )}

    </div>
  );
}