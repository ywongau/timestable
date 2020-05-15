import { expect } from 'chai';
import Engine from './engine';
const random = () => 0.1;
const now = () => new Date(2020, 5, 8);
const today = now().valueOf();
const oneDay = 1000 * 3600 * 24;
const engine = Engine(random, now);

it('create range', () => {
  expect(engine.range(0, 2)).to.deep.equal([0, 1, 2]);
  expect(engine.range(1, 2)).to.deep.equal([1, 2]);
  expect(engine.range(1, 1)).to.deep.equal([1]);
});
it('generates all questions', () => {
  const all = engine.getAllQuestions();
  expect(all.length).to.equal(8);
  expect(all[0]).to.deep.equal([[2, 2]]);
  expect(all[1]).to.deep.equal([
    [3, 2],
    [3, 3],
  ]);
});
it('gets score NaN if not found', () => {
  const score = engine.getScore(2, 2, [
    { x: 3, y: 2, correct: false, ts: today },
  ]);
  expect(score).to.be.NaN;
});
it('gets score -50 if wrong', () => {
  const score = engine.getScore(2, 2, [
    { x: 2, y: 2, correct: false, ts: today },
  ]);
  expect(score).to.equal(-50);
});
it('gets score -5 if wrong 9 days ago', () => {
  const score = engine.getScore(2, 2, [
    { x: 2, y: 2, correct: false, ts: today - oneDay * 9 },
  ]);
  expect(score).to.equal(-5);
});
it('ignores records older than 10 days', () => {
  const score = engine.getScore(2, 2, [
    { x: 2, y: 2, correct: false, ts: today - oneDay * 10 },
    { x: 2, y: 2, correct: true, ts: today - oneDay * 21 },
  ]);
  expect(score).to.be.NaN;
});
it('gets score 20 answered correctly in 10 sec', () => {
  const score = engine.getScore(2, 2, [
    { x: 2, y: 2, correct: false, ts: today },
    { x: 2, y: 2, correct: true, ts: today, secondsSpent: 10 },
  ]);
  expect(score).to.equal(-30);
});
it('gets score 2 answered correctly in 10 sec 9 days agao', () => {
  const score = engine.getScore(2, 2, [
    { x: 2, y: 2, correct: false, ts: today },
    { x: 2, y: 2, correct: true, ts: today - oneDay * 9, secondsSpent: 10 },
  ]);
  expect(score).to.equal(-48);
});
it('gets score 10 answered correctly in more than 20 sec', () => {
  const score = engine.getScore(2, 2, [
    { x: 2, y: 2, correct: false, ts: today },
    { x: 2, y: 2, correct: true, ts: today, secondsSpent: 21 },
  ]);
  expect(score).to.equal(-40);
});
it('gets score 100 if all correct', () => {
  const score = engine.getScore(2, 2, [
    { x: 2, y: 2, correct: true, secondsSpent: 20, ts: today },
    { x: 2, y: 2, correct: true, secondsSpent: 20, ts: today - oneDay },
    { x: 2, y: 2, correct: true, secondsSpent: 20, ts: today },
    { x: 2, y: 2, correct: true, secondsSpent: 20, ts: today },
    { x: 2, y: 2, correct: true, secondsSpent: 20, ts: today },
  ]);
  expect(score).to.equal(100);
});
it('gets score 75 if all correct but less than 5 answered', () => {
  const score = engine.getScore(2, 2, [
    { x: 2, y: 2, correct: true, secondsSpent: 20, ts: today },
    { x: 2, y: 2, correct: true, secondsSpent: 20, ts: today },
    { x: 2, y: 2, correct: true, secondsSpent: 20, ts: today - oneDay },
    { x: 2, y: 2, correct: true, secondsSpent: 20, ts: today - oneDay * 2 },
  ]);
  expect(score).to.equal(75);
});
it('gets normal score if all correct but not answered in 20 sec', () => {
  const score = engine.getScore(2, 2, [
    { x: 2, y: 2, correct: true, secondsSpent: 21, ts: today },
    { x: 2, y: 2, correct: true, secondsSpent: 21, ts: today - oneDay },
    { x: 2, y: 2, correct: true, secondsSpent: 21, ts: today },
    { x: 2, y: 2, correct: true, secondsSpent: 20, ts: today },
    { x: 2, y: 2, correct: true, secondsSpent: 20, ts: today },
  ]);
  expect(score).to.equal(69);
});
it('gets priority from score', () => {
  expect(engine.scoreToPriority('NaN')).to.equal(0);
  expect(engine.scoreToPriority(-10)).to.equal(1);
  expect(engine.scoreToPriority(0)).to.equal(2);
  expect(engine.scoreToPriority(25)).to.equal(3);
  expect(engine.scoreToPriority(50)).to.equal(4);
  expect(engine.scoreToPriority(75)).to.equal(5);
  expect(engine.scoreToPriority(100)).to.equal(6);
});
