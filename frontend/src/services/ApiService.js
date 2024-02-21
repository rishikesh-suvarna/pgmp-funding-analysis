import axios from "axios";
import history from "../history";

//Fetch INterceptor Configuration
const fetch = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL + "/api/",
  timeout: 60000,
});

fetch.interceptors.request.use(
  (config) => {
    // Can add authentication & authorisation functions here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

fetch.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

const ApiService = {};

ApiService.requestKeywordData = (keyword) => {
    console.log(keyword)
    return fetch({
        url: `/request-keyword-data`,
        method: 'POST',
        data: {
          keyword: keyword
        }
    })
}

ApiService.fetchKeywordData = (keyword) => {
    return fetch({
        url: `/fetch-keyword-data?q=${keyword}`,
        method: 'GET',
    })
}

export default ApiService;
