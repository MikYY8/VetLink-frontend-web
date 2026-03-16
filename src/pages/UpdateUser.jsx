import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/axios";
import { toast } from 'react-toastify';

function UpdateUser() {
  const { ownerId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [error, setError] = useState({});
  const [success, setSuccess] = useState("");

    const validate = () => {
        let newErrors = {}; // guardamos errores, luego los transferimos a setError
        if(!formData.firstName) {newErrors.firstName = "Ingrese un nombre"};
        if(!formData.lastName) {newErrors.lastName = "Ingrese un apellido"};
        if(!formData.dni) {newErrors.dni = "Ingrese un DNI válido"};
        if(!formData.email) {newErrors.email = "Ingrese un email válido"};
        // if(!formData.password) {newErrors.password = "Ingrese una contraseña"};
        // if(formData.password.length < 6) {newErrors.password = "La contraseña debe tener al menos 6 caracteres"}
        // if(role === "SECRETARY" && formData.role === "ADMIN") {
        //   newErrors.role = "Secretaría no puede crear nuevos administradores";
        // } 
        
        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    };


  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dni: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    api.get(`/users/get-user/${ownerId}`)
      .then(res => res.json())
      .then(data => setFormData(data.data));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(validate()){
      toast.success("Usuario actualizado con éxito")
      navigate("/users")
      // console.log(formData)
    };

    await api.put(`/users/update-user/${ownerId}`, formData);
  };

  return (
    <div className="main-container">
      <h2 className="cool-h2-text">Editar usuario</h2>
      <div className="users-form-dad">
        <form className="users-form-child" onSubmit={handleSubmit}>
          <label htmlFor="firstName">
            Nombre
            <input 
              id="user-input-1"
              name="firstName" 
              value={formData.firstName} 
              onChange={handleChange} 
            />
          </label>

          {error.firstName && <p style={{color: "red"}} >{error.firstName}</p>}

          <label htmlFor="lastName">
            Apellido
            <input 
              id="user-input-2"
              name="lastName" 
              value={formData.lastName} 
              onChange={handleChange} 
            />
          </label>

          {error.lastName && <p style={{color: "red"}} >{error.lastName}</p>}

          <label htmlFor="dni">
            DNI
            <input 
              id="user-input-2"
              name="dni" 
              value={formData.dni} 
              onChange={handleChange} 
            />
          </label>

          {error.dni && <p style={{color: "red"}} >{error.dni}</p>}
          
          <label htmlFor="email">
            Email
            <input 
              id="user-input-3"
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
            />
          </label>

          {error.email && <p style={{color: "red"}} >{error.email}</p>}

          <label htmlFor="password">
            Contraseña
            <input 
              id="user-input-4"
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
            />
          </label>
          <div className="center-stupid-div-again">
            <button className="user-btn" type="submit">Guardar cambios</button>
            <Link to="/users">
              <button className="user-btn" >
                Volver
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateUser;
