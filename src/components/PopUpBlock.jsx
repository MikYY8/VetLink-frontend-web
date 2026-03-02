import { useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

export default function PopUpBlock({ availabilityBlockId }) {

  const [block, setBlock] = useState(null);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    available,
    reason,
  });

  const handleBlock = async () => {
    console.log("availabilityBlockId:", availabilityBlockId);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:3000/appointment/dashboard/details/${availabilityBlockId}`,
        {headers: { Authorization: `Bearer ${token}` }}
      );

      const result = await res.json();
      setBlock(result.data);

    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    }
  };

  return (
    <Popup trigger={<button className="btn-dashboard">Bloquear</button>} modal nested onOpen={handleBlock}>
      {close => (
        <div className="modal">
          <div className="content">

            {error && <p style={{color:"red"}}>{error}</p>}

            {!block ? (
              <p>Cargando...</p>
            ) : (
              <>
                <h3>Detalles del turno</h3>
                <p><b>Descripción:</b> {details.details}</p>
                <p><b>Precio:</b> ${details.price}</p>
              </>
            )}

          </div>

          <button className="btn" onClick={close}>Cerrar</button>
        </div>
      )}
    </Popup>
  );
}