import React, { useState, useEffect } from "react";
import api from "../../api";
import Loading from "../../shared/Loading";
import "./styles.css";

const Installation = () => {
  const [dbHost, setDbHost] = useState("");
  const [dbName, setDbName] = useState("");
  const [dbUser, setDbUser] = useState("");
  const [dbPassword, setDbPassword] = useState("");
  const [dbCharset, setDbCharset] = useState("utf8");
  const [filial, setFilial] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [touchedHost, setTouchedHost] = useState(false);
  const [touchedDb, setTouchedDb] = useState(false);
  const [touchedUser, setTouchedUser] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);
  const [reuseOperators, setReuseOperators] = useState(false);
  const [touchedFilial, setTouchedFilial] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [installationComplete, setInstallationComplete] = useState(false);


  useEffect(() => {
    const checkInstallation = async () => {
      try {
        setIsLoading(true);
        const response = await api("get", "/api/install/check_install.php");
        if (response.data.installed) {
          window.location.href = "/recargas";
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    checkInstallation();
  }, []);

  const handleInstall = async () => {
    setSubmitted(true);
    if (!dbHost || !dbName || !dbUser || !dbPassword || !filial) {
      setMessage("Por favor, preencha todos os campos.");
      setSuccessMessage("error");
      return;
    }
    try {
      setIsLoading(true);
      const response = await api("post", "/api/install/install.php", {
        db_host: dbHost,
        db_name: dbName,
        db_user: dbUser,
        db_password: dbPassword,
        reuse_operators: reuseOperators,
        db_charset: dbCharset,
        filial: filial
    });
    

      if (response.data.status === "success") {
        setSuccessMessage("success");
        setMessage(response.data.message);
        setInstallationComplete(true);
      } else {
        setSuccessMessage("error");
        setMessage(response.data.message);
      }
    } catch (error) {
      setSuccessMessage("error");
      setMessage("Instalação falhou. Porfavor tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="installation-block">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="container-block">
          <div className="installation-sec">
            <h2 className="text-center">Instalação</h2>
            <form className="installation-form">
              <div className="form-group">
                <label>Host:</label>
                <input
                  type="text"
                  className={`form-input ${
                    !dbHost && (touchedHost || submitted) ? "input-error" : ""
                  }`}
                  value={dbHost}
                  onChange={(e) => setDbHost(e.target.value)}
                  onBlur={() => setTouchedHost(true)}
                />
              </div>
              <div className="form-group">
                <label>Nome do Banco:</label>
                <input
                  type="text"
                  className={`form-input ${
                    !dbName && (touchedDb || submitted) ? "input-error" : ""
                  }`}
                  value={dbName}
                  onChange={(e) => setDbName(e.target.value)}
                  onBlur={() => setTouchedDb(true)}
                />
              </div>
              <div className="form-group">
                <label>Usuário do Banco:</label>
                <input
                  type="text"
                  className={`form-input ${
                    !dbUser && (touchedUser || submitted) ? "input-error" : ""
                  }`}
                  value={dbUser}
                  onChange={(e) => setDbUser(e.target.value)}
                  onBlur={() => setTouchedUser(true)}
                />
              </div>
              <div className="form-group">
                <label>Senha do Banco:</label>
                <input
                  type="password"
                  className={`form-input ${
                    !dbPassword && (touchedPassword || submitted)
                      ? "input-error"
                      : ""
                  }`}
                  value={dbPassword}
                  onChange={(e) => setDbPassword(e.target.value)}
                  onBlur={() => setTouchedPassword(true)}
                />
              </div>

              <div className="form-group">
                <label>Reutilizar operadores do Portal de Sacolas?</label>
                <select
                  className="select-form"
                  value={reuseOperators}
                  onChange={(e) => setReuseOperators(e.target.value === "true")}
                >
                  <option value="true">Sim</option>
                  <option value="false">Não</option>
                </select>
              </div>

              <div className="form-group">
                <label>Nº Filial:</label>
                <input
                  type="text"
                  className={`form-input ${
                    !filial && (touchedFilial || submitted) ? "input-error" : ""
                  }`}
                  value={filial}
                  onChange={(e) => setFilial(e.target.value)}
                  onBlur={() => setTouchedFilial(true)}
                />
              </div>
              <div className="form-group">
                <label>Database Charset:</label>
                <p style={{ marginLeft: "1rem", color: "red" }}>
                  Já definido! Mude apenas se for necessário
                </p>
                <input
                  type="text"
                  className="form-input"
                  value={dbCharset}
                  onChange={(e) => setDbCharset(e.target.value)}
                />
              </div>
              <div className="form-check">
                {installationComplete ? (
                  <button
                    type="button"
                    id="btn-go-to-login"
                    className="btn float-right btn-success"
                    onClick={() => {
                      window.location.href = "/recargas"; // Redireciona para a tela de login
                    }}
                  >
                    Ir para o Login
                  </button>
                ) : (
                  <button
                    type="button"
                    id="btn-install"
                    className="btn float-right"
                    onClick={handleInstall}
                  >
                    Instalar
                  </button>
                )}
              </div>
              {message && (
                <p
                  className={`section-message ${
                    successMessage === "success"
                      ? "success-message"
                      : "error-message"
                  }`}
                >
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Installation;
