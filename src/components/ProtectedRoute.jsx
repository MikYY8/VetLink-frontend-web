// Rutas protegidas
// Lee el token de localStorage
//  No hay token -> redirige a /login
//  Hay token -> muestra la página

import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" replace />;

  return children;
}

export default ProtectedRoute;
