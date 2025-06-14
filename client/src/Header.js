import { useContext, useEffect, useState } from "react";
import {Link} from "react-router-dom";
import {UserContext} from "./UserContext";

export default function Header(){
    const {setUserInfo,userInfo} = useContext(UserContext);
    useEffect(() => {
        fetch('http://localhost:5000/profile', {
          credentials: 'include',
        })
        .then(response => {
          if (!response.ok) throw new Error('Failed to fetch profile');
          return response.json();
        })
        .then(userInfo => {
          setUserInfo(userInfo);
        })
        .catch(err => {
          console.error(err);
          setUserInfo(null);
        });
      }, [setUserInfo]);
      

        function logout(){
            fetch('http://localhost:5000/logout', {
            credentials: 'include',
            method: 'POST',
        });
            setUserInfo(null);
        }

        const username = userInfo?.username;
    return( 
        <header>
        <Link to="/" className="logo">FenerBlog</Link>
        <img src="https://upload.wikimedia.org/wikipedia/de/e/e6/Fenerbahce_Spor_Kulubu.svg" alt=" Description" />
        <nav>
        {username && (
          <>
            <Link to="/create">New post</Link>
            <a onClick={logout}>Logout ({username})</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
      </header>
    )
}