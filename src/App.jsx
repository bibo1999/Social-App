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
import { router } from '../router';
import { Toaster } from 'react-hot-toast';


let query = new QueryClient()




function App() {
  
    return (
    <>

    <UserDataProvider>
        <QueryClientProvider client={ query }>
            <RouterProvider router={router}></RouterProvider>
            <Toaster/>
            <ReactQueryDevtools/>
        </QueryClientProvider>
    </UserDataProvider>
    
    
    </>
  )
}

export default App