import { Link, useNavigate } from "react-router-dom";
import { CircleUserRound } from "lucide-react"
import { rolesMap } from "../utils/translation";
import '../styles/main.css'
import logo from "../assets/logo-vetlink.png";


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
      <img className="logo-vetlink" src={logo} alt="logo" />
      
      <div className="navbar-right">
        <Link to="/dashboard">
          <button className="btn-nvb">
            Turnos
          </button>
        </Link>

        <Link to="/create-appointment">
          <button className="btn-nvb">
            Agendar turno
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

        <span className="user-info">
          <CircleUserRound />
          {email} ({rolesMap[role]})
          {/* {email} ({role}) */}
        </span>

        <button 
          className="btn-nvb"
          onClick={handleLogout}
          style={{ marginLeft: "20px" }}      
        >Salir</button>

      </div>
    </nav>
  );
};

export default Navbar;
