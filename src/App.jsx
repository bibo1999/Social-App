import React, { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Profile from './components/Profile/Profile';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Notfound from './components/Notfound/Notfound';
import { UserDataProvider } from './Context/UserData';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from './../node_modules/@tanstack/react-query-devtools/src/index';
import PostDetails from './components/PostDetails/PostDetails';


let query = new QueryClient()

let x = createBrowserRouter([
    { path: "", element: <Layout/>, children:[
        { index:true , element:  <ProtectedRoute> <Home/> </ProtectedRoute>  },
        { path: "profile", element:  <ProtectedRoute> <Profile/> </ProtectedRoute> },
        { path: "postdetails/:id", element: <ProtectedRoute> <PostDetails/> </ProtectedRoute>  },
        { path: "login", element: <Login/>},
        { path: "register", element: <Register/>},
        { path: "*", element: <Notfound/>},
    ]}
])



function App() {
  
    return (
    <>

    <UserDataProvider>
        <QueryClientProvider client={ query }>
            <RouterProvider router={x}></RouterProvider>
            <ReactQueryDevtools/>
        </QueryClientProvider>
    </UserDataProvider>
    
    
    </>
  )
}

export default App