import { useMemo, useState, useEffect, useRef } from "react";

export default function Results({ result, questions, userData, restart }) {

  const [filter, setFilter] = useState("toate");

  const percent = Math.round((result.score / questions.length) * 100);

  const data = questions.map((q, i) => ({
    question: q,
    answer: result.answers[i]
  }));

  const filtered = useMemo(() => {
    return data.filter(item => {
      const ok = item.answer === item.question.correctAnswer;

      if (filter === "corecte" && !ok) return false;
      if (filter === "gresite" && ok) return false;

      return true;
    });
  }, [filter, data]);

  const categories = useMemo(() => {
    const map = {};

    data.forEach(item => {
      const cat = item.question.category;

      if (!map[cat]) {
        map[cat] = { total: 0, correct: 0 };
      }

      map[cat].total++;

      if (item.answer === item.question.correctAnswer) {
        map[cat].correct++;
      }
    });

    return map;
  }, [data]);

  const [history, setHistory] = useState([]);
  const savedOnce = useRef(false);

  useEffect(() => {
    if (savedOnce.current) return; 
    savedOnce.current = true;

    const saved = JSON.parse(localStorage.getItem("scores")) || [];

    const newEntry = {
      name: userData.name,
      score: `${result.score}/${questions.length}`,
      date: new Date().toLocaleDateString()
    };

    const updated = [newEntry, ...saved].slice(0, 5);

    localStorage.setItem("scores", JSON.stringify(updated));
    setHistory(updated);

  }, []);

  return (
    <div className="results">

      <h2>Rezultate</h2>
      <h3>{userData.name}</h3>

      <div className="score-box">
        <h1>{result.score}/{questions.length}</h1>
        <p>{percent}%</p>
        <p>🔥 Max streak: {result.maxStreak}</p>
      </div>

      <h3>Pe categorii</h3>
      <div className="categories">
        {Object.entries(categories).map(([cat, val]) => (
          <div key={cat} className="category-card">
            <p>{cat}</p>
            <h3>{val.correct}/{val.total}</h3>
          </div>
        ))}
      </div>

      <h3>Răspunsuri</h3>

      <div className="filters">
        <button onClick={() => setFilter("toate")}>Toate</button>
        <button onClick={() => setFilter("corecte")}>Corecte</button>
        <button onClick={() => setFilter("gresite")}>Greșite</button>
      </div>

      {filtered.map((item, i) => {
        const ok = item.answer === item.question.correctAnswer;

        return (
          <div
            key={i}
            className={`answer-card ${ok ? "ok" : "bad"}`}
          >
            <p>{item.question.question}</p>
            <p>Răspunsul tău: {item.answer || "expirat"}</p>
            {!ok && <p>Corect: {item.question.correctAnswer}</p>}
          </div>
        );
      })}

      <h3>Istoric scoruri</h3>

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nume</th>
            <th>Scor</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{h.name}</td>
              <td>{h.score}</td>
              <td>{h.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="restart" onClick={restart}>
        Încearcă din nou
      </button>

    </div>
  );
}