import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      const res = await axios.post("http://localhost:3000/users/login", {email, password});
      const token = res.data.data.accesstoken;

      // guardar token
      localStorage.setItem("token", token);
      console.log("TOKEN GUARDADO:", token);
      
      // redirigir
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


