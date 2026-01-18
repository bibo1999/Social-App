import { createContext } from 'react';
import axios from 'axios';

export let PostContext = createContext();

export function PostContextProvider(props){


    function getAllPosts(){
       return axios.get(`https://linked-posts.routemisr.com/posts?limit=50`,
            { 
            headers : {
                token : localStorage.getItem("token"),
            },
        }
        )
        .then( (res) =>{
           return res
        })
        .catch( (err)=>{
            return err
            
        })
    }


return <PostContext.Provider value={ {getAllPosts} }>
            {props.children}
</PostContext.Provider>
}