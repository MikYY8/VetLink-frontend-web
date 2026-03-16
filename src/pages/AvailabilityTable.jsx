import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/axios";
import { CalendarDays } from 'lucide-react';
import PopUpBlock from "../components/PopUpBlock";
import Select from "react-select";

const VetAvailability = () => {
  const { vetId } = useParams();
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchAvailability = async (selectedDate) => {
    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const res = await api.get(`/appointment/available-blocks`, {
          params: { vetId, date: selectedDate },
        });
      setBlocks(res.data.data);
    } catch (err) {
      console.error(err);
    }finally{
      setLoading(false);
    };
  };

  useEffect(() => {
    fetchAvailableDates();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailability(selectedDate.value);
    }
  }, [selectedDate]);

  const fetchAvailableDates = async () => {
    const token = localStorage.getItem("token");

    const res = await api.get(`/appointment/availability/dates/${vetId}`);

    const options = res.data.data.map(date => ({
      value: date,
      label: date
    }));

    setAvailableDates(options);
  };

  return (
    <div className="main-container">
        <h2 className="cool-h2-text"><CalendarDays size={30} />Disponibilidad</h2>

        <label>
          Seleccione una fecha disponible
          <Select
            id="availability-input-1"
            placeholder="Seleccione una fecha"
            options={availableDates}
            value={selectedDate}
            onChange={(option) => {
              setSelectedDate(option);
              setBlocks([]);
            }}
          />
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
        {loading && <p style={{ paddingBottom:"20px", marginBottom: "0px"}}>Seleccione un fecha...</p>}
    </div>
  );
};

export default VetAvailability;
