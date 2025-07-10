import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginWithGoogle } from "../redux/slices/authSlice";
import { useNavigate, useLocation } from "react-router-dom";

const GoogleSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("Mounted GoogleSuccess")
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      dispatch(loginWithGoogle(token)).then((res) => {
        if (loginWithGoogle.fulfilled.match(res)) {
          navigate("/");
        } else {
          navigate("/login");
        }
      });
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate, location.search]);

  return (
    <div className="text-center mt-20">
      <p className="text-xl font-semibold text-vinoTinto">Procesando inicio de sesión con Google...</p>
    </div>
  );
};

export default GoogleSuccess;
