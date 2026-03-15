import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import GoToLogin from "../src/pages/MainPage"
import Login from "../src/pages/Login";
import Dashboard from "../src/pages/Dashboard"
import CreateAppointment from "../src/pages/CreateAppointment"

import GetUsers from "./pages/Users"
import GetVets from "./pages/Vets"
import GetPets from "./pages/Pets"

import RegisterUser from "./pages/RegisterUser";
import RegisterVet from "./pages/RegisterVet";
import RegisterPet from "./pages/RegisterPet"

import UpdateUser from "./pages/UpdateUser"
import UpdateVet from "./pages/UpdateVet"
import UpdatePet from "./pages/UpdatePet"

import VetAvailability from "./pages/AvailabilityTable";

import UnauthorizedAccess from "./pages/UnauthorizedAccess"
import PageNotFound from "./pages/PageNotFound";

import ProtectedRoute from "./components/ProtectedRoute"
import PrivateLayout from "./components/PrivateLayout"

function App() {
  return (
    <Router>
      <Routes>

        { /* Ruta pública */ }
        <Route path="/" element={<Login />} />

        { /* Rutas privadas */ }

        <Route element={
          <ProtectedRoute>
              <PrivateLayout/>
          </ProtectedRoute> } >

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-appointment" element={<CreateAppointment />} />

          <Route path="/users" element={<GetUsers/>} /> 
          <Route path="/vets" element={<GetVets/>} />
          <Route path="/pets" element={<GetPets/>} />

          <Route path="/register-user" element={<RegisterUser />} />
          <Route path="/register-vet" element={<RegisterVet />} />
          <Route path="/register-pet" element={<RegisterPet/>} />

          <Route path="/update-user/:ownerId" element={<UpdateUser />} />
          <Route path="/update-vet/:vetId" element={<UpdateVet />} />
          <Route path="/update-pet/:petId" element={<UpdatePet />} />

          <Route path="/vets/:vetId/availability" element={<VetAvailability />} />
          
          <Route path="*" element={<PageNotFound />} />

        </Route>

      </Routes>
    </Router>
  );
}

export default App;
