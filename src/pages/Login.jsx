import { useState } from "react";
import api from "../utils/axios";
import { jwtDecode } from "jwt-decode";
import { PawPrint } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      const res = await api.post("/users/login", {email, password});
      const token = res.data.data.accesstoken;
      const decoded = jwtDecode(token)

      // guardar token
      localStorage.setItem("token", token);
      localStorage.setItem("role", decoded.role);
      localStorage.setItem("email", decoded.email);
      console.log("TOKEN GUARDADO:", token);
      
      // redirigir a dashboard al loguearse
      window.location.href = "/dashboard";
    }catch(err){
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="login-container">
      <div className="login-container-child">
        <h2 className="login-text"><PawPrint size={30} />Iniciar sesión</h2>
        <hr className="white-bar" />

        <form onSubmit={handleSubmit}>
          <input className="input-login" type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} />
          <br/>
          <input className="input-login" type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
          <br/>
          <button className="btn-submit" type="submit">Ingresar</button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

export default Login;


