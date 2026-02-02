import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <Link to="/dashboard" style={{ marginRight: "10px" }}>
        Dashboard
      </Link>

      <Link to="/appointments" style={{ marginRight: "10px" }}>
        Turnos
      </Link>

      <Link to="/login">
        Logout
      </Link>
    </nav>
  );
}

export default Navbar;
