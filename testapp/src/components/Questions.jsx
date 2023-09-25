import React, { useEffect, useState } from 'react';

const Questions = () => {
  const [question, setQuestion] = useState({});
  const questionID = "AreaUnderTheCurve_21"; // Replace with the desired QuestionID

  useEffect(() => {
    const fetchApiData = async (url) => {
      try {
        const res = await fetch(url);
        const data = await res.json();

        if (data && data.length > 0) {
          const firstQuestion = data[0];
          setQuestion(firstQuestion);
        } else {
          console.error('No questions found in the API response.');
        }
      } catch (error) {
        console.error(error);
      }
    };

    let API = `https://0h8nti4f08.execute-api.ap-northeast-1.amazonaws.com/getQuestionDetails/getquestiondetails?QuestionID=${questionID}`;
    fetchApiData(API);
  }, [questionID]);

  return (
    <div>
      <h2>Question:</h2>
      {question && question.Question ? (
        <p>{question.Question}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Questions;
