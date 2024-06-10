import { useState } from 'react'
import './App.css'

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './Pages/Home';
import RuleEditor from './Pages/RuleEditor';
import SignIn from './Pages/SignIn';
import Register from './Pages/Register';
import ErrorPage from './Pages/ErrorPage';
import Layout from './Pages/Layout';

function App() {
  const [count, setCount] = useState(0);
  const apiURL = "http://localhost:8080/api";

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout apiURL={apiURL} />,
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
          element: <SignIn apiURL={apiURL} />,
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
