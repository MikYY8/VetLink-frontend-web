import { useState, useEffect } from "react";
import {Link, useNavigate } from "react-router-dom";
import { Users } from 'lucide-react';
import { rolesMap } from "../utils/translation";
import { toast } from 'react-toastify';
import api from "../utils/axios";

function GetUsers(){
    const [users, setUsers] = useState([]);
    const [searchUser, setSearchUser] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    const filteredUsers = users.filter((user) => {
        if (searchUser === "") return true;

        return (
            user.firstName.toLowerCase().includes(searchUser.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchUser.toLowerCase())
        );
    });

    const fetchUsers = async () => {
        const token = localStorage.getItem("token");
        setLoading(true);

        try{
            const res = await api.get(`/users/allusers`)

            // console.log("Response:", res);
            const result = await res.json();
            // console.log("Result JSON:", result);
            setUsers(result.data || []);

        }catch(error){
            // console.error("Fetch error:", error);
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

    const handleUpdate = async (ownerId) => {
        navigate(`/update-user/${ownerId}`);
    };

    const handleDelete = async (ownerId) => {
        const token = localStorage.getItem("token");
        // const confirmDelete = window.confirm("¿Seguro que querés eliminar este usuario?");
        // if (!confirmDelete) return;
        
        try{
            const res = await api.delete(`/users/delete-user/${ownerId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Error al eliminar usuario");
            
            toast.success("Usuario eliminado")
            setUsers(users.filter(u => u._id !== ownerId));
            fetchUsers();
            
        }catch(error){
            // console.error(error);
            setError(error.message);
        }
    };

    return(
        <div className="main-container">
            {loading && <p>Cargando usuarios...</p>}
            <Link to="/register-user">
                <button className="btn2">
                    Registrar Usuario
                </button>
            </Link>
            <input
                type="search"
                className="search-bar-input"
                id="buscador"
                name="buscador"
                placeholder="Buscar por nombre o apellido"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
            />
            <h2 className="cool-h2-text"><Users size={30} /> Listado de usuarios</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>DNI</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th colSpan={2}>ACCIONES</th>
                    </tr>
                </thead>

                <tbody className="table-body">
                    {filteredUsers.map((a) => (
                        <tr key={a._id}>
                            <td>{a.firstName}</td>
                            <td>{a.lastName}</td>
                            <td>{a.dni}</td>
                            <td>{a.email}</td>
                            <td>{rolesMap[a.role] || a.role}</td>
                            <td>{(a.role === "OWNER" || a.role === "SECRETARY") && (<button className="btn" onClick={() => handleUpdate(a._id)}>Editar</button>)}</td>
                            <td>{(a.role === "OWNER" || a.role === "SECRETARY") && (<button className="btn"  onClick={() => handleDelete(a._id)}>Eliminar</button>)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GetUsers;