import { useState, createContext, Children, useEffect } from "react";
import { showSuccess, showError } from "../utils/toast";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  useEffect(() => {
    const checkUserOrFetchData = async () => {
      let result;
      try {
        setLoading(true); // Pehle loader chalu karein

        // Yeh aapki API hai, misal ke taur par user profile check karne ke liye
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
          method: 'GET',
          credentials: 'include', // Agar cookies ya sessions use kar rahe hain
        });

        result = await response.json();

        if (result.success) {
          setUser(result.data); // Agar user pehle se logged in hai, to state set kar dein

        }else{
          throw new Error(result)
        }

      } catch (error) {
        showError(result.message);
      } finally {
        // API ka kaam khatam hote hi loading screen ko band kar dein
        setAuthLoading(false);
        setTimeout(() => {
          setLoading(false);
        }, 800); // 800ms ka delay taake transition smooth lage
      }
    };

    checkUserOrFetchData();
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser, loading, setLoading, authLoading }}>
      {children}
    </UserContext.Provider>
  );
}