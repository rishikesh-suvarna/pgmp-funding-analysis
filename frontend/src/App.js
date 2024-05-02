import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import './scss/style.scss'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import SearchHistory from './pages/SearchHistory';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/search-history',
    element: <SearchHistory />
  },
])

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App;