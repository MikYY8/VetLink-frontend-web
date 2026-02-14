import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function RegisterVet() {
    const [formData, setFormData] = useState({firstName: "", lastName: "", email: "", password: "",
        licenseNumber: "", specialty: "", acceptsConsultations: false, phone: "",
        photoUrl: "", workSchedule: {start: "", end: ""}, role: "VET"})
    const [error, setError] = useState({});
    const [success, setSuccess] = useState("");
    const token = localStorage.getItem("token");

    // validaciones de front
    const validate = () => {
        let newErrors = {}; // guardamos errores, luego los transferimos a setError
        if(!formData.firstName) {newErrors.firstName = "Ingrese un nombre"};
        if(!formData.lastName) {newErrors.lastName = "Ingrese un nombre"};
        if(!formData.email) {newErrors.email = "Ingrese un email"};
        if(!formData.password) {newErrors.password = "Ingrese una contraseña"};
        if(!formData.licenseNumber) {newErrors.licenseNumber = "Ingrese número de licencia"};
        if(!formData.specialty) {newErrors.specialty = "Seleccione una especialidad"};
        if (!formData.workSchedule.start || !formData.workSchedule.end) {newErrors.workSchedule = "Ingrese horario de atención";}
        if(formData.password.length < 6) {newErrors.password = "La contraseña debe tener al menos 6 caracteres"}

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
            console.log(formData);
        };

        data.append("firstName", formData.firstName);
        data.append("lastName", formData.lastName);
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
            await axios.post("http://localhost:3000/users/vet/register",
            data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setFormData({firstName: "", lastName: "", email: "", password: "",
                        licenseNumber: "", specialty: "", acceptsConsultations: false, 
                        phone: "", photoUrl: "", workSchedule: {start: "", end: ""}, role: "VET"})
            setSuccess("Veterinario creado con éxito")
        }catch(err){
            console.log(err);
        }
    };

    return(
        <div>
            <h2>Registrar veterinario</h2>

            <form onSubmit={handleSubmit}>
                <label htmlFor="firstName" >
                    Nombre *
                    <input 
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
                        name="lastName" 
                        placeholder="Apellido" 
                        value={formData.lastName} 
                        onChange={handleChange} 
                    />
                </label>
                {error.lastName && <p style={{color: "red"}} >{error.lastName}</p>}

                <label htmlFor="email" >
                    Email *
                    <input 
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
                    name="licenseNumber" 
                    placeholder="Número de licencia" 
                    value={formData.licenseNumber} 
                    onChange={handleChange} 
                />
                </label>
                {error.licenseNumber && <p style={{color: "red"}} >{error.licenseNumber}</p>}

                <label htmlFor="specialty" >
                    Especialidad
                    <select name="specialty" value={formData.specialty} onChange={handleChange} >
                        <option value="">Seleccione especialidad</option>
                        <option value="GENERAL">General</option>
                        <option value="SURGERY">Cirugía</option>
                        <option value="DERMATOLOGY">Dermatología</option>
                        <option value="CARDIOLOGY">Cardiología</option>
                        <option value="TRAUMATOLOGY">Traumatología</option>
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
                {/* {error.acceptsConsultations && <p style={{color: "red"}} >{error.acceptsConsultations}</p>} */}

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
                {/* {error.phone && <p style={{color: "red"}} >{error.phone}</p>} */}

                <label htmlFor="photoUrl" >
                    Añadir imagen de perfil
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                    />
                </label>
                {/* {error.photoUrl && <p style={{color: "red"}} >{error.photoUrl}</p>} */}
                 
                <label htmlFor="workSchedule" >
                    Horario de trabajo *
                    <input 
                        name="start" 
                        placeholder="formato: '09:00'" 
                        value={formData.workSchedule.start} 
                        onChange={handleScheduleChange} 
                    />
                    <input 
                        name="end" 
                        placeholder="formato: '17:00'" 
                        value={formData.workSchedule.end} 
                        onChange={handleScheduleChange} 
                    />
                </label>
                {error.workSchedule && <p style={{color: "red"}} >{error.workSchedule}</p>}

                <button type="submit">Crear veterinario</button>

                <Link to="/vets"><button>
                Volver
                </button>
                </Link>
                {success && <p style={{color: "green"}}>{success}</p>}
            </form>
        </div>
    );
};

export default RegisterVet;