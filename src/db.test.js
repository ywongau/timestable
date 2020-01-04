import idb from "fake-indexeddb";
import Db from "./db";
import { expect } from "chai";
const api = Db(idb);
const fakeRecords = [
  {
    question: "4*3",
    correct: true,
    secondsSpent: 8
  },
  {
    question: "7*3",
    correct: false,
    secondsSpent: 18
  }
];
describe("db", () => {
  afterEach(
    () =>
      new Promise((resolve, reject) => {
        const request = idb.deleteDatabase("records");
        request.onsuccess = () => resolve();
        request.onerror = console.error;
      })
  );
  it("works", () => {
    return api
      .addRecord(fakeRecords[0])
      .then(() => api.addRecord(fakeRecords[1]))
      .then(() => api.getRecords())
      .then(records => {
        expect(records).to.deep.equal([
          { id: 1, ...fakeRecords[0] },
          { id: 2, ...fakeRecords[1] }
        ]);
      });
  });
});
