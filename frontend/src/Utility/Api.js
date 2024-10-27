import axios from 'axios';
import { endPoints } from '../Constant/Environment';

// Set the base URL for your API
const baseURL = endPoints.apiBaseUrl;

// Create an instance of Axios with a base URL and custom headers
const api = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    // SessionId: localStorage.getItem('session')
    //'Access-Control-Allow-Origin': '*',
    // Authorization: 'Bearer ' + localStorage.getItem('caroktajwt')
  }
});

// Helper function for adding a new item
export const addItem = async (endpoint, requestBody) => {
  try {
    const response = await api.post(endpoint, requestBody);
    return response.data;
  } catch (error) {
    console.error('Error adding item:', error);
    throw error;
  }
};


export const addItemToken = async (endpoint, requestBody) => {

  const storedAuthState = localStorage.getItem("session");
  // console.log(storedAuthState);
  try {
    const response = await api.post(endpoint, requestBody, {
      headers: {
        'Accept': 'application/json',
        // 'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${storedAuthState}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding item:', error);
    throw error;
  }
};

export const addItemForm = async (endpoint, requestBody) => {

  const storedAuthState = localStorage.getItem("session");
  // console.log(storedAuthState);
  try {
    const response = await api.post(endpoint, requestBody, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${storedAuthState}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding item:', error);
    throw error;
  }
};

export const updateItemToken = async (endpoint, requestBody) => {

  const storedAuthState = localStorage.getItem("session");
  // console.log(storedAuthState)
  try {
    const response = await api.put(endpoint, requestBody, {
      headers: {
        'Accept': 'application/json',
        // 'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${storedAuthState}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding item:', error);
    throw error;
  }
};


export const addItemApi = async (endpoint, requestBody) => {

  try {
    const response = await api.post(endpoint, requestBody, {
      headers: {
        'Accept': 'application/json',
        'X-API-Key': 'a0482b-1f6c-466f-bdd6-3782639ed3da',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding item:', error);
    throw error;
  }
};


export const deleteItem = async (endpoint) => {
  const storedAuthState = localStorage.getItem("session");
  console.log(storedAuthState);

  try {
    const response = await api.delete(endpoint, {
      headers: {
        'Accept': 'application/json',
        // 'Content-Type' is usually not needed for DELETE requests
        'Authorization': `Bearer ${storedAuthState}`
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};


// Helper function for getting all items
export const getAllItems = async (endpoint) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error getting items:', error);
    throw error;
  }
};

export const getAllItemsToken = async (endpoint) => {
  try {
    // const storedAuthState = JSON.parse(localStorage.getItem("authState"));
    const storedAuthState = localStorage.getItem("session");

    const headers = {
      'Accept': 'application/json',
      // 'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${storedAuthState}`

    };
    const response = await api.get(endpoint, { headers: headers });
    return response.data;
  } catch (error) {
    console.error('Error getting items:', error);
    throw error;
  }
};

export const getAllItemsData = async (endpoint) => {
  try {
    const headers = {
      'Accept': 'application/json',
      // 'Content-Type': 'multipart/form-data',
      'x-access-key': '27318e8e431733ff30d912191991ff89',
    };
    const response = await api.get(endpoint, { headers: headers });
    return response.data;
  } catch (error) {
    console.error('Error getting items:', error);
    throw error;
  }
};


