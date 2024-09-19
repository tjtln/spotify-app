import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


function Dashboard() {
    const navigate = useNavigate();
    useEffect(() => {
        if(localStorage.getItem('spotify_token')){
           
        } else {
            navigate("/login");
        }
    },[navigate])
    return (
        <>
            <h3>
                Dashboard
            </h3>
        </>
    )
    
}
export default Dashboard
