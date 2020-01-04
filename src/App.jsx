import React, { useState, useEffect } from "react";
import Question from "./Question";
import TimesTable from "./TimesTable";
import "./App.css";
export default (engine, db) => () => {
  const [question, setQuestion] = useState([0, 0]);
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState(NaN);
  const [x, y] = question;
  const onSubmit = ({ correct, secondsSpent }) => {
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
            const [x, y] = engine.getQuestion(latestRecords, filter);
            setQuestion([x, y, Math.random()]);
          },
          correct ? 500 : 500
        );
      });
  };
  const deleteRecords = () =>
    db.deleteRecords().then(() => {
      setRecords([]);
      setQuestion(engine.getQuestion([], filter));
    });

  const onFilterChange = ({ filter }) => {
    setFilter(filter);
  };

  useEffect(() => {
    db.getRecords().then(records => {
      setRecords(records);
      const question = engine.getQuestion(records, filter);
      setQuestion(question || [0, 0]);
    });
  }, [filter]);

  return (
    <>
      <Question question={question} onSubmit={onSubmit} />
      <TimesTable
        onFilterChange={onFilterChange}
        questionsWithScore={engine
          .getAllQuestions()
          .map(xs =>
            xs.map(([x, y]) => [x, y, engine.getScore(x, y, records)])
          )}
      />

      <button onClick={deleteRecords}>Delete records</button>
    </>
  );
};
