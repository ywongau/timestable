import React from 'react';
import {
  render,
  cleanup,
  fireEvent,
  waitForElement,
} from '@testing-library/react';
import AppFactory from './App';
import { expect } from 'chai';
import sinon from 'sinon';
const getDb = () => ({
  getRecords: sinon.stub().resolves([]),
  addRecord: sinon.stub().resolves(undefined),
  deleteRecords: sinon.stub().resolves(undefined),
});

const fakeEngine = {
  getQuestion: () => [3, 2],
  getAllQuestions: () => [[[1, 1]]],
  speak: () => undefined,
  getScore: () => 0,
  scoreToPriority: () => 0,
};

describe('app', () => {
  beforeEach(cleanup);
  it('shows question', () => {
    const App = AppFactory(fakeEngine, getDb());
    const { getByText } = render(<App />);
    return waitForElement(() => getByText('3×2='));
  });
  it('shows times table', () => {
    const App = AppFactory(fakeEngine, getDb());
    const { getByText } = render(<App />);
    return waitForElement(() => getByText('1×1'));
  });
});
