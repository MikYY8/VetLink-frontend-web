import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { CalendarDays } from 'lucide-react';
import PopUpBlock from "../components/PopUpBlock";

const VetAvailability = () => {
  const { vetId } = useParams();
  const [blocks, setBlocks] = useState([]);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAvailability = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const res = await axios.get(`http://localhost:3000/appointment/available-blocks`, {
          params: { vetId, date },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
        }) ;
      setBlocks(res.data.data);
    } catch (err) {
      console.error(err);
    }finally{
      setLoading(false);
    };
  };

  useEffect(() => {
    if (date) fetchAvailability();
  }, [date]);

  return (
    <div className="main-container">
        <h2 className="cool-h2-text"><CalendarDays size={30} />Disponibilidad</h2>

        <label htmlFor="date">
          Seleccione una fecha
          <input type="date" id="appointment-input-6" value={date} onChange={(e) => setDate(e.target.value)}/>
        </label>

        <table style={{ width: "50%", borderCollapse: "collapse", marginTop: "20px" }}>
            <thead>
                <tr>
                    <th>Hora</th>
                    <th>Veterinario</th>
                    <th>Especialidad</th>
                    <th>Disponible</th>
                    <th>Razón</th>
                    <th colSpan={2}>ACCIONES</th>
                </tr>
            </thead>
            <tbody>
                {blocks.map(block => (
                    <tr key={block._id}>
                    <td>{block.time}</td>
                    <td>{block.vet.firstName} {block.vet.lastName}</td>
                    <td>{block.vet.specialty}</td>
                    <td>{block.available ? "Si" : "No"}</td>
                    <td>{block.reason}</td>
                    <td><PopUpBlock availabilityBlockId={block._id} /></td>
                    </tr>
                ))}
            </tbody>
        </table>
        {loading && <p>Cargando horarios disponibles...</p>}
    </div>
  );
};

export default VetAvailability;
