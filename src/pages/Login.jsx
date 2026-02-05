import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      const res = await axios.post("http://localhost:3000/users/login", {email, password});
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
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <br/>

        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />

        <br/>

        <button type="submit">Ingresar</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Login;


