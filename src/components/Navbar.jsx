import { Link, useNavigate } from "react-router-dom";
import { CircleUserRound } from "lucide-react"
import '../styles/main.css'

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
    <nav className="navbar">
      
      <Link to="/dashboard">
        <button className="btn-nvb">
          Dashboard
        </button>
      </Link>

      <Link to="/create-appointment">
        <button className="btn-nvb">
          Turnos
        </button>
      </Link>

      <Link to="/users">
        <button className="btn-nvb">
          Usuarios
        </button>
      </Link>

      <Link to="/vets">
        <button className="btn-nvb">
          Veterinarios
        </button>
      </Link>

      <Link to="/pets">
        <button className="btn-nvb">
          Mascotas
        </button>
      </Link>

      <span>
        {email && 
          <>
            <CircleUserRound size={26} />
            {email} ({role})
          </>
        }
      </span>

      <button 
        className="btn-nvb"
        onClick={handleLogout}
        style={{ marginLeft: "20px" }}      
      >Logout</button>

    </nav>
  );
};

export default Navbar;
