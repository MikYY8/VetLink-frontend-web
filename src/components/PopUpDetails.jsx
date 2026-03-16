import { useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import api from "../utils/axios";

export default function PopUpDetails({ appointmentId }) {

  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);

  const getDetails = async () => {
    console.log("appointmentId:", appointmentId);
    const token = localStorage.getItem("token");

    try {
      const res = await api.get(
        `/appointment/dashboard/details/${appointmentId}`);

      setDetails(res.data || []);

    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    }
  };

  return (
    <Popup trigger={<button className="btn-dashboard">Detalles</button>} modal nested onOpen={getDetails}>
      {close => (
        <div className="modal">
          <div className="content">

            {error && <p style={{color:"red"}}>{error}</p>}

            {!details ? (
              <p>Cargando...</p>
            ) : (
              <>
                <h3 id="app-details-txt">Detalles del turno</h3>
                <p id="app-details-desc"><b>Descripción:</b> {details.details || "Sin detalles"}</p>
                {/* <p><b>Precio:</b> ${details.price}</p> */}
              </>
            )}

          </div>

          <button className="btn" onClick={close}>Cerrar</button>
        </div>
      )}
    </Popup>
  );
}