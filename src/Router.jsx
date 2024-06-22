import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Auth from './pages/Auth/Auth'
import Home from './pages/Home/Home'
import AskQuestion from './pages/AskQuestion/AskQuestion'
import QuestionAnswerPage from './pages/QuestionAnswerPage/QuestionAnswerPage'
import ChatApp from './pages/ChatApp/ChatApp'
import NotFound from './pages/NotFound/NotFound'
import { AppState } from './App'

const Routing = () => {
 const { user } = useContext(AppState);
  return (
    <Routes>
         <Route path="/auth" element={<Auth />} />
      <Route path="/" element={user ? <Home /> : <Navigate to="/auth" />} />
      <Route path="/chatApp" element={<ChatApp />} />
      <Route path="/ask-question" element={<AskQuestion />} />
      <Route path="/:questionId" element={<QuestionAnswerPage />} />
      <Route path="*" element={<NotFound />} />
      </Routes>
  )
}

export default Routing