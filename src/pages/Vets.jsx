import { useState, useEffect } from "react";
import {Link, useNavigate } from "react-router-dom";
import { Stethoscope } from 'lucide-react';
import { specialtyMap } from "../utils/translation"
import { toast } from 'react-toastify';
import api from "../utils/axios";

function GetVets(){
    const [vets, setVets] = useState([]);
    const [searchVet, setSearchVet] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const filteredVets = vets.filter((vet) => {
        if (searchVet === "") return true;

        return (
            vet.firstName.toLowerCase().includes(searchVet.toLowerCase()) ||
            vet.lastName.toLowerCase().includes(searchVet.toLowerCase())
        );
    });

    const fetchVets = async () => {
        const token = localStorage.getItem("token");
        setLoading(true);

        try{
            const res = await api.get(`/users/allvets`)

            setVets(res.data.data || []);
        }catch(error){
            // console.error("Fetch error:", error);
            setError(error.message);
        }finally{
            setLoading(false);
        };
    };

    // Mostrar veterinarios
    useEffect(() => {
        fetchVets();
    }, []);

    if (error) return <p style={{ color: "red" }}>{error}</p>;

    const handleAvailability = async (vetId) => {
        navigate(`/vets/${vetId}/availability`);
    }

    const handleUpdate = async (vetId) => {
        navigate(`/update-vet/${vetId}`);
    };

    const handleDelete = async (vetId) => {
        // const confirmDelete = window.confirm("¿Seguro que querés eliminar este veterinario?");
        // if (!confirmDelete) return;

        try {
            const res = await api.delete(`/users/delete-vet/${vetId}`);
            toast.success("Veterinario eliminado")
            setVets(vets.filter(u => u._id !== vetId));
        } catch (error) {
            // console.error(error);
            setError(error.message);
        }
    };

    return(
        <div className="main-container">
            {loading && <p>Cargando veterinarios...</p>}
            <Link to="/register-vet">
                <button className="btn2">
                    Registrar Veterinario
                </button>
            </Link>
            <input
                type="search"
                className="search-bar-input"
                id="buscador"
                name="buscador"
                placeholder="Buscar por nombre o apellido"
                value={searchVet}
                onChange={(e) => setSearchVet(e.target.value)}
            />
            <h2 className="cool-h2-text"><Stethoscope size={30} /> Listado de veterinarios</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>DNI</th>
                        <th>Email</th>
                        <th>N° de licencia</th>
                        <th>Especialidad</th>
                        {/* <th>Acepta consultas</th>
                        <th>N° de teléfono</th> */}
                        <th>Horario</th>
                        <th colSpan={3}>ACCIONES</th>
                    </tr>
                </thead>

                <tbody className="table-body">
                    {filteredVets.map((a) => (
                        <tr key={a._id}>
                            <td>{a.firstName} {a.lastName}</td>
                            <td>{a.dni}</td>
                            <td>{a.email}</td>
                            <td>{a.licenseNumber}</td>
                            <td>{specialtyMap[a.specialty] || a.specialty}</td>
                            {/* <td>{a.acceptsConsultations ? "✅ Sí" : "❌ No"}</td>
                            <td>{a.phone}</td> */}
                            <td>{a.workSchedule.start} - {a.workSchedule.end}</td>
                            <td>{(<button className="btn" onClick={() => handleAvailability(a._id)}>Horarios</button>)}</td>
                            <td>{(<button className="btn" onClick={() => handleUpdate(a._id)}>Editar</button>)}</td>
                            <td>{(<button className="btn" onClick={() => handleDelete(a._id)}>Eliminar</button>)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GetVets;