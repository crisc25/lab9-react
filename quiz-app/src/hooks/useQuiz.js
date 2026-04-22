import { useContext } from "react";
import { QuizContext } from "../context/QuizContext";

export const useQuiz = () => useContext(QuizContext);