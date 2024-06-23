import { useEffect, useState } from 'react'
import './App.css'

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './Pages/Home';
import RuleEditor from './Pages/RuleEditor';
import SignIn from './Pages/SignIn';
import Register from './Pages/Register';
import ErrorPage from './Pages/ErrorPage';
import Layout from './Pages/Layout';
import { API_URL } from './api';

function App() {
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const apiURL = API_URL;

  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    if (userToken) {
      setIsUserSignedIn(true);
    }
  }, [])
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout apiURL={apiURL} isUserSignedIn={isUserSignedIn} setIsUserSignedIn={setIsUserSignedIn} />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/RuleEditor",
          element: <RuleEditor apiURL={apiURL} />,
        },
        {
          path: "/SignIn",
          element: <SignIn apiURL={apiURL} setIsUserSignedIn={setIsUserSignedIn} />,
        },
        {
          path: "/Register",
          element: <Register apiURL={apiURL} />,
        }
      ],
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App
