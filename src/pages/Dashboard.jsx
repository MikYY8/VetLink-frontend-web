import { useEffect, useState } from "react";
import { speciesMap, appointmentTypeMap, statusMap } from "../utils/translation.js"

function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("http://localhost:3000/appointment/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        console.log("Response:", res);

        const result = await res.json();
        console.log("Result JSON:", result);

        setAppointments(result.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      };
    };

    fetchDashboard();
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!appointments.length) return <p>Cargando dashboard...</p>;

  // filtros
  const total = appointments.length;
  const completed = appointments.filter(a => a.status === "COMPLETED").length;
  const cancelled = appointments.filter(a => a.status === "CANCELLED").length;
  const scheduled = appointments.filter(a => a.status === "SCHEDULED").length;
  
    // Cancelar turno
  const handleCancel = async (appointmentId) => {
    const token = localStorage.getItem("token");

    try{
      await fetch(`http://localhost:3000/appointment/status/${appointmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "CANCELLED" }),
      });

      // refrescar dashboard
      fetchDashboard();
    }catch(error){
      console.error(error);
    };
  };

  return (
    <>
      <div style={{ padding: "20px" }}>
        <h2>Dashboard</h2>
          {/*    TARJETAS     */}
        <div style={{ display: "flex", gap: "20px" }}>
          <Card title="Total turnos" value={total} />
          <Card title="Programados" value={scheduled} />
          <Card title="Completados" value={completed} />
          <Card title="Cancelados" value={cancelled} />
        </div>
      </div>
        
          {/*    TABLA     */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Mascota</th>
            <th>Especie</th>
            <th>Dueño</th>
            <th>Veterinario</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>ACCIONES</th>
          </tr>
        </thead>

        <tbody>
          {appointments.map((a) => (
            <tr key={a._id}>
              <td>{new Date(a.date).toLocaleDateString()}</td>
              <td>{a.time}</td>
              <td>{a.pet?.name}</td>
              <td>{speciesMap[a.pet?.species] || a.pet?.species}</td>
              <td>{a.owner?.firstName} {a.owner?.lastName}</td>
              <td>{a.vet?.firstName} {a.vet?.lastName}</td>
              <td>{appointmentTypeMap[a.type] || a.type}</td>
              <td>{statusMap[a.status] || a.status}</td>
                <td>
                  {a.status === "SCHEDULED" && (
                    <button onClick={() => handleCancel(a._id)}>
                      Cancelar
                    </button>
                  )}
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function Card({ title, value }) {
  return (
    <div style={cardStyle}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}

const cardStyle = {
  border: "1px solid #ccc",
  padding: "5px",
  borderRadius: "8px",
  minWidth: "120px",
  textAlign: "center"
};

export default Dashboard;
