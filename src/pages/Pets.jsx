import { useState, useEffect } from "react";
import {Link, useNavigate } from "react-router-dom";
import { PawPrint } from 'lucide-react';
import { speciesMap } from "../utils/translation"
import { toast } from 'react-toastify';
import { calcularEdad } from "../utils/dateUtils";
import api from "../utils/axios";

function GetPets(){
    const [pets, setPets] = useState([]);
    const [searchPet, setSearchPet] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const filteredPets = pets.filter((pet) => {
        if (searchPet === "") return true;

        return (
            pet.name.toLowerCase().includes(searchPet.toLowerCase())
        );
    });

    const fetchPets = async () => {
        const token = localStorage.getItem("token");
        setLoading(true);

        try{
            const res = await api.get(`/owner/allpets`)

        // console.log("Response:", res);
        const result = await res.json();
        // console.log("Result JSON:", result);

        setPets(result.data || []);

        }catch(error){
            // console.error("Fetch error:", error);
            setError(error.message);
        }finally{
            setLoading(false);
        };
    };

    // Mostrar mascotas
    useEffect(() => {
        fetchPets();
    }, []);

    if (error) return <p style={{ color: "red" }}>{error}</p>;

    const handleUpdate = async (petId) => {
        navigate(`/update-pet/${petId}`);
    };

    const handleDelete = async (petId) => {
        const token = localStorage.getItem("token");
        
        try{
            const res = await api.delete(`/owner/pets/${petId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Error al eliminar mascota")

            toast.success("Mascota eliminada")
            setPets(pets.filter(u => u._id !== petId));
            fetchPets();
            
        }catch(error){
            // console.error(error);
            setError(error.message);
        };
    };

    function formatearEdad(pet) {
        if (!pet.birthDate) return "—";
        const { years, months } = calcularEdad(pet.birthDate);
        let texto = "";

        if (years > 0) {
            texto = `${years} año(s)`;
            if (months > 0) texto += ` y ${months} mes(es)`;
        } else {
            texto = `${months} mes(es)`;
        };

        if (pet.isEstimated) texto += " (estimado)";

        return texto;
    };

    return(
        <div className="main-container">
            {loading && <p>Cargando mascotas...</p>}
            <Link to="/register-pet">
                <button className="btn2">
                    Registrar Mascota
                </button>
            </Link>
            <input
                type="search"
                className="search-bar-input"
                id="buscador"
                name="buscador"
                placeholder="Buscar por nombre"
                value={searchPet}
                onChange={(e) => setSearchPet(e.target.value)}
            />
            <h2 className="cool-h2-text"><PawPrint size={30} /> Listado de mascotas</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Edad</th>
                        <th>Sexo</th>
                        <th>Especie</th>
                        <th>Raza</th>
                        <th>Color</th>
                        <th>Estado de castración</th>
                        <th>Dueño</th>
                        <th colSpan={2}>ACCIONES</th>
                    </tr>
                </thead>

                <tbody className="table-body">
                    {filteredPets.map((a) => (
                        <tr key={a._id}>
                            <td>{[a.name] || "Mascota sin nombre"}</td>
                            <td>{formatearEdad(a)}</td>
                            <td>{a.sex}</td>
                            <td>{speciesMap[a.species] || a.species}</td>
                            <td>{a.breed}</td>
                            <td>{a.color}</td>
                            <td>{a.isNeutered ? "✅ Castrado/a" : "❌ No castrado/a"}</td>
                            <td>
                                {a.owner?.firstName || "Desconocido"} {a.owner?.lastName || "Desconocido"}
                            </td>
                            <td>{(<button className="btn" onClick={() => handleUpdate(a._id)}>Editar</button>)}</td>
                            <td>{(<button className="btn" onClick={() => handleDelete(a._id)}>Eliminar</button>)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GetPets;