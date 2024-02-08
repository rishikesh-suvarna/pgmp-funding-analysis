import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  }
])

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App;