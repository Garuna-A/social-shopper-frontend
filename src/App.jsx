import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Rooms from './pages/Rooms';
import RoomsDashboard from './pages/RoomsDashboard';

function App() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/rooms" element={isLoggedIn ? <Rooms /> : <Navigate to="/login" />} />
      <Route path="/rooms/:id" element={isLoggedIn ? <RoomsDashboard /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to={isLoggedIn ? "/rooms" : "/login"} />} />
    </Routes>
  );
}

export default App;
