import './App.css';
import UserLogin from './Pages/Login/UserLogin.jsx'
import Register from '../src/Pages/Register/Register.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from './Pages/Patient/Dashboard/Dashboard.jsx';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
