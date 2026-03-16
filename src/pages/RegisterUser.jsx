import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

function RegisterUser() {
  const [formData, setFormData] = useState({firstName: "", lastName: "", dni: "", email: "", password: "", role: "OWNER", });
  const [error, setError] = useState({});
  const navigate = useNavigate()
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

    const validate = () => {
        let newErrors = {}; // guardamos errores, luego los transferimos a setError
        if(!formData.firstName) {newErrors.firstName = "Ingrese un nombre"};
        if(!formData.lastName) {newErrors.lastName = "Ingrese un apellido"};
        if(!formData.dni) {newErrors.dni = "Ingrese un DNI válido"};
        if(!formData.email) {newErrors.email = "Ingrese un email válido"};
        if(!formData.password) {newErrors.password = "Ingrese una contraseña"};
        if(formData.password.length < 6) {newErrors.password = "La contraseña debe tener al menos 6 caracteres"}
        if(role === "SECRETARY" && formData.role === "ADMIN") {
          newErrors.role = "Secretaría no puede crear nuevos administradores";
        } 
        
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
        // toast.success("Usuario creado con éxito")
        navigate("/users")
        // console.log(formData)
    };

    try{
      await axios.post("http://localhost:3000/users/register",
        formData, {
            headers: {
                Authorization: `Bearer ${token}`,
          },
        });

      toast.success("Usuario creado con éxito")
      setFormData({firstName: "", lastName: "", dni: "", email: "", password: "", role: "OWNER"});
    }catch(err){
        console.log(err)
    };
    // navigate("/users")

  };

  return (
    <div className="main-container">
      <h2 className="cool-h2-text">Registrar usuario</h2>
        <div className="users-form-dad">
        <form className="users-form-child" onSubmit={handleSubmit}>
          <label htmlFor="firstName" >
            Nombre
            <input
              id="user-input-1"
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
              id="user-input-2"
              name="lastName"
              placeholder="Apellido"
              value={formData.lastName}
              onChange={handleChange}
            />
          </label>
          
          {error.lastName && <p style={{color: "red"}} >{error.lastName}</p>}

          <label htmlFor="dni" >
            DNI
            <input
              id="user-input-2"
              name="dni"
              placeholder="DNI"
              value={formData.dni}
              onChange={handleChange}
            />
          </label>
          
          {error.dni && <p style={{color: "red"}} >{error.dni}</p>}

          <label htmlFor="email" >
            Email
            <input
              id="user-input-3"
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
                id="user-input-4"
                name="password"
                type="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
              />
          </label>
          
          {error.password && <p style={{color: "red"}} >{error.password}</p>}

          <label>Rol
            <select id="user-input-5" name="role" value={formData.role} onChange={handleChange}>
              <option value="OWNER">Dueño</option>
              <option value="SECRETARY">Secretaría</option>
              <option value="ADMIN" disabled={role === "SECRETARY"}>Administrador (solo admin)</option>
            </select>
          </label>

          {error.role && <p style={{color: "red"}} >{error.role}</p>}

          <div className="center-stupid-div-again">
            <button className="user-btn" type="submit">Crear usuario</button>
            <Link to="/users"> 
              <button className="user-btn">
                Volver
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;
