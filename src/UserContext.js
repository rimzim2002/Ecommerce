import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [token, setToken] = useState(() => {
    return localStorage.getItem("authToken") || null;
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const response = await axios.post("http://localhost:5000/api/myprofile", {}, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data.data); 
        } catch (error) {
          console.error("Error fetching profile:", error.message);
        }
      }
    };

    fetchProfile();
  }, [token]);  

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
