import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "../src/pages/Login";
import Dashboard from "../src/pages/Dashboard"
import Appointments from "../src/pages/Appointments";
import RegisterUser from "./pages/RegisterUser";
import RegisterVet from "./pages/RegisterVet";
import RegisterPet from "./pages/RegisterPet"

import ProtectedRoute from "./components/ProtectedRoute"
import PrivateLayout from "./components/PrivateLayout"

function App() {
  return (
    <Router>
      <Routes>

        { /* Ruta pública */ }
        <Route path="/login" element={<Login />} />

        { /* Rutas privadas */ }

        <Route element={
          <ProtectedRoute>
              <PrivateLayout/>
          </ProtectedRoute> } >

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/register-user" element={<RegisterUser />} />
          <Route path="/register-vet" element={<RegisterVet />} />
          <Route path="/register-pet" element={<RegisterPet/>} />

        </Route>

      </Routes>
    </Router>
  );
}

export default App;
