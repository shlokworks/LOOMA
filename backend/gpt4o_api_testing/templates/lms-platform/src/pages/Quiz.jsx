import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import quizService from "../services/quizService";
import QuizQuestion from "../components/QuizQuestion";
import useLMSStore from "../store/useLMSStore";

const Quiz = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const { recordQuizResult } = useLMSStore();

  useEffect(() => {
    const q = quizService.getById(id);
    setQuiz(q);
  }, [id]);

  if (!quiz)
    return <div className="text-gray-500 text-center mt-10">Loading quiz...</div>;

  const onAnswer = (qid, selectedIndex) => {
    setAnswers((prev) => ({ ...prev, [qid]: selectedIndex }));
  };

  const submit = () => {
    const score = quiz.questions.reduce((acc, q) => {
      const ans = answers[q.id];
      return ans === q.answerIndex ? acc + 1 : acc;
    }, 0);

    const percent = Math.round((score / quiz.questions.length) * 100);
    recordQuizResult(quiz.courseId, id, percent);

    alert(`You scored ${percent}%`);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">

      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
        {quiz.title}
      </h1>

      {quiz.questions.map((q) => (
        <QuizQuestion key={q.id} question={q} onAnswer={onAnswer} />
      ))}

      <div className="mt-8">
        <button
          onClick={submit}
          className="px-6 py-3 bg-brand-purple text-white rounded-lg text-lg font-semibold hover:bg-brand-pink transition"
        >
          Submit Quiz
        </button>
      </div>

    </div>
  );
};

export default Quiz;
