import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/axios";
import { toast } from 'react-toastify';

function UpdateVet() {
    const { vetId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [error, setError] = useState({});
    const [success, setSuccess] = useState("");

    // validaciones de front
    const validate = () => {
        let newErrors = {}; // guardamos errores, luego los transferimos a setError
        if(!formData.firstName) {newErrors.firstName = "Ingrese un nombre"};
        if(!formData.lastName) {newErrors.lastName = "Ingrese un apellido"};
        if(!formData.dni) {newErrors.dni = "Ingrese un DNI válido"};
        if(!formData.email) {newErrors.email = "Ingrese un email"};
        // if(!formData.password) {newErrors.password = "Ingrese una contraseña"};
        if(!formData.licenseNumber) {newErrors.licenseNumber = "Ingrese número de licencia"};
        if(!formData.specialty) {newErrors.specialty = "Seleccione una especialidad"};
        if (!formData.workSchedule.start || !formData.workSchedule.end) {newErrors.workSchedule = "Ingrese horario de atención";}
        // if(formData.password.length < 6) {newErrors.password = "La contraseña debe tener al menos 6 caracteres"}
        if(formData.dni.length < 8) {newErrors.dni = "Ingrese un DNI válido"}
        if(formData.dni.length > 8) {newErrors.dni = "Ingrese un DNI válido"}

        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    };

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

    // useEffect(() => { api.get(`/users/get-vet/${vetId}`)
    //     .then(res => res.json())
    //     .then(data => {
    //     const vet = data.data;

    //     setFormData({
    //         firstName: vet.firstName || "",
    //         lastName: vet.lastName || "",
    //         dni: vet.dni || "",
    //         email: vet.email || "",
    //         password: vet.password,
    //         licenseNumber: vet.licenseNumber || "",
    //         specialty: vet.specialty || "",
    //         acceptsConsultations: vet.acceptsConsultations ?? false,
    //         phone: vet.phone || "",
    //         photoUrl: vet.photoUrl || "",
    //         workSchedule: {
    //         start: vet.workSchedule?.start || "",
    //         end: vet.workSchedule?.end || "",
    //         },
    //     });
    //     });
    // }, []);

    useEffect(() => {
        const fetchVet = async () => {
            try {
                const res = await api.get(`/users/get-vet/${vetId}`);
                const vet = res.data.data;

                setFormData({
                    firstName: vet.firstName || "",
                    lastName: vet.lastName || "",
                    dni: vet.dni || "",
                    email: vet.email || "",
                    password: "",
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

            } catch (err) {
                console.error(err);
            }
        };

        fetchVet();
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
    if(validate()){
        navigate("/vets")
        // toast.success("Veterinario creado con éxito")
         // console.log(formData);
        toast.success("Veterinario actualizado con éxito")
        setSuccess("Veterinario creado con éxito")
    };

    await api.put(`/users/update-vet/${vetId}`, formData);
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

            {error.firstName && <p style={{color: "red"}} >{error.firstName}</p>}

            <label htmlFor="lastName">
                Apellido
                <input 
                    id="vet-input-1"
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange} 
                />
            </label>

            {error.lastName && <p style={{color: "red"}} >{error.lastName}</p>}

            <label htmlFor="dni">
                DNI
                <input 
                    id="vet-input-1"
                    name="dni" 
                    value={formData.dni} 
                    onChange={handleChange} 
                />
            </label>

            {error.dni && <p style={{color: "red"}} >{error.dni}</p>}
            
            <label htmlFor="email">
                Email
                <input 
                    id="vet-input-1"
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                />
            </label>

            {error.email && <p style={{color: "red"}} >{error.email}</p>}

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

            {error.licenseNumber && <p style={{color: "red"}} >{error.licenseNumber}</p>}

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

                    {error.workSchedule && <p style={{color: "red"}} >{error.workSchedule}</p>}

                <div className="center-stupid-div-again">
                    <button className="vet-btn" type="submit">Guardar cambios</button>
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
}

export default UpdateVet;
