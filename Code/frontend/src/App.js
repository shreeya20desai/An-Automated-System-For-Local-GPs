import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import UserLogin from './Pages/Login/UserLogin.jsx'
import StaffLogin from './Pages/Staff/StaffLogin.jsx'
import Register from '../src/Pages/Register/Register.jsx'
import Dashboard from './Pages/Patient/Dashboard/Dashboard.jsx';
import StaffDashboard from './Pages/Staff/Dashboard.jsx';
import AdminDashboard from './Pages/Admin/Dashboard.jsx'
import CoughPage from './Components/Cough.jsx';
import FeverPage from './Components/Fever.jsx';
import Abdonimalpain from './Components/Abdominalpain.jsx';


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLogin />} />
        <Route path="/staffLogin" element={<StaffLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/StaffDashboard" element={<StaffDashboard />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/CoughPage" element={<CoughPage />} />
        <Route path="/FeverPage" element={<FeverPage />} />
        <Route path="/Abdonimalpage" element={<Abdonimalpain />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
