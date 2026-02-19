import { useEffect, useState } from "react";
import { speciesMap, appointmentTypeMap, statusMap } from "../utils/translation.js"
import { Link, useNavigate } from "react-router-dom";
import { ClipboardClock } from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [vets, setVets] = useState([]);
  const [vetId, setVetId] = useState("");
  const [date, setDate] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const token = localStorage.getItem("token");

  // Crear el dashboard
  const fetchDashboard = async () => {
    const token = localStorage.getItem("token");
    if(loading) <p>Cargando dashboard...</p>;

    const params = new URLSearchParams();
    if (vetId) params.append("vetId", vetId);
    if (date) params.append("date", date);
    if (from) params.append("from", from);
    if (to) params.append("to", to);
      
    try{
      const res = await fetch(`http://localhost:3000/appointment/dashboard?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "application/json"
        }
      });

      console.log("Response:", res);
      const result = await res.json();
      console.log("Result JSON:", result);

      setAppointments(result.data || []);
    }catch(err){
      console.error("Fetch error:", err);
      setError(err.message);
    }finally{
      setLoading(false);
    };
  };

  // Mostrar el dashboard
  useEffect(() => {
    fetchDashboard();
  }, [vetId, date, from, to]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Filtros
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

  // Traer todos los vets, para el filtro
  const fetchVets = async () => {
    const token = localStorage.getItem("token");

    try{
      const res = await fetch(`http://localhost:3000/users/allvets`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      setVets(result.data);
    }catch(error){
      console.error(error);
    };
  };
  fetchVets();
};

  return (
    <>
      <div className="main-container">
        <div className="txt-card-container">
          <h2 className="dashboard-text"><ClipboardClock size={30} /> Turnos</h2>
          
          {/* <Card title="Total turnos" value={total} />
          <Card title="Programados" value={scheduled} />
          {/*    TARJETAS     */} 
          {/* <Card title="Completados" value={completed} />
          <Card title="Cancelados" value={cancelled} /> */} 
        </div>

          {/*    FILTROS     */}
        <div className="container"> 
          <Link to="/create-appointment">
            <button className="btn-nvb">
              Agendar turno
            </button>
          </Link>
              {/*    POR VETERINARIO     */}
            <label className="label">Por veterinario</label>
              <select className="vet-filter" value={vetId} onChange={(e) => setVetId(e.target.value)}>
                <option value="">Todos los veterinarios</option>
                {vets.map(v => (
                  <option key={v._id} value={v._id}>
                    {v.firstName} {v.lastName}
                  </option>
                ))};
              </select>
            
            {/*    POR FECHA     */}
            <label className="label">Por fecha</label>            
              <input className="date-filter" type="date" value={date} onChange={(e) => {
                setDate(e.target.value);
                setFrom("");
                setTo("");
                }} 
              />
              

            {/*    POR RANGO DE FECHAS     */}
            <label className="label"> Por rango de fechas</label>
              <input className="date-filter" type="date" value={from} onChange={(e) => {
                setFrom(e.target.value);
                setDate("");
                }} 
              />

            <label className="label"> - </label>
              <input className="date-filter" type="date" value={to} onChange={(e) => {
                setTo(e.target.value);
                setDate("");
                }} 
              />

            {/*    LIMPIAR FILTROS    */}
          <button className="btn" onClick={() => {
            setVetId("");
            setDate("");
            setFrom("");
            setTo("");
          }}>Limpiar</button>
          
        </div>

            {/*    TABLA     */}
        <table className="dashboard-table">
          <thead className="table-header">
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

          <tbody className="table-body">
            {appointments.map((a) => (
              <tr key={a._id}>
                <td>{new Date(a.date).toLocaleDateString("es-AR", { timeZone: "UTC" })}</td>
                <td>{a.time}</td>
                <td>{a.pet?.name}</td>
                <td>{speciesMap[a.pet?.species] || a.pet?.species}</td>
                <td>{a.owner?.firstName} {a.owner?.lastName}</td>
                <td>{a.vet?.firstName} {a.vet?.lastName}</td>
                <td>{appointmentTypeMap[a.type] || a.type}</td>
                <td>{statusMap[a.status] || a.status}</td>
                  <td>
                    {a.status === "SCHEDULED" && (<button className="btn" onClick={() => handleCancel(a._id)}>Cancelar</button>)}
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Card({ title, value }) {
  return (
    <div className="card-style">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}

export default Dashboard;
