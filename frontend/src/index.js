import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import App from './App';
import reportWebVitals from './reportWebVitals';
import Home from "./pages/JobListPage"; 
import Login from "./components/Auth/Login"; 
import Register from "./components/Auth/Signup"; 
import Jobs from "./components/Jobs/Jobs.jsx"; 
import JobApplication from "./components/JobApplication/JobApplication.jsx"; 
import { Provider } from 'react-redux';
import store from './redux/Store/store';
import JobResultsPage from './components/JobResultsPage/JobResultsPage';
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route exact="true" path="/login" element={<Login />} />
      <Route exact="true" path="/register" element={<Register />} />
      <Route exact="true" path="/jobs" element={<Jobs />} />
      <Route exact="true" path="/job-applications" element={<JobApplication />} />
      <Route exact="true" path="/search/:jobTitleSlug" element={<JobResultsPage />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
