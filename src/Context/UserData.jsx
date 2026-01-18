import { createContext, useState } from "react";

export let UserData = createContext();

export function UserDataProvider(props){
    
    const [Token, setToken] = useState(localStorage.getItem("token"));

    return<UserData.Provider value ={ { Token, setToken } }>
        {props.children}
    </UserData.Provider>
}