import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "../src/pages/Login";
import Dashboard from "../src/pages/Dashboard"
import Appointments from "../src/pages/Appointments";
import Navbar from "../src/components/Navbar";

import ProtectedRoute from "./components/ProtectedRoute"
import PrivateLayout from "./components/PrivateLayout"

function App() {
  return (
    <Router>
      <Navbar/>
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

        </Route>

      </Routes>
    </Router>
  );
}

export default App;
