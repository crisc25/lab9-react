import { createContext,  useReducer } from "react";

const QuizContext = createContext();

const initialState = {
  questions: [],
  index: 0,
  score: 0,
  answers: [],
  finished: false
};

function reducer(state, action) {
  switch (action.type) {

    case "START":
      return {
        ...initialState,
        questions: action.payload
      };

    case "ANSWER": {
      const isCorrect = action.payload.answer === action.payload.correct;

      return {
        ...state,
        score: isCorrect ? state.score + 1 : state.score,
        answers: [...state.answers, action.payload.answer]
      };
    }

    case "NEXT":
      if (state.index + 1 >= state.questions.length) {
        return { ...state, finished: true };
      }

      return {
        ...state,
        index: state.index + 1
      };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

export function QuizProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <QuizContext value={{ state, dispatch }}>
      {children}
    </QuizContext>
  );
}

