import React, { useRef, useState } from 'react';

export default function Main() {
  const inputRef = useRef(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [usernameError, setUsernameError] = useState('');
  const [questionsError, setQuestionsError] = useState('');
  const availableQuestions = [
    'AreaUnderTheCurve_21',
    'BinomialTheorem_13',
    'BinomialTheorem_24',
    'AreaUnderTheCurve_15',
    'AreaUnderTheCurve_2',
    'BinomialTheorem_3',
    'BinomialTheorem_4',
    'AreaUnderTheCurve_5',
  ];

  const handleCheckboxChange = (event) => {
    const questionID = event.target.value;
    if (event.target.checked) {
      setSelectedQuestions([...selectedQuestions, questionID]);
    } else {
      setSelectedQuestions(selectedQuestions.filter((id) => id !== questionID));
    }
  };

  const startTest = () => {
    const username = inputRef.current.value;
    const selectedQuestionsString = selectedQuestions.join(',');

    let isValid = true;

    if (username.trim() === '') {
      setUsernameError('Username is required.');
      isValid = false;
    } else {
      setUsernameError('');
    }

    if (selectedQuestions.length === 0) {
      setQuestionsError('Please select at least one question.');
      isValid = false;
    } else {
      setQuestionsError('');
    }

    if (isValid) {
      window.location.href = `/test?username=${username}&questions=${selectedQuestionsString}`;
    }
  };

  const mainStyles = `
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background-color: #000;
    }

    .grey-container {
      background-color: #f0f0f0;
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 20px;
      width: 100%;
      align-items:stretch;
      max-width: 600px;
      box-sizing: border-box;
    }

    .grey-container:hover {
      transform: scale(1.05);
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    }

    .title {
      font-size: 24px;
      margin-bottom: 20px;
      color: white;
    }

    ol {
      text-align: left;
      color: black;
    }

    ul {
      justify-content: left;
      color: black;
    }

    form {
      margin: 20px 0;
    }

    input[type="text"] {
      width: 94%;
      padding: 10px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
      color: black;
    }

    .start {
      margin-top: 20px;
    }

    .btn {
      display: inline-block;
      padding: 10px 1px;
      background-color: #007bff;
      color: #fff;
      text-decoration: none;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }

    .btn:hover {
      background-color: #0056b3;
    }
  `;

  return (
    <div className="container">
      <style>{mainStyles}</style>
      <h1 className="title text-light">MathsOnline Exam Portal</h1>

      <div className="grey-container">
        <ol>
          <li>You will be asked some mathematics Questions</li>
          <li>Each question will have a time limit of 5 minutes</li>
          <li>Choose question IDs for the test</li>
        </ol>
        <ul>
          {availableQuestions.map((questionID) => (
            <li key={questionID}>
              <label>
                <input
                  type="checkbox"
                  value={questionID}
                  onChange={handleCheckboxChange}
                  checked={selectedQuestions.includes(questionID)}
                />
                {questionID}
              </label>
            </li>
          ))}
        </ul>
        <form id="form">
          <input ref={inputRef} type="text" placeholder="Username*" />
          <div className="error">{usernameError}</div>
        </form>
        <div className="start">
          <button className="btn" onClick={startTest}>
            Start Test
          </button>
          <div className="error">{questionsError}</div>
        </div>
      </div>
    </div>
  );
}
