import React, { useState, useEffect } from "react";
import api from "../../api";
import "./styles.css";

import Loading from "../../shared/Loading";

const Installation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [installationMessage, setInstallationMessage] = useState("");
  const [showNextButton, setShowNextButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const executeStep = async (stepNumber) => {
    try {
      setIsLoading(true);
      setShowNextButton(false);
      const response = await api(
        "get",
        `/api/install/install.php?step=${stepNumber}`
      );
      const result = response.data;
      setInstallationMessage(result);

      if (result.status === "success") {
        setShowNextButton(true);
      }
    } catch (error) {
      setInstallationMessage("Ocorreu um erro durante a instalação.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
    setInstallationMessage("");
    setShowNextButton(false);
  };

  const navigateToLogin = () => {
    window.location.href = "/recargas";
  };

  return (
    <div className="installation-container">
      <div className="installation-panel">
      {currentStep !== 7 && <h1 className="installation-header">Instalação</h1>}

        <div>
          <h3 className="installation-subheader">
            {currentStep !== 7 && `Passo ${currentStep}: `}

            {currentStep === 1 && "Teste a Conexão com o Banco de Dados"}
            {currentStep === 2 && "Verifique a disponibilidade das tabelas"}
            {currentStep === 3 && "Reutilização de sac_operadores ou Criação de Operators_Recargas"}
            {currentStep === 4 && "Criar Tabela Users_Recargas"}
            {currentStep === 5 && "Criar Tabela Analytics_Recargas"}
            {currentStep === 6 && "Criar Tabela DataTables_Recargas"}
            {currentStep === 7 && "Instalação Finalizada!"}
          </h3>

          {isLoading ? (
            <Loading />
          ) : (
            <div>
              {currentStep === 7 ? (
                <button
                  className="installation-button-next"
                  onClick={navigateToLogin}
                >
                  Ir para o login
                </button>
              ) : showNextButton ? (
                <button
                  className="installation-button-next"
                  onClick={handleNextStep}
                >
                  Avançar
                </button>
              ) : (
                <button
                  className="installation-button"
                  onClick={() => executeStep(currentStep)}
                >
                  Executar
                </button>
              )}
            </div>
          )}
          <div className="installation-message">
            {installationMessage && (
              <div
                className={
                  installationMessage.status === "error"
                    ? "error-message"
                    : "success-message"
                }
              >
                {installationMessage.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Installation;
