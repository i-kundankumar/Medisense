import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './Home';
import Layout from "./components/Layout";
import Features from "./pages/features";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        {/* Default page → Login */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path='/features' element={<Features />} />
          <Route path='/About' element={<About />} />
          <Route path="/contact" element={<Contact />} /> 

        </Route>
        
        {/* Signup page */}
        <Route path="/signup" element={<Signup />} />
        <Route path='/Login' element={<Login />} /> 
        <Route path="/Dashboard" element={<Dashboard />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
