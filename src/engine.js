const from = 2;
const to = 9;
const range = (from, to) => [...Array(to - from + 1).keys()].map(n => from + n);
const getAllQuestions = () =>
  range(from, to).map(x => range(from, x).map(y => [x, y]));
const avg = xs => xs.reduce((acc, x) => acc + x, 0) / xs.length;
const speak = text => {
  const u = new SpeechSynthesisUtterance(text);
  u.voice = speechSynthesis.getVoices()[0];
  speechSynthesis.speak(u);
};
export default random => {
  const biasRandom = (min, max, bias, influence) => {
    const rnd = random() * (max - min) + min;
    const mix = random() * influence;
    return rnd * (1 - mix) + bias * mix;
  };
  const getQuestion = (records, filter) => {
    const allQuestions = getAllQuestions().flat();
    const questions = isNaN(filter)
      ? allQuestions
      : allQuestions.filter(x => x[0] === filter || x[1] === filter);

    const notMasteredQuestions = questions
      .map(([x, y]) => [x, y, getScore(x, y, records)])
      .filter(x => x[2] < 6);

    if (notMasteredQuestions.length === 0) {
      return questions[Math.floor(random() * questions.length)];
    }
    const unanswerQuestions = notMasteredQuestions.filter(x => x[2] === 0);
    console.warn({ unanswerQuestions });
    if (unanswerQuestions.length > 0) {
      return unanswerQuestions[Math.floor(random() * unanswerQuestions.length)];
    }
    console.warn(notMasteredQuestions);
    return notMasteredQuestions.sort((a, b) => a[2] - b[2])[
      Math.floor(biasRandom(0, notMasteredQuestions.length, 0, 0.7))
    ];
  };
  const getTimedScore = records => {
    const avgSeconds = avg(records.map(x => x.secondsSpent));
    if (avgSeconds > 20) return 3;
    if (avgSeconds > 10) return 4;
    if (avgSeconds > 5) return 5;
    return 6;
  };
  const getScore = (x, y, all) => {
    const top5 = all
      .filter(r => r.x === x && r.y === y)
      .sort((a, b) => b.id - a.id)
      .slice(0, 5);
    if (top5.length === 0) return 0;
    if (top5.every(r => !r.correct)) return 1;
    if (!top5.every(r => r.correct)) return 2;
    if (top5.every(r => r.correct)) return getTimedScore(top5);
  };
  return {
    range,
    getAllQuestions,
    getQuestion,
    getScore,
    speak
  };
};
