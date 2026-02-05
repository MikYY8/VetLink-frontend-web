// Este componente privatiza el layout, 
// para que no figure el Navbar en el login

import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function PrivateLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default PrivateLayout;
