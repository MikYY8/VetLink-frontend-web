import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

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

    alert("Usuario actualizado");
    navigate("/users");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Editar usuario</h2>
      <label htmlFor="firstName">
        Nombre
        <input name="firstName" value={formData.firstName} onChange={handleChange} />
      </label>

      <label htmlFor="lastName">
        Apellido
        <input name="lastName" value={formData.lastName} onChange={handleChange} />
      </label>
      
      <label htmlFor="email">
        Email
        <input name="email" value={formData.email} onChange={handleChange} />
      </label>

      <label htmlFor="password">
        Contraseña
        <input name="password" value={formData.password} onChange={handleChange} />
      </label>
      
      <button type="submit">Guardar cambios</button>

      <Link to="/users"><button>
        Volver
        </button>
      </Link>
    </form>
  );
}

export default UpdateUser;
