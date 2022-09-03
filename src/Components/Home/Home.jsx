import React from "react";
import NavBar from "../Navbar";
import Loader from "../Loader";
export default function Home() {
  return (
    <div>
      <NavBar pitchDesk={false} create={true} />
    </div>
  );
}
