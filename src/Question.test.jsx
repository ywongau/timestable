import React from "react";
import {
  render,
  cleanup,
  fireEvent,
  waitForElement
} from "@testing-library/react";
import Question from "./Question";
import { expect } from "chai";
import sinon from "sinon";
describe("app", () => {
  let _timers;
  const timeSpent = 1000;
  beforeEach(() => {
    cleanup();
    _timers = sinon.useFakeTimers();
  });
  afterEach(() => {
    _timers.restore();
    cleanup();
  });
  const renderQuestion = (callback = () => undefined) =>
    render(<Question question={[3, 2]} onSubmit={callback} />);

  const answerQuestion = (answer, callback = () => undefined) => {
    const wrapper = renderQuestion(callback);
    return waitForElement(() => wrapper.getByRole("textbox")).then(textbox => {
      _timers.tick(timeSpent);
      fireEvent.change(textbox, {
        target: { value: String(answer) }
      });
      fireEvent.submit(wrapper.getByTestId("question-form"), {});
      return wrapper;
    });
  };
  it("shows question", () => {
    const { getByText } = renderQuestion();
    return waitForElement(() => getByText("3×2="));
  });
  it("focuses the input", () => {
    const { getByText, getByRole } = renderQuestion();
    return waitForElement(() => getByRole("textbox")).then(textbox => {
      expect(window.document.activeElement).to.equal(textbox);
    });
  });
  it("does nothing if enter is not pressed", () => {
    const { queryByTestId } = renderQuestion();
    const result = queryByTestId("result");
    expect(result).to.equal(null);
  });
  it("does nothing if empty", () => {
    return answerQuestion("").then(({ queryByTestId, getByText }) => {
      expect(getByText("Correct answer is 6").style.visibility).to.equal(
        "hidden"
      );
      const result = queryByTestId("result");
      expect(result).to.equal(null);
    });
  });
  it("shows tick if correct", () => {
    return answerQuestion(6).then(({ getByText, getByTestId }) => {
      const result = getByTestId("result");
      expect(result.innerHTML).to.equal("✔️");
      expect(getByText("Correct answer is 6").style.visibility).to.equal(
        "hidden"
      );
    });
  });

  it("shows cross if correct", () => {
    return answerQuestion(7).then(({ getByTestId, getByText, getByRole }) => {
      const result = getByTestId("result");
      expect(result.innerHTML).to.equal("❌");
      getByText("Correct answer is 6");
      const textbox = getByRole("textbox");
      expect(textbox.getAttribute("readonly")).to.equal("");
    });
  });

  it("calls back on submit", () => {
    const callback = sinon.spy();
    return answerQuestion(7, callback).then(() => {
      sinon.assert.calledWith(callback, {
        correct: false,
        secondsSpent: timeSpent / 1000
      });
    });
  });

  it("calls back on submit", () => {
    const callback = sinon.spy();
    return answerQuestion(6, callback).then(() => {
      sinon.assert.calledWith(callback, {
        correct: true,
        secondsSpent: timeSpent / 1000
      });
    });
  });
});
