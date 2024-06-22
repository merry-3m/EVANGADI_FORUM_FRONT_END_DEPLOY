import React, { useContext, useEffect, useState } from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosConfig";
import { MdKeyboardArrowRight } from "react-icons/md";
import userImg from "../../assets/images/user1.png";
import dayjs from "dayjs";
import { AppState } from "../../App";
import { toast } from "react-toastify";

const Home = () => {
  const { user } = useContext(AppState);
  const [questions, setQuestions] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [displayedQuestions, setDisplayedQuestions] = useState(4);
  const navigate = useNavigate();

  const handleAskQuestionClick = () => {
    navigate("/ask-question");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast("You are not logged in");
      navigate("/auth");
      return;
    }

    const fetchQuestions = async () => {
      try {
        let url = "/questions/questions";
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Log the data for debugging
        console.log("Fetched questions:", response.data);

        setQuestions(response.data);
      } catch (error) {
        toast(error?.response?.data?.message);
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, [navigate]);

  const handleQuestionClick = (questionid) => {
    navigate(`/${questionid}`);
  };

  const handleViewMoreClick = () => {
    const remainingQuestions = questions.length - displayedQuestions;
    const nextBatch = remainingQuestions > 4 ? 4 : remainingQuestions;
    setDisplayedQuestions(displayedQuestions + nextBatch);
  };

  // Handle the search
  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchValue(e.target.value);

    const token = localStorage.getItem("token");
    // if (!token) {
    //   toast("You are not logged in");
    //   navigate("/auth");
    //   return;
    // }

    try {
      const searchResult = await axios.post(
        "/questions/questions/search",
        { searchQuery: e.target.value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(searchResult.data);
      setQuestions(searchResult.data);
    } catch (error) {
      console.error("Error searching questions:", error);
    }
  };

  // Handle the unanswered filter
  const handleUnansweredFilter = async () => {
    try {
      const response = await axios.get("questions/question/unanswered", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Unanswered questions data:", response.data);
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching unanswered questions:", error);
    }
  };

  return (
    <section className="home_section">
      <div className="home_container">
        <button
          className="ask_question_button"
          onClick={handleAskQuestionClick}
        >
          Ask Questions
        </button>
        <h2 className="welcome_message">Welcome: {user?.username}</h2>
      </div>
      <div className="input_filter_container">
        <input
          type="text"
          value={searchValue}
          placeholder="Search"
          onChange={handleSearch}
          className="search_input"
        />
        <div className="filter_list_container">
          <div onClick={handleUnansweredFilter}>UnAnswered</div>
        </div>
      </div>
      <div className="question_section">
        <h2>Questions</h2>
        <hr />
        <div className="question_container">
          {questions.slice(0, displayedQuestions).map((question, index) => (
            <div key={question.questionid}>
              <div
                className="question_item"
                onClick={() => handleQuestionClick(question.questionid)}
              >
                <div className="icon_username_container">
                  <div className="icon_container">
                    <img src={userImg} alt="" />
                  </div>
                  <span className="question_username">{question.username}</span>
                </div>
                <span className="question_title">{question?.title}</span>
                <span className="question_created_at">
                  asked{" "}
                  {dayjs(question?.created_at).format("MMMM D, YYYY h:mm A")}
                </span>

                <div className="arrow_icon_container">
                  <MdKeyboardArrowRight size={40} />
                </div>
              </div>
              {index < displayedQuestions - 1 && <hr />}
            </div>
          ))}
        </div>
        {displayedQuestions < questions.length ? (
          <div className="view_more_container">
            <button className="view_more_button" onClick={handleViewMoreClick}>
              View More Questions
            </button>
          </div>
        ) : (
          <div className="view_more_container">
            <span>No more questions</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default Home;
