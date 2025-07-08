import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OauthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // Guardamos el token
      localStorage.setItem("token", token);
      // Redirigimos al usuario al home (o dashboard, como prefieras)
      navigate("/");
    } else {
      // Si no hay token, mostramos error o redirigimos
      console.error("No se encontró el token en la URL.");
      navigate("/login");
    }
  }, [navigate]);

  return <p>Autenticando con Google... 🔐</p>;
};

export default OauthCallback;
