import React, { useEffect, useState } from 'react';

export default function FinishPage() {
  const [username, setUsername] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [totalTime, setTotalTime] = useState(0);
  const [questionTimes, setQuestionTimes] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const usernameParam = urlParams.get('username');
    const questionsParam = urlParams.get('questions');
    const totalTimeParam = parseInt(urlParams.get('totalTime'));
    const questionTimesParam = urlParams.get('questionTimes').split(',').map(Number);

    if (usernameParam && questionsParam && totalTimeParam && questionTimesParam) {
      setUsername(usernameParam);
      const selectedQuestionsArray = questionsParam.split(',');
      setSelectedQuestions(selectedQuestionsArray);
      setTotalTime(totalTimeParam);
      setQuestionTimes(questionTimesParam);
    } else {
      console.error('Username, selected questions, total time, or question times missing in query parameters.');
    }
  }, []);

  const finishPageStyles = `
    /* Add your custom CSS styles for the FinishPage component here */
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background-color: #000; /* Background color */
    }

    .grey-container {
      background-color: #f0f0f0; /* Grey background color */
      border: 1px solid #ddd; /* Add a border for a formal look */
      border-radius: 5px; /* Add rounded corners */
      padding: 20px;
      width: 100%;
      max-width: 600px; /* Limit the width of the grey container */
      box-sizing: border-box; /* Include padding in width */
    }

    .title {
      font-size: 24px;
      margin-bottom: 20px;
      font-weight: bold; /* Make text bold */
      color: white;
    }

    h1 {
      color: black;
    }

    h2 {
      font-size: 18px;
      color: black;
    }

    ul {
      list-style-type: none;
      padding: 0;
    }
 
    li {
      margin-bottom: 10px;
    }
  `;

  return (
    <div className="container">
      <style>{finishPageStyles}</style>
      <h1 className="title text-light">MathsOnline Exam Portal</h1>

      <div className="grey-container">
        <h1>Test Finished</h1>
        <p>Name of User: {username}</p>
        <h2>Time left for the Test: {Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')} minutes</h2>
        <h2>Questions with Time:</h2>
        <ul>
          {selectedQuestions.map((questionID, index) => (
            <li key={questionID}>
              Question ID: {questionID}, Time Spent: {Math.floor(questionTimes[index] / 60)} minutes {questionTimes[index] % 60} seconds
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
