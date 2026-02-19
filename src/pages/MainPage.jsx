import {Link, useNavigate } from "react-router-dom";

function GoToDashboard(){


    return(
        <Link to="/dashboard"><button style={{ padding: "15px", marginRight:"20px" }}>
              Ir al dashboard
            </button>
        </Link>
    )
}

export default GoToDashboard;