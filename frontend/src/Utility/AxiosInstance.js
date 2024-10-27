import axios from 'axios';

import { endPoints } from "../Constant/Environment";
export const BASE_URL = endPoints.apiBaseUrl;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    // SessionId: localStorage.getItem('session')
    //'Access-Control-Allow-Origin': '*',
    // Authorization: 'Bearer ' + localStorage.getItem('caroktajwt')
  }
});



export const formatDate = (createdAt) => {
  const currentDate = new Date();
  const createdAtDate = new Date(createdAt);
  const timeDifference = currentDate - createdAtDate;

  const secondsDifference = Math.floor(timeDifference / 1000);
  const minutesDifference = Math.floor(secondsDifference / 60);
  const hoursDifference = Math.floor(minutesDifference / 60);
  const daysDifference = Math.floor(hoursDifference / 24);

  if(daysDifference > 0) {
    return `Created last ${daysDifference} ${daysDifference === 1 ? 'day' : 'days'} ago`;
  }else if (hoursDifference > 0) {
    return `Created last ${hoursDifference} ${hoursDifference === 1 ? 'hour' : 'hours'} ago`;
  } else if (minutesDifference > 0) {
    return `Created last ${minutesDifference} ${minutesDifference === 1 ? 'minute' : 'minutes'} ago`;
  } else {
    return `Created last ${secondsDifference} ${secondsDifference === 1 ? 'second' : 'seconds'} ago`;
  }
};

export const formatDateByMonth = (createdAt) => {
  const currentDate = new Date();
  const createdAtDate = new Date(createdAt);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return `${createdAtDate.toLocaleDateString('en-US', options)}`;

};

export const subscriptionEnd = (createdAt) => {
  const createdAtDate = new Date(createdAt);
  const createdAtDateOneMonthLater = new Date(createdAtDate.getTime());
  createdAtDateOneMonthLater.setMonth(createdAtDateOneMonthLater.getMonth() + 1);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return `${createdAtDateOneMonthLater.toLocaleDateString('en-US', options)}`;
};

export const checkSubscription = (createdAt) => {
  const currentDate = new Date();
  const createdAtDate = new Date(createdAt);
 
  currentDate.setHours(0, 0, 0, 0);
  createdAtDate.setHours(0, 0, 0, 0);
 
  createdAtDate.setMonth(createdAtDate.getMonth() + 1);
  // console.log(currentDate , createdAtDate);
  return currentDate > createdAtDate;
};
export const countLeftDays = (createdAt) => {
  const currentDate = new Date();
  const createdAtDate = new Date(createdAt); 
  currentDate.setHours(0, 0, 0, 0);
  createdAtDate.setHours(0, 0, 0, 0); 
  createdAtDate.setMonth(createdAtDate.getMonth() + 1); 
  const differenceInMs = createdAtDate- currentDate; 
  // console.log(currentDate, createdAtDate, differenceInMs);
  const daysLeft = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));
  return daysLeft;
};

export const capitalizeFirstLetter = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
