// client/src/pages/GoogleSuccess.js
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loginWithGoogleToken } from "../redux/slices/authSlice";

const GoogleSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // Guardar token en localStorage
      localStorage.setItem("token", token);

      // ⚡ Despachar acción y esperar resolución
      dispatch(loginWithGoogleToken(token))
        .unwrap()
        .then(() => {
          navigate("/"); // Puedes cambiar por /dashboard si tienes uno
        })
        .catch((err) => {
          console.error("❌ Error al iniciar sesión con Google:", err);
          localStorage.removeItem("token");
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate, searchParams]);

  return (
    <div className="p-10 text-center text-lg">
      Procesando inicio de sesión con Google...
    </div>
  );
};

export default GoogleSuccess;
