import { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

function RegisterUser() {
  const [formData, setFormData] = useState({firstName: "", lastName: "", email: "", password: "", role: "OWNER", });
  const [error, setError] = useState({});
  const navigate = useNavigate()
  const token = localStorage.getItem("token");

    const validate = () => {
        let newErrors = {}; // guardamos errores, luego los transferimos a setError
        if(!formData.firstName) {newErrors.firstName = "Ingrese un nombre"};
        if(!formData.lastName) {newErrors.lastName = "Ingrese un nombre"};
        if(!formData.email) {newErrors.email = "Ingrese un email válido"};
        if(!formData.password) {newErrors.password = "Ingrese una contraseña"};
        if(formData.password.length < 6) {newErrors.password = "La contraseña debe tener al menos 6 caracteres"}
        
        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    };

  // Manejar cambios en el form (?)
  const handleChange = (e) => {
    setFormData({
      ...formData, [e.target.name]: e.target.value
    });
  };

    // Enviar datos al back
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(validate()){
        alert("Usuario creado con éxito")
        console.log(formData)
    };

    try{
      await axios.post("http://localhost:3000/users/register",
        formData, {
            headers: {
                Authorization: `Bearer ${token}`,
          },
        });

      setFormData({firstName: "", lastName: "", email: "", password: "", role: "OWNER"});
    }catch(err){
        console.log(err)
    };
    navigate("/users");
  };

  return (
    <div>
      <h2>Registrar usuario</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="firstName" >
          Nombre
          <input
            name="firstName"
            placeholder="Nombre"
            value={formData.firstName}
            onChange={handleChange}
          />
        </label>
        {error.firstName && <p style={{color: "red"}} >{error.firstName}</p>}

        <label htmlFor="lastName" >
          Apellido
          <input
            name="lastName"
            placeholder="Apellido"
            value={formData.lastName}
            onChange={handleChange}
          />
        </label>
        
        {error.lastName && <p style={{color: "red"}} >{error.lastName}</p>}

        <label htmlFor="email" >
          Email
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>

        {error.email && <p style={{color: "red"}} >{error.email}</p>}

        <label htmlFor="password" >
          Contraseña 
          <input
              name="password"
              type="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
            />
        </label>
        
        {error.password && <p style={{color: "red"}} >{error.password}</p>}

        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="OWNER">Dueño</option>
          <option value="SECRETARY">Secretaría</option>
          <option value="ADMIN">Administrador</option>
        </select>

        <button type="submit">Crear usuario</button>
      </form>

    </div>
  );
};

export default RegisterUser;
