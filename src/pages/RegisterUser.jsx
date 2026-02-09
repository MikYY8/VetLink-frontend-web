import { useState } from "react";
import axios from "axios";

function RegisterUser() {
  const [formData, setFormData] = useState({firstName: "", lastName: "", email: "", password: "", role: "OWNER", });
  const [error, setError] = useState({});
  const token = localStorage.getItem("token");

    const validate = () => {
        let newErrors = {}; // store errors, then we transfer to setError
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
  };

  return (
    <div>
      <h2>Registrar usuario</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="firstName"
          placeholder="Nombre"
          value={formData.firstName}
          onChange={handleChange}
        />
        {error.firstName && <p style={{color: "red"}} >{error.firstName}</p>}

        <input
          name="lastName"
          placeholder="Apellido"
          value={formData.lastName}
          onChange={handleChange}
        />
        {error.lastName && <p style={{color: "red"}} >{error.lastName}</p>}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        {error.email && <p style={{color: "red"}} >{error.email}</p>}

        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
        />
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
