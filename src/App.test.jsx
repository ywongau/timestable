import React from "react";
import {
  render,
  cleanup,
  fireEvent,
  waitForElement
} from "@testing-library/react";
import AppFactory from "./App";
import { expect } from "chai";
import sinon from "sinon";
const getDb = () => ({
  getRecords: sinon.stub().resolves([]),
  addRecord: sinon.stub().resolves(undefined),
  deleteRecords: sinon.stub().resolves(undefined)
});

const fakeEngine = {
  getQuestion: () => [3, 2],
  getAllQuestions: () => [],
  speak: () => undefined
};

describe("app", () => {
  beforeEach(cleanup);

  it("shows question", () => {
    const App = AppFactory(fakeEngine, getDb());
    const { getByText } = render(<App />);
    return waitForElement(() => getByText("3×2="));
  });
  it("does nothing if enter is not pressed", () => {
    const App = AppFactory(fakeEngine, getDb());
    const { queryByTestId } = render(<App />);
    const result = queryByTestId("result");
    expect(result).to.equal(null);
  });
  it("shows tick if correct", () => {
    const App = AppFactory(fakeEngine, getDb());
    const { getByTestId, getByRole } = render(<App />);
    return waitForElement(() => getByRole("textbox")).then(textbox => {
      fireEvent.change(getByRole("textbox"), {
        target: { value: "6" }
      });
      fireEvent.submit(getByTestId("question"), {});
      return waitForElement(() => getByTestId("result")).then(result => {
        expect(result.innerHTML).to.equal("✔️");
      });
    });
  });
  it("shows cross if wrong", () => {
    const App = AppFactory(fakeEngine, getDb());
    const { getByTestId, getByRole } = render(<App />);
    return waitForElement(() => getByRole("textbox")).then(textbox => {
      fireEvent.change(getByRole("textbox"), {
        target: { value: "16" }
      });
      fireEvent.submit(getByTestId("question"), {});
      return waitForElement(() => getByTestId("result")).then(result => {
        expect(result.innerHTML).to.equal("❌");
      });
    });
  });
});
