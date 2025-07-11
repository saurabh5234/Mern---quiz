import { useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from './Layout/AppLayout';
import Home from './pages/HomePage';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Dashboard from './pages/DashboardPage';
import Resultpage from './pages/Resultpage';
import ExplanationPage from './pages/ExplanationPage';
import CreateQuizPage from './pages/CreateQuizPage';
import AttemptQuizPage from './pages/AttemptQuizPage';
import Historypage from './pages/HistoryPage';
import LeaderBoardPage from './pages/LeaderBoardPage';
import { ToastContainer, toast } from 'react-toastify';
import Edit from './pages/Edit';
import ProfilePage from './pages/ProfilePage';
import JoinQuizPage from './pages/JoinQuizPage';
import HomePage from './pages/HomePage';
import AiQuizPage from './pages/AiQuizPage';
import HelpAndResources from './pages/HelpAndResources';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
// import { jwtDecode } from 'jwt-decode';


const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/dashboard', element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
      { path: '/edit-quiz/:id', element: <Edit /> },
      { path: '/result/:id', element: <ProtectedRoute><Resultpage /></ProtectedRoute> },
      { path: '/leaderboard/:id', element: <ProtectedRoute><LeaderBoardPage /></ProtectedRoute> },
      { path: '/explanation/:id', element: <ProtectedRoute><ExplanationPage /></ProtectedRoute> },
      { path: '/create-quiz', element: <ProtectedRoute><CreateQuizPage /></ProtectedRoute> },
      { path: '/history', element: <ProtectedRoute><Historypage /></ProtectedRoute> },
      { path: '/profile', element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },
      { path: '/join-quiz', element: <ProtectedRoute><JoinQuizPage /></ProtectedRoute> },
      { path: '/ai-quiz', element: <ProtectedRoute><AiQuizPage /></ProtectedRoute> },

    ]
  },
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/attempt-quiz/:id', element: <ProtectedRoute><AttemptQuizPage /></ProtectedRoute> },
  { path: '/help', element: <HelpAndResources /> },
  { path: '/forgot', element: <ForgotPassword /> },
  { path: '/reset-password/:token', element: <ResetPassword /> }
]);



const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
};

export default App;
