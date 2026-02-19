import { useState, useEffect } from "react";
import {Link, useNavigate } from "react-router-dom";
import { Stethoscope } from 'lucide-react';

function GetVets(){
    const [vets, setVets] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchVets = async () => {
        const token = localStorage.getItem("token");
        if(loading) <p>Cargando veterinarios...</p>;

        try{
            const res = await fetch(`http://localhost:3000/users/allvets`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

        console.log("Response:", res);
        const result = await res.json();
        console.log("Result JSON:", result);

        setVets(result.data || []);

        }catch(error){
            console.error("Fetch error:", error);
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

    const handleUpdate = async (vetId) => {
        navigate(`/update-vet/${vetId}`);
    };

    const handleDelete = async (vetId) => {
        const confirmDelete = window.confirm("¿Seguro que querés eliminar este veterinario?");
        if (!confirmDelete) return;
        const token = localStorage.getItem("token");

        try {
            await fetch(`http://localhost:3000/users/delete-vet/${vetId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });

            alert("Veterinario eliminado");

            // refrescar lista
            setVets(vets.filter(u => u._id !== vetId));

        } catch (error) {
            console.error(error);
        }
    };


    return(
        <div className="main-container">
            <Link to="/register-vet">
                <button className="btn">
                    Registrar Veterinario
                </button>
            </Link>
            <h2 className="dashboard-text"><Stethoscope size={30} /> Listado de veterinarios</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>N° de licencia</th>
                        <th>Especialidad</th>
                        <th>Acepta consultas</th>
                        <th>N° de teléfono</th>
                        <th>Horario</th>
                        <th colSpan={2}>ACCIONES</th>
                    </tr>
                </thead>

                <tbody>
                    {vets.map((a) => (
                        <tr key={a._id}>
                            <td style={{ cursor:"pointer", color:"var(--text)", textDecoration:"underline" }} onClick={() => navigate(`/vets/${a._id}/availability`)} >{a.firstName} {a.lastName}</td>
                            <td>{a.email}</td>
                            <td>{a.licenseNumber}</td>
                            <td>{a.specialty}</td>
                            <td>{a.acceptsConsultations ? "✅ Sí" : "❌ No"}</td>
                            <td>{a.phone}</td>
                            <td>{a.workSchedule.start} - {a.workSchedule.end}</td>
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