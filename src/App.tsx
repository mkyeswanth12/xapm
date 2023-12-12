import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import Home from "./components/Home/Home";
import Metrics from "./components/Metrics/Metrics";
import Images from "./components/Images/Images";
import Containers from "./components/Containers/Containers";
import Settings from "./components/Settings/Settings";
import VolumeHistory from "./components/VolumeHistory/VolumeHistory";
import ProcessLogs from "./components/ProcessLogs/ProcessLogs";
import SharedLayout from "./components/SharedLayout/SharedLayout";
import About from "./components/About/About";
import useSurvey from "./helpers/dispatch";
import useHelper from "./helpers/commands";

const App = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { updateSession } = useSurvey();
  const { checkCookie } = useHelper();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<boolean | undefined>(undefined);

  const checkLogin = async () => {
    try {
      const data = await checkCookie();
      if (data) {
        updateSession();
        setSession(true);
      } else {
        setSession(false);
      }
      setLoading(false);
    } catch (err) {
      console.log("Cannot get uid key or API key:", err);
      setSession(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLogin();
  }, [checkCookie, updateSession]);

  const navigateToHome = async () => {
    await checkLogin();
    navigate("/home");
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <Routes>
      <Route
        path="/"
        element={session ? <Navigate to="/home" /> : <Navigate to="/login" />}
      />
      :
      <Route
        path="/login"
        element={<Login navigateToHome={navigateToHome} />}
      />
      <Route path="/userSignup" element={<SignUp />} />
      <Route
        path="/home"
        element={session ? <SharedLayout /> : <Navigate to="/login" />}
      >
        <Route index element={<Home />} />
        <Route path="/home/volume" element={<VolumeHistory />} />
        <Route path="/home/metrics" element={<Metrics key={1} />} />
        <Route path="/home/logs" element={<ProcessLogs key={1} />} />
        <Route path="/home/about" element={<About />} />
        <Route
          path="/home/images"
          element={<Images imagesList={undefined} />}
        />
        <Route path="/home/running" element={<Containers />} />
        <Route path="/home/" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default App;
