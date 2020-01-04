import React, { useState, useEffect, useRef } from "react";
import "./App.css";

export default (engine, db) => () => {
  const [[x, y], setQuestion] = useState([0, 0]);
  const [answer, setAnswer] = useState(NaN);
  const [inputValue, setInputValue] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [freezed, setFreezed] = useState(false);
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState(NaN);
  const inputRef = useRef(null);

  const onAnswerChange = e => {
    setInputValue(e.target.value);
  };
  const onSubmit = e => {
    if (inputValue === "" || freezed) {
      e.preventDefault();
      return;
    }
    const answer = Number(inputValue);
    setAnswer(answer);
    const secondsSpent = parseInt((new Date() - startTime) / 1000);
    const correct = answer === x * y;
    const ts = new Date().valueOf();
    const record = {
      correct,
      x,
      y,
      secondsSpent,
      ts
    };
    engine.speak(correct ? "correct" : `${x} times ${y} equals ${x * y}`);
    db.addRecord(record)
      .then(() => db.getRecords())
      .then(latestRecords => {
        setRecords(latestRecords);
        setTimeout(
          () => {
            setQuestion(engine.getQuestion(latestRecords, filter) || [0, 0]);
            setAnswer(NaN);
            setInputValue("");
            setStartTime(new Date());
            setFreezed(false);
          },
          correct ? 500 : 5000
        );
      });
    setFreezed(true);
    e.preventDefault();
  };
  const deleteHistory = () =>
    db.deleteRecords().then(() => {
      setRecords([]);
      setQuestion(engine.getQuestion([], filter) || [0, 0]);
    });

  const onFilterChange = e => {
    const latestFilter = parseInt(e.target.value);
    setFilter(latestFilter);
    setQuestion(engine.getQuestion(records, latestFilter) || [0, 0]);
  };

  const newQuestion = records => {

  };

  useEffect(() => {
    db.getRecords().then(records => {
      setRecords(records);
      const question = engine.getQuestion(records, filter);
      setQuestion(question || [0, 0]);
      inputRef.current.focus();
      newQuestion(records);
    });
  }, []);

  return (
    <>
      <form
        data-testid="question"
        style={{ visibility: x === 0 ? "hidden" : "visible" }}
        id="question"
        onSubmit={onSubmit}
      >
        {`${x}×${y}=`}
        <input
          ref={inputRef}
          readOnly={freezed}
          min="1"
          max="99"
          type="number"
          onChange={onAnswerChange}
          value={inputValue}
        />
        {isNaN(answer) ? null : (
          <span data-testid="result">{x * y === answer ? "✔️" : "❌"}</span>
        )}
        <div
          id="correct-answer"
          style={{ visibility: freezed ? "visible" : "hidden" }}
        >
          Correct answer is {x * y}
        </div>
      </form>
      <div id="records">
        <div>
          <label>
            <input
              type="radio"
              checked={isNaN(filter)}
              name="focus"
              onChange={onFilterChange}
              value=""
            />
            <span>all</span>
          </label>
        </div>
        {engine.getAllQuestions().map((pairs, i) => (
          <div key={i}>
            <label>
              <input
                type="radio"
                checked={filter === pairs[0][0]}
                name="focus"
                onChange={onFilterChange}
                value={pairs[0][0]}
              />
              <span>{pairs[0][0]}×? </span>
            </label>
            {pairs.map(([x, y]) => (
              <span className="wrapper">
                <span
                  key={x + "-" + y}
                  className={`priority-${engine.getScore(x, y, records)} ${
                    isNaN(filter) || x === filter || y === filter
                      ? ""
                      : "disabled"
                  }`}
                >
                  {x + "×" + y}
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
      <button onClick={deleteHistory}>Delete records</button>
    </>
  );
};
