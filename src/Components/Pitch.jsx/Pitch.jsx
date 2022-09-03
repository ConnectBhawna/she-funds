import React from "react";
import { useEffect } from "react";
import NavBar from "../Navbar";

export default function Pitch() {
    useEffect(() => {
        const loggedInKey = localStorage.getItem("loggedInKey");
        if(!loggedInKey){
            window.location.href = "/home";
        }
    }, [])
  return (
    <div>
      <NavBar pitchDesk={false} create={false} />
    </div>
  );
}
