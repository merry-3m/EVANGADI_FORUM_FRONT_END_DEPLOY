import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../../axiosConfig";
import "./questionAnswerPage.css";
import userImg from "../../assets/images/user.png";
import dayjs from "dayjs";
import { AppState } from "../../App";
import { RotateLoader } from "react-spinners";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import edit and delete icons
import NotFound from "../NotFound/NotFound"; // Import NotFound component

const QuestionAnswerPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // State for loading spinner
  const { user } = useContext(AppState); // User context from App.jsx
  const { questionId } = useParams(); // Extract questionId from URL params
  const [question, setQuestion] = useState([]); // State to store the question
  const [answers, setAnswers] = useState([]); // State to store answers
  const [answerValue, setAnswerValue] = useState(""); // State for new answer input
  const [displayedAnswers, setDisplayedAnswers] = useState(4); // State to track displayed answers
  const [notFound, setNotFound] = useState(false); // State for not found flag

  //`Fetch question and answers on component mount or when questionId changes
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast("You are not logged in");
      return;
    }

    const fetchQuestionAndAnswers = async () => {
      try {
        // Fetch question by questionId
        const questionResponse = await axios.get(`/questions/questions/${questionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Check if the question exists
        if (!questionResponse.data || questionResponse.data.length === 0) {
          setNotFound(true);
          return;
        }

        // Fetch answers for the question
        const answerResponse = await axios.get(`/answers/answer/${questionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Set fetched question and answers in state
        setQuestion(questionResponse.data);
        setAnswers(answerResponse.data);
      } catch (error) {
        setNotFound(true);
        toast("Error fetching specific question:", error?.response?.data?.message);
        console.error("Error fetching question and answers:", error);
      }
    };

    fetchQuestionAndAnswers();
  }, [questionId]);

  //` Function to handle submission of an answer
  const handleAnswerSubmit = async (e) => {
    e.preventDefault();

    if (!answerValue) {
      toast("Please fill in all the fields");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast("You are not logged in");
      return;
    }

    setIsLoading(true); // Start loading spinner

    try {
      // Post new answer to the backend
      const { data } = await axios.post(
        `/answers/answer/${questionId}`,
        {
          answer: answerValue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update answers state with newly added answer
      setAnswers((prevAnswers) => [data.answerResult, ...prevAnswers]);

      // Clear answer input field after successful submission
      setAnswerValue("");

      // Show success message to user
      toast(data?.message);

      setIsLoading(false); // Stop loading spinner
    } catch (error) {
      setIsLoading(false); // Stop loading spinner
      toast(error?.response?.data?.message || "Failed to post answer");
    }
  };

  //` Function to handle editing of question
  const handleEditQuestion = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast("You are not logged in");
        return;
      }

      // Fetch the current question details from state
      const currentQuestion = question[0]; // Assuming question is fetched as an array with single object

      if (!currentQuestion) {
        toast("Question not found");
        return;
      }

      // Redirect to /ask-question page with query parameters for editing
      navigate(`/ask-question?questionId=${questionId}`);
    } catch (error) {
      toast(error?.response?.data?.message || "Failed to edit question");
    }
  };

  //` Function to handle deletion of question
  const handleDeleteQuestion = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this question?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast("You are not logged in");
        return;
      }

      // Send request to delete question by questionId
      const response = await axios.delete(`/questions/questions/${questionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Show success message to user
      toast(response.data.message);

      // Optionally navigate away or update UI after successful delete
      // Example: Navigate back to question list page
      navigate("/");
    } catch (error) {
      toast(error?.response?.data?.message || "Failed to delete question");
    }
  };

  //` Function to handle editing of answer
  const handleEditAnswer = async (answerId, newAnswer) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast("You are not logged in");
        return;
      }

      // Send request to edit answer by answerId
      const response = await axios.put(
        `/answers/answer/${answerId}`,
        { answer: newAnswer },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update answers state with the edited answer
      setAnswers((prevAnswers) =>
        prevAnswers.map((answer) => (answer.answerid === answerId ? { ...answer, answer: newAnswer } : answer))
      );

      // Show success message to user
      toast(response.data.message);
    } catch (error) {
      toast(error?.response?.data?.message || "Failed to edit answer");
    }
  };

  //` Function to handle deletion of answer
  const handleDeleteAnswer = async (answerId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this answer?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast("You are not logged in");
        return;
      }

      // Send request to delete answer by answerId
      const response = await axios.delete(`/answers/answer/${answerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update answers state to remove the deleted answer
      setAnswers((prevAnswers) => prevAnswers.filter((answer) => answer.answerid !== answerId));

      // Show success message to user
      toast(response.data.message);
    } catch (error) {
      toast(error?.response?.data?.message || "Failed to delete answer");
    }
  };

  // Conditionally render based on not found status
  if (notFound) {
    return <NotFound />;
  }

  return (
    <section className="question_answer_page_container">
      <h4>Question</h4>
      <div>
        {/* Display the question */}
        {question.map((question, i) => (
          <div key={i} className="question_title">
            <h6>{question.title}?</h6>
            <p>{question.description}</p>
            {/* Display edit and delete buttons for authenticated user */}
            {user && user.userid === question.userid && (
              <div className="edit_delete_buttons">
                <button onClick={handleEditQuestion}>
                  <FaEdit /> Edit
                </button>
                <button onClick={handleDeleteQuestion}>
                  <FaTrash /> Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Display the answers */}
      <div>
        <hr />
        <h3>Answer From The Community</h3>
        <hr />
        {/* Display posted answers */}
        <div>
          {answers.slice(0, displayedAnswers).map((answer, i) => (
            <div key={i} className="answer_item">
              <div className="icon_username_container">
                <div className="icon_container">
                  <img src={userImg} alt="User" />
                </div>
                <span className="question_username">{answer.username}</span>
              </div>
              <div className="answer_text">
                <h6>{answer.answer}</h6>
                <span className="answer_created_at">
                  answered{" "}
                  {dayjs(answer.created_at).format("MMMM D, YYYY h:mm A")}
                </span>
                {/* Display edit and delete buttons for authenticated user */}
                {user && user.userid === answer.userid && (
                  <div className="edit_delete_buttons">
                    <button onClick={() => handleEditAnswer(answer.answerid, prompt("Edit your answer:", answer.answer))}>
                      <FaEdit /> Edit
                    </button>
                    <button onClick={() => handleDeleteAnswer(answer.answerid)}>
                      <FaTrash /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Render "View More Answers" button if there are more answers */}
        {answers.length > displayedAnswers && (
          <div className="view_more_answers">
            <button onClick={() => setDisplayedAnswers((prev) => prev + 4)}>
              View More Answers
            </button>
          </div>
        )}
        {/* Show message when there are no more answers to display */}
        {answers.length <= displayedAnswers && (
          <div className="no_more_answers">No more answers</div>
        )}
        {/* Answer form */}
        <div className="answer_form">
          <h3>Answer The Top Question</h3>
          <Link to={"/"}>Go to question page</Link>
          <div className="ask_question_box">
            <form onSubmit={handleAnswerSubmit}>
              <textarea
                type="text"
                value={answerValue}
                onChange={(e) => setAnswerValue(e.target.value)}
                placeholder="Your Answer..."
                required
              />
              <button type="submit" className="answer_button">
                {isLoading ? (
                  <RotateLoader color="#ff8500" size={10} />
                ) : (
                  "Post Your Answer"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuestionAnswerPage;
