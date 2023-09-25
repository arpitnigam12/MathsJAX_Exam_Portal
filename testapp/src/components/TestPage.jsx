import React, { useEffect, useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { MathJax } from 'better-react-mathjax'; // Import MathJax components
import '../styles/TestPage.css';




export default function TestPage() {
  const [username, setUsername] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [testTimer, setTestTimer] = useState(0); // Total test timer in seconds
  const [questionTimes, setQuestionTimes] = useState([]); // Time spent on each question in seconds
  const [questionTimer, setQuestionTimer] = useState(0); // Timer for the current question in seconds
  const [questionStartTime, setQuestionStartTime] = useState(0); // Timestamp when the current question started

  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const usernameParam = urlParams.get('username');
    const questionsParam = urlParams.get('questions');

    if (usernameParam && questionsParam) {
      setUsername(usernameParam);
      const selectedQuestionsArray = questionsParam.split(',');
      setSelectedQuestions(selectedQuestionsArray);

      setTestTimer(selectedQuestionsArray.length * 300); // 300 seconds per question

      // Initialize the questionTimes array with zeros for each question
      const initialTimes = Array(selectedQuestionsArray.length).fill(0);
      setQuestionTimes(initialTimes);

      // Initialize the questionTimer and questionStartTime for the first question
      setQuestionTimer(300); // 300 seconds for the first question
      setQuestionStartTime(Date.now());
    } else {
      console.error('Username or selected questions missing in query parameters.');
    }
  }, []);

  useEffect(() => {
    if (currentQuestionIndex >= 0 && currentQuestionIndex < selectedQuestions.length) {
      const currentQuestionID = selectedQuestions[currentQuestionIndex];
      fetchQuestionData(currentQuestionID);
      setQuestionStartTime(Date.now()); // Start the timer for the current question
    }
  }, [currentQuestionIndex, selectedQuestions]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestTimer((prevTimer) => prevTimer - 1);

      if (questionTimer > 0) {
        setQuestionTimer((prevTimer) => prevTimer - 1);
      }

      if (testTimer === 0) {
        onFinishTest();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [testTimer, questionTimer]);

  const fetchQuestionData = async (questionID) => {
    try {
      const res = await fetch(
        `https://0h8nti4f08.execute-api.ap-northeast-1.amazonaws.com/getQuestionDetails/getquestiondetails?QuestionID=${questionID}`
      );
      const data = await res.json();

      if (data && data.length > 0) {
        const currentQ = data[0];
        setCurrentQuestion(currentQ);
      } else {
        console.error('No questions found in the API response.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  function onNext() {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      // Update the time spent on the current question
      const updatedQuestionTimes = [...questionTimes];
      const timeSpentOnCurrentQuestion = Math.floor((Date.now() - questionStartTime) / 1000); // Calculate time spent in seconds
      updatedQuestionTimes[currentQuestionIndex] += timeSpentOnCurrentQuestion;
      setQuestionTimes(updatedQuestionTimes);

      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);

      // Reset the timer and start time for the next question
      setQuestionTimer(300); // 300 seconds for the next question
      setQuestionStartTime(Date.now());
    }
  }

  function onPrev() {
    if (currentQuestionIndex > 0) {
      // Calculate and update the time spent on the current question
      const timeSpentOnCurrentQuestion = Math.floor((Date.now() - questionStartTime) / 1000);
      questionTimes[currentQuestionIndex] += timeSpentOnCurrentQuestion;

      // Update the current question index
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);

      // Calculate the remaining time on the previous question
      const remainingTimeOnPreviousQuestion = testTimer - timeSpentOnCurrentQuestion;
      setTestTimer(remainingTimeOnPreviousQuestion);

      // Start the timer for the previous question
      setQuestionStartTime(Date.now() - (testTimer - remainingTimeOnPreviousQuestion) * 1000);
      setQuestionTimer(0); // Reset the timer for the previous question
    }
  }

  function onFinishTest() {
    // Calculate the total time spent on each question
    const updatedQuestionTimes = [...questionTimes];
    const timeSpentOnCurrentQuestion = Math.floor((Date.now() - questionStartTime) / 1000); // Calculate time spent on the current question in seconds
    updatedQuestionTimes[currentQuestionIndex] += timeSpentOnCurrentQuestion;

    // Pass the total time spent on each question to FinishPage
    navigate(`/finish?username=${username}&questions=${selectedQuestions.join(',')}&totalTime=${testTimer}&questionTimes=${updatedQuestionTimes.join(',')}`);
  }
  

  return (
    <div className='container'>
      <div className='top-right'>
      
   
 
        <p>Username: {username}</p>
        <p>Time Left for Test: {Math.floor(testTimer / 60)}:{testTimer % 60 < 10 ? '0' : ''}{testTimer % 60} Minutes</p>
      </div>
     
      <div className="grey-container">

      <div className='center'>
  {currentQuestion && (
    <div className='question-box'>
      <h2>Question {currentQuestionIndex + 1}:</h2>
      <MathJax>{` $$${currentQuestion.Question}$$ `}</MathJax>

    </div>
  )}
</div>


      <div className='grid'>
        <button className='btn prev' onClick={onPrev}>
          Previous
        </button>
        <button className='btn next' onClick={onNext}>
          Next
        </button>
        <button className='btn finish' onClick={onFinishTest}>
          Finish Test
        </button>
        
      </div>
    </div>
    </div>

  );
}
