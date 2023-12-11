import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/Dashboard";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Login";
import Account from "../pages/Account";
import Syllabus from "../pages/Syllabus";

const appRoute = createBrowserRouter([
    {
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
        {
          path: "/account",
          element: <Account />
        },
        {
          path: "syllabus",
          element: <Syllabus />
        }
      ],
    },
    {
      element: <AuthLayout />,
      children: [
        {
          path: "/login",
          element: <Login />,
        },
      ],
    },
  ]);

  export default appRoute;
  