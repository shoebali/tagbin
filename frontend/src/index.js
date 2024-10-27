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
import ProtectedRoute from './components/ProtectedRoute';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route exact="true" path="/login" element={<Login />} />
      <Route exact="true" path="/register" element={<Register />} />
      <Route path="/" element={<ProtectedRoute redirectTo="/login" />}>
        <Route exact="true" path="/jobs" element={<Jobs />} />
        <Route exact="true" path="/job-applications" element={<JobApplication />} />
      </Route>
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

reportWebVitals();
