import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { logout } from './redux/Store/slices/authSlice';
import './App.css';
import Header from "./components/Header/Header";
import { Outlet } from 'react-router-dom';
import { Actions } from "../src/redux/Actions/Actions";
import { useNavigate } from "react-router-dom";

function App() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, tokenExpiry } = useSelector((state) => state.auth);
  
  useEffect(() => {
    const checkTokenExpiry = () => {
      if (token && tokenExpiry && new Date().getTime() > tokenExpiry) {
        dispatch({ type: Actions.LOGOUT });
        localStorage.clear();
        sessionStorage.clear();
        navigate("/");
        // dispatch(logout());
        // alert('Session expired. Please log in again.');
      }
    };
    checkTokenExpiry();
  }, [token, tokenExpiry, dispatch]);

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default App;
