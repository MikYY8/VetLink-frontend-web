import { useEffect, useState } from "react";
import api from "../utils/axios"

function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem("token")

  fetch("http://localhost:3000/appointment/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  useEffect(() => {
    api.get("/appointment/dashboard")
      .then(res => setAppointments(res.data.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h2>Secretaría</h2>

      {appointments.map(a => (
        <div key={a._id}>
          <p>{a.pet.name} - {a.date}</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
