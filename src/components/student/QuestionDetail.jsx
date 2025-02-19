import React from "react";

const QuestionDetail = ({ question, questionIndex, selectedAnswer, onSelect }) => {
    return (
        <div className="border p-4 rounded-md">
            <h2 className="font-semibold text-gray-700 mb-2">{questionIndex + 1}. {question.questionText}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {question.options.map((option, i) => (
                    <label key={i} className="flex items-center space-x-2 cursor-pointer p-2 border rounded hover:bg-gray-100">
                        <input 
                            type="radio" 
                            name={`question-${questionIndex}`} 
                            value={option} 
                            checked={selectedAnswer === option} 
                            onChange={() => onSelect(questionIndex, option)} 
                            className="w-4 h-4" 
                        />
                        <span>{option}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default QuestionDetail;
