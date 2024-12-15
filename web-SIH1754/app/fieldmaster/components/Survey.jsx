import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../FirebaseConfig';

function Survey() {
  const [surveyTitle, setSurveyTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentOptions, setCurrentOptions] = useState(['', '']);
  const [isTitleSet, setIsTitleSet] = useState(false);

  const handleAddOption = () => {
    setCurrentOptions([...currentOptions, '']);
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = currentOptions.filter((_, i) => i !== index);
    setCurrentOptions(updatedOptions);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...currentOptions];
    updatedOptions[index] = value;
    setCurrentOptions(updatedOptions);
  };

  const handleAddQuestion = () => {
    if (currentQuestion.trim() && currentOptions.every((opt) => opt.trim())) {
      const newQuestion = { question: currentQuestion, options: [...currentOptions] };
      setQuestions([...questions, newQuestion]);
      setCurrentQuestion('');
      setCurrentOptions(['', '']);
    } else {
      alert('Please fill in the question and all options.');
    }
  };

  const handleSubmitSurvey = async () => {
    if (surveyTitle.trim() && questions.length > 0) {
      try {
        const surveyDoc = {
          title: surveyTitle,
          questions: questions,
        };

        await addDoc(collection(db, 'surveys'), surveyDoc);
        alert('Survey submitted successfully!');
        setSurveyTitle('');
        setQuestions([]);
        setIsTitleSet(false); // Reset title entry
      } catch (error) {
        console.error('Error submitting survey to Firestore: ', error);
      }
    } else {
      alert('Please provide a survey title and at least one question.');
    }
  };

  return (
    <div className="flex flex-col items-start ml-4 p-4">
      <h1 className="text-2xl font-bold mb-4">Create a Survey</h1>

      {!isTitleSet ? (
        <div className="mb-6 w-full">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Survey Title:
          </label>
          <input
            type="text"
            value={surveyTitle}
            onChange={(e) => setSurveyTitle(e.target.value)}
            className="w-96 px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter the survey title here"
          />
          <button
            onClick={() => setIsTitleSet(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 mt-2"
          >
            Set Title
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6 w-full">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Question:
            </label>
            <input
              type="text"
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              className="w-96 px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your question here"
            />
          </div>

          <div className="mb-6 w-full">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Options:
            </label>
            {currentOptions.map((option, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300 mr-2 w-96"
                  placeholder={`Option ${index + 1}`}
                />
                <button
                  onClick={() => handleRemoveOption(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded shadow hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={handleAddOption}
              className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
            >
              Add Option
            </button>
          </div>

          <button
            onClick={handleAddQuestion}
            className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 mb-6"
          >
            Add Question
          </button>

          <button
            onClick={handleSubmitSurvey}
            className="bg-purple-500 text-white px-4 py-2 rounded shadow hover:bg-purple-600 mb-6"
          >
            Submit Survey
          </button>

          <div className="w-full">
            <h2 className="text-xl font-semibold mb-4">Survey Questions</h2>
            <p className="text-gray-700 font-bold mb-2">Survey Title: {surveyTitle}</p>
            {questions.map((q, index) => (
              <div key={index} className="mb-4 p-4 border rounded shadow">
                <h3 className="font-bold mb-2">{q.question}</h3>
                <ul>
                  {q.options.map((opt, optIndex) => (
                    <li key={optIndex} className="text-gray-700">
                      - {opt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Survey;
