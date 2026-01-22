import { createBrowserRouter } from 'react-router-dom';
import Home from './src/components/Home/Home';
import Layout from './src/components/Layout/Layout';
import Login from './src/components/Login/Login';
import Notfound from './src/components/Notfound/Notfound';
import PostDetails from './src/components/PostDetails/PostDetails';
import Profile from './src/components/Profile/Profile';
import ProtectedRoute from './src/components/ProtectedRoute/ProtectedRoute';
import Register from './src/components/Register/Register';
import ForgetPassword from './src/components/ForgetPassword/ForgetPassword';
import MyPosts from './src/components/MyPosts/MyPosts';

export let router = createBrowserRouter([
    { path: "", element: <Layout/>, children:[
        { index:true , element:  <ProtectedRoute> <Home/> </ProtectedRoute>  },
        { path: "profile", element:  <ProtectedRoute> <Profile/> </ProtectedRoute> },
        { path: "postdetails/:id", element: <ProtectedRoute> <PostDetails/> </ProtectedRoute>  },
        { path: "forgetpassword", element: <ProtectedRoute> <ForgetPassword/> </ProtectedRoute>  },
        { path: "myposts", element: <ProtectedRoute> <MyPosts/> </ProtectedRoute>  },
        { path: "login", element: <Login/>},
        { path: "register", element: <Register/>},
        { path: "*", element: <Notfound/>},
    ]}
])