import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';

function UpdateVet() {
  const { vetId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dni: "",
    email: "",
    password: "",
    licenseNumber: "", 
    specialty: "", 
    acceptsConsultations: false,
    phone: "",
    photoUrl: "",
    workSchedule: {start: "", end: ""}
  });

    useEffect(() => {
    fetch(`http://localhost:3000/users/get-vet/${vetId}`, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    })
        .then(res => res.json())
        .then(data => {
        const vet = data.data;

        setFormData({
            firstName: vet.firstName || "",
            lastName: vet.lastName || "",
            dni: vet.dni || "",
            email: vet.email || "",
            password: vet.password,
            licenseNumber: vet.licenseNumber || "",
            specialty: vet.specialty || "",
            acceptsConsultations: vet.acceptsConsultations ?? false,
            phone: vet.phone || "",
            photoUrl: vet.photoUrl || "",
            workSchedule: {
            start: vet.workSchedule?.start || "",
            end: vet.workSchedule?.end || "",
            },
        });
        });
    }, []);

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // parsear el horario para que se guarde correctamente
    const handleScheduleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            workSchedule: {
                ...formData.workSchedule,
                [name]: value,
            },
        });
    };

  // manejar archivo de foto, para la foto de perfil
  const handleFileChange = (e) => {
    const file = e.target.files[0];
      setFormData({
          ...formData,
          photo: file,
      });
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.put(`http://localhost:3000/users/update-vet/${vetId}`,
    formData,
    {
        headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        },
    });

    toast.success("Veterinario actualizado con éxito")
    navigate("/vets");
  };

  return (
    <div className="main-container">
        <h2 className="cool-h2-text">Editar veterinario</h2>
        <div className="vets-form-dad">
            <form className="vets-form-child" onSubmit={handleSubmit}>
            
            <label htmlFor="firstName">
                Nombre
                <input 
                    id="vet-input-1"
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleChange} 
                />
            </label>

            <label htmlFor="lastName">
                Apellido
                <input 
                    id="vet-input-1"
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange} 
                />
            </label>

            <label htmlFor="dni">
                DNI
                <input 
                    id="vet-input-1"
                    name="dni" 
                    value={formData.dni} 
                    onChange={handleChange} 
                />
            </label>
            
            <label htmlFor="email">
                Email
                <input 
                    id="vet-input-1"
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                />
            </label>

            <label htmlFor="password">
                Contraseña
                <input 
                    id="vet-input-1"
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                />
            </label>

            <label htmlFor="licenseNumber">
                Número de licencia
                <input 
                    id="vet-input-1"
                    name="licenseNumber" 
                    value={formData.licenseNumber} 
                    onChange={handleChange} 
                />
            </label>

            <label htmlFor="specialty" >
                Especialidad
                    <select id="vet-input-3" name="specialty" value={formData.specialty} onChange={handleChange} >
                        <option value="">Seleccione especialidad</option>
                        <option value="GENERAL">General</option>
                        <option value="SURGERY">Cirugía</option>
                        <option value="DERMATOLOGY">Dermatología</option>
                        <option value="CARDIOLOGY">Cardiología</option>
                        <option value="TRAUMATOLOGY">Traumatología</option>
                    </select>
                </label>

                <label htmlFor="acceptsConsultations">
                    Acepta consultas:
                        <input 
                            type="checkbox" 
                            id="consultations" 
                            name="acceptsConsultations" 
                            checked={formData.acceptsConsultations} 
                            onChange={handleChange} 
                        />
                </label>

                <label htmlFor="phone" >
                    Número de celular
                        <input
                            id="phone" 
                            name="phone" 
                            placeholder="Número de celular" 
                            value={formData.phone} 
                            onChange={handleChange} 
                            disabled={!formData.acceptsConsultations} 
                        />
                </label>

                <label htmlFor="photoUrl" >
                    Cambiar imagen de perfil
                        <input 
                            id="vet-input-8"
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                        />
                </label>

                <label htmlFor="workSchedule" >
                    Horario de trabajo *
                        <input 
                            id="vet-work-schedule-1"
                            name="start" 
                            placeholder="formato: '09:00'" 
                            value={formData.workSchedule?.start || ""}
                            onChange={handleScheduleChange} 
                        />-
                        <input 
                            id="vet-work-schedule-2"
                            name="end" 
                            placeholder="formato: '17:00'" 
                            value={formData.workSchedule?.end || ""}
                            onChange={handleScheduleChange} 
                        />
                    </label>
                <div className="center-stupid-div-again">
                    <button className="vet-btn" type="submit">Guardar cambios</button>
                    <Link to="/vets">
                        <button className="vet-btn">
                            Volver
                        </button>
                    </Link> 
                </div>
            </form>
        </div>
    </div>
  );
}

export default UpdateVet;
