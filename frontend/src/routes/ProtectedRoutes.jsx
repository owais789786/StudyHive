import { useContext } from "react"
import { useLocation, Navigate } from "react-router-dom"
import { UserContext } from "../context/UserContext";

export const ProtectedRoutes = ({ children }) => {
    const location = useLocation();
    const { user } = useContext(UserContext);
    
    if (!user) return<Navigate to='/login' replace state={{from: location}} />;
    return children;
}