import { expect } from "chai";
import Engine from "./engine";
const random = () => 0.1;
const engine = Engine(random);

it("create range", () => {
  expect(engine.range(0, 2)).to.deep.equal([0, 1, 2]);
  expect(engine.range(1, 2)).to.deep.equal([1, 2]);
  expect(engine.range(1, 1)).to.deep.equal([1]);
});
it("generates all questions", () => {
  const all = engine.getAllQuestions();
  expect(all.length).to.equal(8);
  expect(all[0]).to.deep.equal([[2, 2]]);
  expect(all[1]).to.deep.equal([
    [3, 2],
    [3, 3]
  ]);
});
it("gets score 0 if not found", () => {
  const score = engine.getScore(2, 2, []);
  expect(score).to.equal(0);
});
it("gets score 1 if all wrong", () => {
  const score = engine.getScore(2, 2, [{ x: 2, y: 2, correct: false }]);
  expect(score).to.equal(1);
});
it("gets score 2 if some wrong", () => {
  const score = engine.getScore(2, 2, [
    { x: 2, y: 2, correct: false },
    { x: 2, y: 2, correct: true }
  ]);
  expect(score).to.equal(2);
});
it("gets score 3 if all correct and takes avg >20 sec", () => {
  const score = engine.getScore(2, 2, [
    { x: 2, y: 2, correct: true, secondsSpent: 20 },
    { x: 2, y: 2, correct: true, secondsSpent: 21 }
  ]);
  expect(score).to.equal(3);
});
it("gets score 4 if all correct and takes avg 10-20 sec", () => {
  const score = engine.getScore(2, 2, [
    { x: 2, y: 2, correct: true, secondsSpent: 9 },
    { x: 2, y: 2, correct: true, secondsSpent: 12 }
  ]);
  expect(score).to.equal(4);
});
it("gets score 5 if all correct and takes avg 5-10 sec", () => {
  const score = engine.getScore(2, 2, [
    { x: 2, y: 2, correct: true, secondsSpent: 5 },
    { x: 2, y: 2, correct: true, secondsSpent: 6 }
  ]);
  expect(score).to.equal(5);
});
it("gets score 6 if all correct and takes avg <=5 sec", () => {
  const score = engine.getScore(2, 2, [
    { x: 2, y: 2, correct: true, secondsSpent: 5 },
    { x: 2, y: 2, correct: true, secondsSpent: 5 }
  ]);
  expect(score).to.equal(6);
});
