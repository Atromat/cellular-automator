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
  const [count, setCount] = useState(0)

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/RuleEditor",
          element: <RuleEditor />,
        },
        {
          path: "/SignIn",
          element: <SignIn />,
        },
        {
          path: "/Register",
          element: <Register />,
        }
      ],
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App
