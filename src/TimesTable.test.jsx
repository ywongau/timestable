import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import TimesTable from "./TimesTable";
import { expect } from "chai";
import sinon from "sinon";
describe("app", () => {
  beforeEach(() => {
    cleanup();
  });
  afterEach(() => {
    cleanup();
  });
  const questionsWithScore = [
    [[1, 1, 6]],
    [
      [2, 1, 0],
      [2, 2, 3]
    ]
  ];
  const renderTimesTable = (callback = () => undefined) =>
    render(
      <TimesTable
        questionsWithScore={questionsWithScore}
        onFilterChange={callback}
      />
    );

  it("shows times table and filter", () => {
    const { getByText, getByLabelText } = renderTimesTable();
    expect(getByText("1×1").className).to.equal("priority-6");
    expect(getByText("2×1").className).to.equal("priority-0");
    expect(getByText("2×2").className).to.equal("priority-3");
    expect(
      getByLabelText("all")
        .getAttribute("checked")
    ).to.equal("");
    getByText("1×?");
    getByText("2×?");
    getByText("2×?");
  });
  it("filters", () => {
    const callback = sinon.spy();
    const { getByText, getByLabelText } = renderTimesTable(callback);
    fireEvent.click(getByLabelText("1×?"));
    expect(getByText("2×2").className).to.equal("priority-3 disabled");
    expect(getByText("1×1").className).to.equal("priority-6");
    expect(getByText("2×1").className).to.equal("priority-0");
    sinon.assert.calledWith(callback, { filter: 1 });
  });
  it("removes filter", () => {
    const callback = sinon.spy();
    const { getByText, getByLabelText } = renderTimesTable(callback);
    fireEvent.click(getByLabelText("1×?"));
    fireEvent.click(getByLabelText("all"));
    expect(getByText("2×2").className).to.equal("priority-3");
    expect(getByText("1×1").className).to.equal("priority-6");
    expect(getByText("2×1").className).to.equal("priority-0");
    sinon.assert.calledWith(callback, { filter: NaN });
  });
});
