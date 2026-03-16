import { useState } from "react";
import api from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

function RegisterVet() {
    const [formData, setFormData] = useState({firstName: "", lastName: "", dni: "", email: "", password: "",
        licenseNumber: "", specialty: "", acceptsConsultations: false, phone: "",
        photoUrl: "", workSchedule: {start: "", end: ""}, role: "VET"})
    const [error, setError] = useState({});
    const [success, setSuccess] = useState("");
    const navigate = useNavigate()
    const token = localStorage.getItem("token");

    // validaciones de front
    const validate = () => {
        let newErrors = {}; // guardamos errores, luego los transferimos a setError
        if(!formData.firstName) {newErrors.firstName = "Ingrese un nombre"};
        if(!formData.lastName) {newErrors.lastName = "Ingrese un apellido"};
        if(!formData.dni) {newErrors.dni = "Ingrese un DNI válido"};
        if(!formData.email) {newErrors.email = "Ingrese un email"};
        if(!formData.password) {newErrors.password = "Ingrese una contraseña"};
        if(!formData.licenseNumber) {newErrors.licenseNumber = "Ingrese número de licencia"};
        if(!formData.specialty) {newErrors.specialty = "Seleccione una especialidad"};
        if (!formData.workSchedule.start || !formData.workSchedule.end) {newErrors.workSchedule = "Ingrese horario de atención";}
        if(formData.password.length < 6) {newErrors.password = "La contraseña debe tener al menos 6 caracteres"}
        if(formData.dni.length < 8) {newErrors.dni = "Ingrese un DNI válido"}
        if(formData.dni.length > 8) {newErrors.dni = "Ingrese un DNI válido"}

        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // actualizar datos en el input, ademas de bloquear el n° de tel. si no acepta consultas
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
        const data = new FormData();

        if(validate()){
            navigate("/vets")
            // toast.success("Veterinario creado con éxito")
            // console.log(formData);
        };

        data.append("firstName", formData.firstName);
        data.append("lastName", formData.lastName);
        data.append("dni", formData.dni);
        data.append("email", formData.email);
        data.append("password", formData.password);
        data.append("licenseNumber", formData.licenseNumber);
        data.append("specialty", formData.specialty);
        data.append("acceptsConsultations", formData.acceptsConsultations);
        data.append("phone", formData.phone);
        data.append("workSchedule", JSON.stringify(formData.workSchedule));

        if (formData.photo) {
            data.append("photo", formData.photo); 
        };

        try{
            await api.post("/users/vet/register", data);
            
            toast.success("Veterinario creado con éxito")

            setFormData({firstName: "", lastName: "", dni: "", email: "", password: "",
                        licenseNumber: "", specialty: "", acceptsConsultations: false, 
                        phone: "", photoUrl: "", workSchedule: {start: "", end: ""}, role: "VET"})
            setSuccess("Veterinario creado con éxito")
        }catch(err){
            console.log(err);
        }
        // navigate("/vets")
    };

    return(
        <div className="main-container">
            <h2 className="cool-h2-text">Registrar veterinario</h2>
            <div className="vets-form-dad">
                <form className="vets-form-child" onSubmit={handleSubmit}>
                    <label htmlFor="firstName" >
                        Nombre *
                        <input 
                            id="vet-input-1"
                            name="firstName" 
                            placeholder="Nombre" 
                            value={formData.firstName} 
                            onChange={handleChange} 
                        />  
                    </label>
                    {error.firstName && <p style={{color: "red"}} >{error.firstName}</p>}

                    <label htmlFor="lastName" >
                        Apellido *
                        <input 
                            id="vet-input-1"
                            name="lastName" 
                            placeholder="Apellido" 
                            value={formData.lastName} 
                            onChange={handleChange} 
                        />
                    </label>
                    {error.lastName && <p style={{color: "red"}} >{error.lastName}</p>}

                    <label htmlFor="dni" >
                        DNI *
                        <input 
                            id="vet-input-1"
                            name="dni" 
                            placeholder="DNI" 
                            value={formData.dni} 
                            onChange={handleChange} 
                        />
                    </label>
                    {error.dni && <p style={{color: "red"}} >{error.dni}</p>}

                    <label htmlFor="email" >
                        Email *
                        <input 
                            id="vet-input-1"
                            name="email" 
                            placeholder="Email" 
                            value={formData.email} 
                            onChange={handleChange} 
                        />
                    </label>

                    {error.email && <p style={{color: "red"}} >{error.email}</p>}

                    <label htmlFor="password" >
                        Contraseña *
                        <input 
                            id="vet-input-1"
                            name="password" 
                            placeholder="Contraseña" 
                            value={formData.password} 
                            onChange={handleChange} 
                        />
                    </label>

                    {error.password && <p style={{color: "red"}} >{error.password}</p>}

                    <label htmlFor="licenseNumber" >
                        Número de licencia *
                        <input 
                            id="vet-input-1"
                            name="licenseNumber" 
                            placeholder="Número de licencia" 
                            value={formData.licenseNumber} 
                            onChange={handleChange} 
                        />
                    </label>
                    
                    {error.licenseNumber && <p style={{color: "red"}} >{error.licenseNumber}</p>}

                    <label htmlFor="specialty" >
                        Especialidad
                        <select id="vet-input-3" name="specialty" value={formData.specialty} onChange={handleChange} >
                            <option value="">Seleccione especialidad</option>
                            <option value="GENERAL">General</option>
                            <option value="SURGERY">Cirugía</option>
                            <option value="DERMATOLOGY">Dermatología</option>
                            <option value="CARDIOLOGY">Cardiología</option>
                            <option value="ONCOLOGY">Oncología</option>
                        </select>
                    </label>
                    {error.specialty && <p style={{color: "red"}} >{error.specialty}</p>} 

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
                        Añadir imagen de perfil
                        <input 
                            id="vet-input-8"
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                        />
                    </label>
                    
                    <label htmlFor="workSchedule" >
                        Horario de trabajo *
                        <br />
                        <input 
                            id="vet-work-schedule-1"
                            name="start" 
                            placeholder="formato: '09:00'" 
                            value={formData.workSchedule.start} 
                            onChange={handleScheduleChange} 
                        />
                        -
                        <input 
                            id="vet-work-schedule-2"
                            name="end" 
                            placeholder="formato: '17:00'" 
                            value={formData.workSchedule.end} 
                            onChange={handleScheduleChange} 
                        />
                    </label>
                    {error.workSchedule && <p style={{color: "red"}} >{error.workSchedule}</p>}

                    <div className="center-stupid-div-again">
                        <button className="vet-btn" type="submit">Crear veterinario</button>
                        <Link to="/vets">
                            <button className="vet-btn">
                                Volver
                            </button>
                        </Link>
                    </div>
                    {success && <p style={{color: "green"}}>{success}</p>}
                </form>
            </div>
        </div>
    );
};

export default RegisterVet;