import axios from "axios";
import { createContext, useEffect, useState } from "react";

export let UserData = createContext();

export function UserDataProvider(props){
    
    const [Token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
    if (!Token) {
      setUser(null);
      return;
    }

    async function fetchProfile() {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "https://linked-posts.routemisr.com/users/profile-data",
          {
            headers: {
              token: Token,
            },
          }
        );
        setUser(data.user);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [Token]);

    return<UserData.Provider value ={ { Token, setToken, user, setUser, loading, setLoading } }>
        {props.children}
    </UserData.Provider>
}