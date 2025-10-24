import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Toaster } from "react-hot-toast";

import HomePage from "./routes/HomePage/HomePage";
import SinglePage from "./routes/singlePage/SinglePage";
import ProfilePage from "./routes/profilePage/ProfilePage";
import Register from "./routes/register/Register";
import ListPage from "./routes/listPage/ListPage";
import { Layout, RequireAuth } from "./routes/layout/Layout";
import ProfileUpdatePage from "./routes/profileUpdatePage/ProfileUpdatePage";
import NewPostPage from "./routes/newPostPage/NewPostPage";
import AboutPage from "./routes/about/AboutPage";
import SplashScreen from "./components/SplashScreen";

import "./index.css";
import { Contact } from "./routes/contact/Contact";
import { Agents } from "./routes/agents/Agents";

const stripePromise = loadStripe(
  "pk_test_51RRC2QFSQWj2Vo1fPw9vNiWEcDeYh49Y6GR8SAHuO9rPt52H4fIXffNOPoKjUHLsHO0qmu4o7CSCO0rY2FpXtRds00p3XIMrbH"
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/:id", element: <SinglePage /> },
      { path: "/list", element: <ListPage /> },
      { path: "/register", element: <Register /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/contacts", element: <Contact /> },
      { path: "/agents", element: <Agents /> },

    ],
  },
  {
    path: "/",
    element: <RequireAuth />,
    children: [
      { path: "/profile", element: <ProfilePage /> },
      { path: "/profile/update", element: <ProfileUpdatePage /> },
      { path: "/add", element: <NewPostPage /> },
    ],
  },
]);

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;

  return (
    <Elements stripe={stripePromise}>
      <Toaster position="top-right" reverseOrder={false} />
      <RouterProvider router={router} />
    </Elements>
  );
};

export default App;
