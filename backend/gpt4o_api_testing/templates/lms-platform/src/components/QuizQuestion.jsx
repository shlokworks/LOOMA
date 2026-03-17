import React, { useState } from "react";

const QuizQuestion = ({ question, onAnswer }) => {
  const [selected, setSelected] = useState(null);

  const submit = () => {
    onAnswer(question.id, selected);
  };

  return (
    <div className="card p-5 mb-6">

      {/* Question */}
      <p className="font-semibold text-lg text-gray-900">{question.text}</p>

      {/* Options */}
      <div className="mt-4 space-y-2">
        {question.options.map((opt, idx) => {
          const isSelected = selected === idx;

          return (
            <label
              key={idx}
              className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition
                ${isSelected 
                  ? "border-brand-purple bg-purple-50" 
                  : "border-gray-300 hover:bg-gray-50"}
              `}
            >
              <input
                type="radio"
                name={question.id}
                checked={isSelected}
                onChange={() => setSelected(idx)}
              />
              <span className="text-gray-700">{opt}</span>
            </label>
          );
        })}
      </div>

      {/* Submit */}
      <button
        onClick={submit}
        className="mt-4 px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-pink transition"
      >
        Submit Answer
      </button>
    </div>
  );
};

export default QuizQuestion;
