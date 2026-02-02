import { useEffect, useState } from "react";
import api from "../utils/axios"

function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchDashboard = async () => {
      try{
        //  acá es donde llamamos al back, para que el service nos traiga los datos de la BBDD
        const res = await fetch ("http://localhost:3000/appointment/dashboard", { // <- boom, fetcheame esto
          headers: {
            Authorization: `Bearer ${token}`,   // calculo que acá le pasamos el token al back 
            "Content-Type": "application/json"  // y que se lo pase como json|
          }
        });

        if(!res.ok) throw new Error("Error al cargar dashboard");

        const result = await res.json();   // <- acá llegan los datos
        console.log("Dashboard data: ", result)  // acá los mostramos (en consola)
        setData(result.data);   // acá los mostramos (en la web)
      }catch(err){
        setError(err.message);
      };
    };

    fetchDashboard();
  }, []);

  if (error) return <p style={{ color:"red" }} >{error}</p>
  if (!data) return <p>Cargando dashboard...</p>

   return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={cardStyle}>
          <h3>Turnos hoy</h3>
          <p>{data.todayAppointments}</p>
        </div>

        <div style={cardStyle}>
          <h3>Completados</h3>
          <p>{data.completed}</p>
        </div>

        <div style={cardStyle}>
          <h3>Cancelados</h3>
          <p>{data.cancelled}</p>
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  border: "1px solid #ccc",
  padding: "20px",
  borderRadius: "8px",
  minWidth: "150px",
  textAlign: "center"
};

export default Dashboard;
