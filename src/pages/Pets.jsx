import { useState, useEffect } from "react";
import {Link } from "react-router-dom";
import axios from "axios";

function GetPets(){
    const [pets, setPets] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchPets = async () => {
        const token = localStorage.getItem("token");
        if(loading) <p>Cargando mascotas...</p>;

        try{
            const res = await fetch(`http://localhost:3000/owner/allpets`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

        console.log("Response:", res);
        const result = await res.json();
        console.log("Result JSON:", result);

        setPets(result.data || []);

        }catch(error){
            console.error("Fetch error:", error);
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


    const handleUpdate = async () => {
        const token = localStorage.getItem("token");

        try{
            await fetch(`http://localhost:3000/owner/pets/${petId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
        }catch(error){
            console.error(error);
        };
    };

    const handleDelete = async () => {
        const token = localStorage.getItem("token");
        
        try{
            await fetch(`http://localhost:3000/owner/pets/${petId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
        }catch(error){
            console.error(error);
        }
    };

    return(
        <div>
            <Link to="/register-pet"><button>
              Registrar mascota
            </button>
            </Link>
            <h2>Listado de mascotas</h2>
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
                        <th>ACCIONES</th>
                    </tr>
                </thead>

                <tbody>
                    {pets.map((a) => (
                        <tr key={a._id}>
                            <td>{a.name}</td>
                            <td>{a.age}</td>
                            <td>{a.sex}</td>
                            <td>{a.species}</td>
                            <td>{a.breed}</td>
                            <td>{a.color}</td>
                            <td>{a.isNeutered ? "✅ Castrado/a" : "❌ No castrado/a"}</td>
                            <td>{a.owner.firstName} {a.owner.lastName}</td>
                            <td>{(<button onClick={() => handleUpdate(a._id)}>Editar</button>)}</td>
                            <td>{(<button onClick={() => handleDelete(a._id)}>Eliminar</button>)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GetPets;