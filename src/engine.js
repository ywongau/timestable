const from = 2;
const to = 9;
const oneDay = 1000 * 3600 * 24;
const range = (from, to) =>
  [...Array(to - from + 1).keys()].map((n) => from + n);
const getAllQuestions = () =>
  range(from, to).map((x) => range(from, x).map((y) => [x, y]));
const avg = (xs) => xs.reduce((acc, x) => acc + x, 0) / xs.length;
const speak = (text) => {
  const u = new SpeechSynthesisUtterance(text);
  u.voice = speechSynthesis.getVoices()[0];
  speechSynthesis.speak(u);
};
export default (random, now) => {
  const biasRandom = (min, max, bias, influence) => {
    const rnd = random() * (max - min) + min;
    const mix = random() * influence;
    return rnd * (1 - mix) + bias * mix;
  };
  const getQuestion = (records, filter) => {
    const allQuestions = getAllQuestions().flat();
    const questions = isNaN(filter)
      ? allQuestions
      : allQuestions.filter((x) => x[0] === filter || x[1] === filter);

    const notMasteredQuestions = questions
      .map(([x, y]) => [x, y, scoreToPriority(getScore(x, y, records))])
      .filter((x) => x[2] < 6);

    if (notMasteredQuestions.length === 0) {
      console.warn({ notMasteredQuestions });
      return questions[Math.floor(random() * questions.length)];
    }
    const unanswerQuestions = notMasteredQuestions.filter((x) => x[2] === 0);
    console.warn({ unanswerQuestions, notMasteredQuestions });
    if (unanswerQuestions.length > 0) {
      return unanswerQuestions[Math.floor(random() * unanswerQuestions.length)];
    }
    return notMasteredQuestions.sort((a, b) => a[2] - b[2])[
      Math.floor(biasRandom(0, notMasteredQuestions.length, 0, 0.7))
    ];
  };
  const getScore = (x, y, records) => {
    const tenDays = oneDay * 10;
    const allMatched = records
      .filter((r) => r.x === x && r.y === y)
      .sort((a, b) => b.id - a.id);
    const lastTenDays = allMatched.filter((r) => r.ts > now() - tenDays);
    const answeredIn20sec = (r) => r.correct && r.secondsSpent <= 20;
    if (lastTenDays.length === 0) return NaN;
    if (lastTenDays.length >= 5 && lastTenDays.every(answeredIn20sec))
      return 100;
    if (lastTenDays.every(answeredIn20sec)) return 75;
    return lastTenDays.reduce((acc, x) => {
      const weightOfRecency = (tenDays - (now() - x.ts)) / tenDays;
      return (
        acc +
        (x.correct ? (x.secondsSpent <= 20 ? 20 : 10) : -50) * weightOfRecency
      );
    }, 0);
  };
  const scoreToPriority = (score) => {
    if (isNaN(score)) return 0;
    if (score < 0) return 1;
    if (score < 25) return 2;
    if (score < 50) return 3;
    if (score < 75) return 4;
    if (score < 100) return 5;
    return 6;
  };

  return {
    range,
    getAllQuestions,
    getQuestion,
    getScore,
    speak,
    scoreToPriority,
  };
};
