import React, { useState, useRef, useEffect } from "react";

export default ({ x, y, callback }) => {
  const [answer, setAnswer] = useState(NaN);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  const [startTime] = useState(new Date());
  const [readonly, setReadonly] = useState(false);

  const onSubmit = e => {
    const submittedAnswer = Number(inputValue);
    setAnswer(submittedAnswer);
    const secondsSpent = parseInt((new Date() - startTime) / 1000);
    callback(submittedAnswer === x * y, secondsSpent);
    setReadonly(true);
  };
  const onAnswerChange = e => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <form data-testid="question-form" id="question" onSubmit={onSubmit}>
      <span>
        {x}×{y}=
      </span>
      <input
        ref={inputRef}
        type="text"
        pattern="^\d\d?$"
        onChange={onAnswerChange}
        value={inputValue}
        readOnly={readonly}
      />
      {isNaN(answer) ? null : (
        <span data-testid="result">{x * y === answer ? "✔️" : "❌"}</span>
      )}
      <p>Correct answer is {x * y}</p>
    </form>
  );
};
