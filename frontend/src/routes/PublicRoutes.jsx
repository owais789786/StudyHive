import { useContext } from "react"
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext"

export const PublicRoutes = ({ children }) => {
    const location = useLocation();

    const { user, authLoading } = useContext(UserContext);
    if(authLoading) return null; if (user) {
    const from = location.state?.from?.pathname || '/'
    return <Navigate to={from} replace />
  }
    return children;
}