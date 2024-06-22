import React, { useEffect, useRef, useState } from "react";
import "./askQuestion.css";
import { useNavigate, Link } from "react-router-dom";
// = axios
import axios from "../../axiosConfig";
import { RotateLoader } from "react-spinners";
import { toast } from "react-toastify";

const AskQuestion = () => {
  const [isLoading, setIsLoading] = useState(false); // State for loading spinner
  // ` useNavigate from react-router-dom
  const navigate = useNavigate();

  // ` handleSubmit for the form
  const titleRef = useRef("");
  const descriptionRef = useRef("");
  const tagRef = useRef("");

  useEffect(() => {
    //` Check if there is a questionId in query params for editing existing question
    const queryParams = new URLSearchParams(location.search);
    const questionId = queryParams.get("questionId");

    if (questionId) {
      //` Fetch existing question details and pre-fill the form for editing
      fetchQuestionDetails(questionId);
    }
  }, [location.search]);

  const fetchQuestionDetails = async (questionId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast("You are not logged in");
        return;
      }

      const response = await axios.get(`/questions/questions/${questionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { title, description, tag } = response.data;

      titleRef.current.value = title;
      descriptionRef.current.value = description;
      tagRef.current.value = tag;
    } catch (error) {
      toast("Error fetching question details:", error?.response?.data?.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting form...");
    setIsLoading(true);

    // Access the data from refs
    const titleValue = titleRef.current.value;
    const descriptionValue = descriptionRef.current.value;
    const tagValue = tagRef.current.value;

    // Retrieve token from local storage
    const token = localStorage.getItem("token");

    if (!token) {
      toast("You are not logged in");
      return;
    }

    const queryParams = new URLSearchParams(location.search);
    const questionId = queryParams.get("questionId");

    try {
      let response;
      if (questionId) {
        // If questionId exists, update existing question
        response = await axios.put(
          `/questions/questions/${questionId}`,
          {
            title: titleValue,
            description: descriptionValue,
            tag: tagValue,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Otherwise, post new question
        response = await axios.post(
          "/questions/all-questions",
          {
            title: titleValue,
            description: descriptionValue,
            tag: tagValue,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setIsLoading(false); // Stop loading spinner
      toast(response.data.message);

      if (questionId) {
        // If editing, navigate back to question details page
        navigate(`/${questionId}`);
      } else {
        // If posting new question, navigate to home or appropriate page
        navigate("/");
      }
    } catch (error) {
      setIsLoading(false); // Stop loading spinner on error
      console.log(error?.response);
      toast(error?.response?.data.message || "Failed to post/update question");
    }
  };

  return (
    <section className="question_section_container">
      <div className="question_steps_container">
        <div className="question_steps">
          <h3>Steps to write a good question</h3>
          <div className="question_steps_list">
            <ul>
              <li>Summarize your problem in a one-line title.</li>
              <li>Describe your problem in more detail.</li>
              <li>Describe what you tried and what you expected to happen</li>
              <li>Review your question and post it to the site</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="ask_question_form">
        <h3>{location.search ? "Edit" : "Ask a Public"} question</h3>
        <Link to={"/"}>Go to question page</Link>
        <div className="ask_question_box">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              ref={titleRef}
              required
              placeholder="Question Title"
            />
            <textarea
              id="description"
              name="description"
              rows="10"
              cols="50"
              ref={descriptionRef}
              required
              placeholder="Describe your problem in more detail"
            ></textarea>
            <input type="text" ref={tagRef} placeholder="Tag" />
            <button type="submit">
              <button type="submit">
                {isLoading ? (
                  <RotateLoader color="#ff8500" size={10} />
                ) : (
                  `${location.search ? "Edit" : "Post"} Your Question`
                )}
              </button>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AskQuestion;
