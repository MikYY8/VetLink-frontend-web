import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";
import api from "../utils/axios";
import { toast } from 'react-toastify';
import "reactjs-popup/dist/index.css";

export default function PopUpBlock({ availabilityBlockId }) {

  const [block, setBlock] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    available: true,
    reason: "",
  });

  const handleBlock = async () => {
    console.log("availabilityBlockId:", availabilityBlockId);
    const token = localStorage.getItem("token");

    try {
      const res = await api.get(`/appointment/block/${availabilityBlockId}`,);

      setBlock(res.data || []);

      setFormData({
        available: result.data.available,
        reason: result.data.reason || "",
      });

    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    await api.patch(`/appointment/block/${availabilityBlockId}`, formData);

    toast.success("Horario actualizado con éxito")
    navigate("/vets");
  };

  return (
    <Popup trigger={<button className="btn-dashboard">Bloquear</button>} modal nested onOpen={handleBlock}>
      {close => (  
        <div className="modal">
          <div className="content">

            {error && <p style={{color:"red"}}>{error}</p>}

            {!block ? (
              <p>Error al buscar el turno...</p>
            ) : (
              <>
                <h3>Cambiar estado del bloque horario</h3>
                <div className="users-form-dad">
                  <form className="users-form-child" onSubmit={handleSubmit}>
                    <label htmlFor="available">
                        Disponible 
                        <input
                            id="pet-input-7"
                            type="checkbox" 
                            name="available" 
                            checked={formData.available} 
                            onChange={handleChange} 
                        />
                    </label>
                    <label htmlFor="reason">
                      Razón: 
                      <input 
                        id="user-input-1"
                        name="reason" 
                        value={formData.reason} 
                        onChange={handleChange} 
                      />
                    </label>

                    <div className="center-stupid-div-again">
                        <button className="pet-btn" type="submit">Guardar cambios</button>
                    </div>
                  </form>
                </div>
                <button className="btn" onClick={close}>Cerrar</button>
              </>
            )}
          </div>
        </div>
      )}
    </Popup>
  );
}