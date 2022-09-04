
import './App.css';
import { BrowserRouter as Router, Routes, Route   } from "react-router-dom";
import Landing from './Components/Landing';
import Home from './Components/Home/Home';
import Pitch from './Components/Pitch.jsx/Pitch';
function App() {
  return (
   <Router>
    <Routes>
      <Route path = "/" element = {<Landing/>}/>
      <Route path = "/home" element = {<Home/>}/>
      <Route path = "/pitch" element = {<Pitch/>}/>
    </Routes>
   </Router>
  );
}

export default App;
