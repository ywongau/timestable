import React, { useState, useRef, useEffect } from "react";

export default ({ question: [x, y, rnd], onSubmit }) => {
  const [answer, setAnswer] = useState(NaN);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  const [startTime, setStartTime] = useState(new Date());
  const [readonly, setReadonly] = useState(false);
  const onFormSubmit = e => {
    e.preventDefault();
    if (inputValue === "") return;
    const submittedAnswer = Number(inputValue);
    setAnswer(submittedAnswer);
    onSubmit({
      correct: submittedAnswer === x * y,
      secondsSpent: parseInt((new Date() - startTime) / 1000)
    });
    setReadonly(true);
  };
  const onAnswerChange = e => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    setAnswer(NaN);
    setInputValue("");
    setReadonly(false);
    setStartTime(new Date());
    inputRef.current.focus();
  }, [x, y, rnd]);

  return (
    <form data-testid="question-form" id="question" onSubmit={onFormSubmit}>
      <span>
        {x}×{y}=
      </span>
      <input
        maxLength="2"
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
      <p
        style={{
          visibility: x * y === answer || isNaN(answer) ? "hidden" : "visible"
        }}
      >
        Correct answer is {x * y}
      </p>
    </form>
  );
};
