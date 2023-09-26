import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MathJax } from 'better-react-mathjax';
import '../styles/TestPage.css';

export default function TestPage() {
  const [username, setUsername] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [testTimer, setTestTimer] = useState(0);
  const [questionTimes, setQuestionTimes] = useState([]);
  const [questionTimer, setQuestionTimer] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const usernameParam = urlParams.get('username');
    const questionsParam = urlParams.get('questions');

    if (usernameParam && questionsParam) {
      setUsername(usernameParam);
      const selectedQuestionsArray = questionsParam.split(',');
      setSelectedQuestions(selectedQuestionsArray);

      setTestTimer(selectedQuestionsArray.length * 300);

      const initialTimes = Array(selectedQuestionsArray.length).fill(0);
      setQuestionTimes(initialTimes);

      setQuestionTimer(300);
      setQuestionStartTime(Date.now());
    } else {
      console.error('Username or selected questions missing in query parameters.');
    }
  }, []);

  useEffect(() => {
    if (currentQuestionIndex >= 0 && currentQuestionIndex < selectedQuestions.length) {
      const currentQuestionID = selectedQuestions[currentQuestionIndex];
      fetchQuestionData(currentQuestionID);
      setQuestionStartTime(Date.now());
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
      const updatedQuestionTimes = [...questionTimes];
      const timeSpentOnCurrentQuestion = Math.floor((Date.now() - questionStartTime) / 1000);
      updatedQuestionTimes[currentQuestionIndex] += timeSpentOnCurrentQuestion;
      setQuestionTimes(updatedQuestionTimes);

      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);

      setQuestionTimer(300);
      setQuestionStartTime(Date.now());
    }
  }

  function onPrev() {
    if (currentQuestionIndex > 0) {
      const timeSpentOnCurrentQuestion = Math.floor((Date.now() - questionStartTime) / 1000);
      questionTimes[currentQuestionIndex] += timeSpentOnCurrentQuestion;

      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);

      const remainingTimeOnPreviousQuestion = testTimer - timeSpentOnCurrentQuestion;
      setTestTimer(remainingTimeOnPreviousQuestion);

      setQuestionStartTime(Date.now() - (testTimer - remainingTimeOnPreviousQuestion) * 1000);
      setQuestionTimer(0);
    }
  }

  function onFinishTest() {
    const updatedQuestionTimes = [...questionTimes];
    const timeSpentOnCurrentQuestion = Math.floor((Date.now() - questionStartTime) / 1000);
    updatedQuestionTimes[currentQuestionIndex] += timeSpentOnCurrentQuestion;

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
              <MathJax>{`$$${currentQuestion.Question}$$`}</MathJax>
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
