import { useState, useEffect } from "react";
import {Link } from "react-router-dom";
import axios from "axios";

function GetUsers(){
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        const token = localStorage.getItem("token");
        if(loading) <p>Cargando usuarios...</p>;

        try{
            const res = await fetch(`http://localhost:3000/users/allusers`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

        console.log("Response:", res);
        const result = await res.json();
        console.log("Result JSON:", result);

        setUsers(result.data || []);

        }catch(error){
            console.error("Fetch error:", error);
            setError(error.message);
        }finally{
            setLoading(false);
        };
    };

  // Mostrar usuarios
  useEffect(() => {
    fetchUsers();
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;


    const handleUpdate = async () => {
        const token = localStorage.getItem("token");

        try{
            await fetch(`http://localhost:3000/users/update-user/${ownerId}`, {
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
            await fetch(`http://localhost:3000/users/delete-user/${ownerId}`, {
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
            <Link to="/register-user"><button>
              Registrar usuario
            </button>
            </Link>
            <h2>Listado de usuarios</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>ACCIONES</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((a) => (
                        <tr key={a._id}>
                            <td>{a.firstName}</td>
                            <td>{a.lastName}</td>
                            <td>{a.email}</td>
                            <td>{a.role}</td>
                            <td>{a.role !== "ADMIN" && (<button onClick={() => handleUpdate(a._id)}>Editar</button>)}</td>
                            <td>{a.role !== "ADMIN" && (<button onClick={() => handleDelete(a._id)}>Eliminar</button>)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GetUsers;