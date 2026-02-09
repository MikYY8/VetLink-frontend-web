import { useState } from "react";
import axios from "axios";

function RegisterVet() {
    const [formData, setFormData] = useState({firstName: "", lastName: "", email: "", password: "", licenseNumber: "", specialty: "", acceptsConsultations: false, phone: "", photoUrl: "", workSchedule: {start: "", end: ""}, role: "VET"})
    const [error, setError] = useState({});
    const token = localStorage.getItem("token");

    const validate = () => {
        let newErrors = {};
        // lista de ifs con errores

        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.name] : e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefautl();
        if(validate){
            alert("Veterinario creado con éxito");
            console.log(formData);
        };

        try{
            await axios.post("http://localhost:3000/users/vet/register",
            formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setFormData({firstName: "", lastName: "", email: "", password: "", licenseNumber: "", specialty: "", acceptsConsultations: false, phone: "", photoUrl: "", workSchedule: {start: "", end: ""}, role: "VET"})
        }catch(err){
            console.log(err);
        }
    };

    return(
        <div>
            <h2>Registrar veterinario</h2>

            <form onSubmit={handleSubmit}>
                <input name="firstName" placeholder="Nombre" value={formData.firstName} onChange={handleChange} />
                    {error.firstName && <p style={{color: "red"}} >{error.firstName}</p>}

                <input name="lastName" placeholder="Apellido" value={formData.lastName} onChange={handleChange} />

                <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />

                <input name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} />

                <input name="licenseNumber" placeholder="Número de licencia" value={formData.licenseNumber} onChange={handleChange} />

                <select name="specialty" value={formData.specialty} onChange={handleChange} >
                    <option value="GENERAL">General</option>
                    <option value="SURGERY">Cirugía</option>
                    <option value="DERMATOLOGY">Dermatología</option>
                    <option value="CARDIOLOGY">Cardiología</option>
                    <option value="TRAUMATOLOGY">Traumatología</option>
                </select>

                <input type="checkbox" name="acceptsConsultations" value={formData.acceptsConsultations} onChange={handleChange} />

                <input name="phone" placeholder="Número de teléfono" value={formData.phone} onChange={handleChange} />

                {/* <input name="photoUrl"  /> */}

                <input name="workSchedule" />

            </form>






        </div>


    );
};

export default RegisterVet;