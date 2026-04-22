import { useState, useMemo } from "react";
import allQuestions from "../data/questions.json";

export default function Formular({ setStarted, setQuestions, setUserData }) {

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Toate");
  const [amount, setAmount] = useState(5);
  const [time, setTime] = useState("nelimitat");
  const [submitted, setSubmitted] = useState(false);

  
  const categories = useMemo(() => {
    const cats = allQuestions.map(q => q.category);
    return ["Toate", ...new Set(cats)];
  }, []);


  const filtered = useMemo(() => {
    return allQuestions.filter(
      q => category === "Toate" || q.category === category
    );
  }, [category]);


  const options = useMemo(() => {
    const max = filtered.length;
    return [5, 10, 15, 20].filter(n => n <= max);
  }, [filtered]);

  const handleStart = (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!name.trim()) return;

    const selected = filtered.slice(0, amount);

    localStorage.removeItem("quizState");

    setQuestions(selected);
    setUserData({ name, time });
    setStarted(true);
  };

  return (
    <div className="container">
      <div className="form-card">

        <h1 className="title">Quiz App</h1>

        <form onSubmit={handleStart} className="form">

          <div className="form-group">
            <label>Nume:</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {submitted && !name && <p className="error">Introdu numele</p>}
          </div>

          <div className="form-group">
            <label>Categorie:</label>
            <select
              className="select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Întrebări:</label>
            <select
              className="select"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            >
              {options.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Timp:</label>
            <select
              className="select"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              <option value="nelimitat">Nelimitat</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
          </div>

          <button className="start-btn">Start</button>

        </form>
      </div>
    </div>
  );
}