import axios from "axios";
import history from "../history";

//Fetch Interceptor Configuration
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
    keyword = keyword.map(k => k.value).join(',');
    return fetch({
        url: `/request-keyword-data`,
        method: 'POST',
        data: {
          keyword: keyword
        }
    })
}

ApiService.requestFreshKeywordData = (keyword) => {
    keyword = keyword.map(k => k.value).join(',');
    return fetch({
        url: `/request-fresh-keyword-data`,
        method: 'POST',
        data: {
          keyword: keyword
        }
    })
}

ApiService.fetchKeywordData = (keyword, status, source, sortBy, page) => {
    keyword = keyword.map(k => k.value).join(',');
    return fetch({
        url: `/fetch-keyword-data?keyword=${keyword}&status=${status}&source=${source}&sort=${sortBy}&page=${page}`,
        method: 'GET',
    })
}

ApiService.exportKeywordData = (keyword, status, source, sortBy) => {
    keyword = keyword.map(k => k.value).join(',');
    return fetch({
        url: `/export-keyword-data?keyword=${keyword}&status=${status}&source=${source}&sort=${sortBy}`,
        method: 'POST',
        responseType: 'blob'
    })
}

ApiService.setGrantStatus = (status, id) => {
    return fetch({
        url: `/set-grant-status`,
        method: 'PUT',
        data: {
          status,
          id
        }
    })
}

ApiService.fetchAllKeywords = () => {
    return fetch({
        url: `/fetch-keywords`,
        method: 'GET',
    })
}

ApiService.fetchAllSearchHistory = (page) => {
    return fetch({
        url: `/fetch-history?page=${page}`,
        method: 'GET',
    })
}

export default ApiService;
