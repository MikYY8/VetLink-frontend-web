import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';

function UpdateUser() {
  const { ownerId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    fetch(`http://localhost:3000/users/get-user/${ownerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setFormData(data.data));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.put(`http://localhost:3000/users/update-user/${ownerId}`,
    formData,
    {
        headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        },
    }
    );

    toast.success("Usuario actualizado con éxito")
    navigate("/users");
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

          <label htmlFor="lastName">
            Apellido
            <input 
              id="user-input-2"
              name="lastName" 
              value={formData.lastName} 
              onChange={handleChange} 
            />
          </label>
          
          <label htmlFor="email">
            Email
            <input 
              id="user-input-3"
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
            />
          </label>

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
