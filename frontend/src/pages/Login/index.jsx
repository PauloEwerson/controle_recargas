import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import "./Login.css";

import logo from "../../assets/logo-h.png";
import floatingReport from "../../assets/report-analysis-3.svg";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [showMessage, setShowMessage] = useState("");

  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      await login({ username, password });
      navigate("/home");
      setUsername("");
      setPassword("");
      setAuthError(false);
    } catch (error) {
      console.error("Erro no login:", error);
      setUsername("");
      setPassword("");
      setShowMessage(error);
      setAuthError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="login-block">
      <div id="container-block">
        <div className="row">
          <div className="col-md-4 login-sec">
            <h2 className="text-title">Controle de Recargas</h2>
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="username" className="text-uppercase">
                  Matrícula:
                </label>
                <input
                  type="text"
                  className={`form-input ${authError ? "input-error" : ""}`}
                  placeholder=""
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password" className="text-uppercase">
                  Senha:
                </label>
                <input
                  type="password"
                  className={`form-input ${authError ? "input-error" : ""}`}
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {authError && (
                <section className="section-error">
                  <label className="text-danger">{showMessage}</label>
                </section>
              )}
              <div className="form-check">
                <button
                  type="submit"
                  id="btn-login"
                  className="btn float-right"
                >
                  {isLoading ? (
                    <>
                      <div className="lds-ellipsis-dot"></div>
                      <div className="lds-ellipsis-dot"></div>
                      <div className="lds-ellipsis-dot"></div>
                    </>
                  ) : (
                    "Enviar"
                  )}
                </button>
              </div>
            </form>
            <div className="copy-text">
              Desenvolvido por <i>Paulo Ewerson</i>
              | Patos 199
            </div>
          </div>

          <div className="col-md-8 banner-sec">
            <img
              src={floatingReport}
              alt="Descrição da imagem"
              className="floating-svg"
            />
            {/* Adicionar carrossel - Opcional*/}
          </div>
          
        </div>
      </div>
      <div className="logo-container">
        <img src={logo} alt="Logomarca Atacadão" className="company-logo" />
      </div>
    </section>
  );
};

export default Login;
