import { useState } from "react";
import Formular from "./components/Formular";
import Quiz from "./components/Quiz";
import Results from "./components/Results";
import ThemeMode from "./components/ThemeMode";
import "./index.css";

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [userData, setUserData] = useState(null);
  const [result, setResult] = useState(null);

  return (
    <div className={`app ${theme}`}>
      <header>
        <h2>Quiz App</h2>
        <ThemeMode theme={theme} setTheme={setTheme} />
      </header>

      {!started ? (
        <Formular
          setStarted={setStarted}
          setQuestions={setQuestions}
          setUserData={setUserData}
        />
      ) : !finished ? (
        <Quiz
          questions={questions}
          userData={userData}
          onFinish={(data) => {
            setResult(data);
            setFinished(true);
            localStorage.removeItem("quizState");
          }}
        />
      ) : (
        <Results
          result={result}
          questions={questions}
          userData={userData}
          restart={() => {
            setStarted(false);
            setFinished(false);
             sessionStorage.removeItem("savedScore");
          }}
        />
      )}
    </div>
  );
}

export default App;