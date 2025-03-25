import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import UserLogin from './Pages/Login/UserLogin.jsx'
import StaffLogin from './Pages/Staff/StaffLogin.jsx'
import Register from '../src/Pages/Register/Register.jsx'
import Dashboard from './Pages/Patient/Dashboard/Dashboard.jsx';
import StaffDashboard from './Pages/Staff/Dashboard.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLogin />} />
        <Route path="/staffLogin" element={<StaffLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/StaffDashboard" element={<StaffDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
