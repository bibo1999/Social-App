import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router-dom';
import { router } from '../router';
import { ReactQueryDevtools } from './../node_modules/@tanstack/react-query-devtools/src/index';
import './App.css';
import { UserDataProvider } from './Context/UserData';


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