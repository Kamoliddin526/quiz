import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  font-family: "Arial", sans-serif;
`;

const Header = styled.h1`
  color: #333;
`;

const Select = styled.select`
  padding: 10px;
  margin: 10px 0;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 10px 0;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const QuestionContainer = styled.div`
  margin-top: 20px;
  text-align: left;

  h3 {
    color: #333;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    margin: 10px 0;
  }

  input {
    margin-right: 5px;
  }
`;

const ScoreContainer = styled.div`
  margin-top: 20px;
`;

const Modal = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
`;

const ModalContent = styled.div`
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
`;

const App = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get("https://opentdb.com/api_category.php");
      setCategories(response.data.trivia_categories);
    };

    fetchCategories();
  }, []);

  const startQuiz = async () => {
    const response = await axios.get(
      `https://opentdb.com/api.php?amount=4&category=${selectedCategory}&type=multiple`
    );
    setQuestions(response.data.results);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleQuestionNumberChange = (e) => {
    setQuestionNumber(parseInt(e.target.value));
  };

  const handleAnswerSelection = (questionIndex, selectedOption) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: selectedOption,
    });
  };

  const submitQuiz = () => {
    let currentScore = 0;

    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correct_answer) {
        currentScore += 1;
      }
    });

    setScore(currentScore);
    setShowModal(true);
  };

  const restartQuiz = () => {
    setCategories([]);
    setSelectedCategory("");
    setQuestionNumber(1);
    setQuestions([]);
    setUserAnswers({});
    setScore(0);
    setShowModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <Container>
      <Header>Quiz App</Header>
      <div className="d-flex gap-4">
        <Select onChange={handleCategoryChange}>
          <option value="">Select a Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        <Select
          onChange={handleQuestionNumberChange}
          disabled={!selectedCategory}
        >
          <option value="">Select Number of Questions</option>
          {[1, 2, 3, 4].map((number) => (
            <option key={number} value={number}>
              {number}
            </option>
          ))}
        </Select>
      </div>
      <Button
        onClick={startQuiz}
        disabled={!selectedCategory || !questionNumber}
      >
        Start Quiz
      </Button>

      {questions.length > 0 && (
        <div>
          {questions.slice(0, questionNumber).map((question, index) => (
            <QuestionContainer key={index}>
              <h3>{question.question}</h3>
              <ul>
                {question.incorrect_answers.map((option, optionIndex) => (
                  <li key={optionIndex}>
                    <input
                      type="radio"
                      name={`question${index}`}
                      value={option}
                      onChange={() => handleAnswerSelection(index, option)}
                      checked={userAnswers[index] === option}
                    />
                    {option}
                  </li>
                ))}
              </ul>
            </QuestionContainer>
          ))}
          <div className="d-flex justify-content-between">
            <Button onClick={submitQuiz}>Submit Quiz</Button>
          </div>
        </div>
      )}

      {score > 0 && (
        <ScoreContainer>
          <h2>Your Score: {score}</h2>
          <h3>Correct Answers:</h3>
          <ul>
            {questions.map((question, index) => (
              <li key={index}>
                {question.question} - {question.correct_answer}
              </li>
            ))}
          </ul>
        </ScoreContainer>
      )}

      <Modal show={showModal}>
        <ModalContent>
          <h2>Your Quiz Results</h2>
          <p>Correct Answers: {score}</p>
          <p>Incorrect Answers: {questionNumber - score}</p>
          <Button onClick={closeModal}>Close</Button>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default App;
