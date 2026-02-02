import { Link, useNavigate } from "react-router-dom";
import { CircleUserRound } from "lucide-react"

function Navbar() {

  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");

  const handleLogout = () => {    // que sucede en el logout? eliminamos:
    localStorage.removeItem("token");   // el token, el rol, y el mail
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    navigate("/login")      // y te manda al login
  };

  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      
      <Link to="/dashboard" style={{ marginRight: "10px" }}>
        Dashboard
      </Link>

      <Link to="/appointments" style={{ marginRight: "10px" }}>
        Turnos
      </Link>

      <span style={{ marginLeft: "20px" }}>
        {email && <><CircleUserRound size={18} className="inline-block mr-1"/> {email} ({role})</>}
      </span>

      <button
        onClick={handleLogout}
        style={{ marginLeft: "20px" }}      
      >Logout</button>

    </nav>
  );
};

export default Navbar;
