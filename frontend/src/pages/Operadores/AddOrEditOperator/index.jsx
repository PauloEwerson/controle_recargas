import React, { useContext, useState } from "react";
import { OperatorsContext } from "../../../context/OperatorsContext";

const AddOrEditOperator = () => {
  const {
    toggle,
    handleUpdateBack,
    handleSubmitOperators,
    updateName,
    setUpdateName,
    updateRegistration,
    setUpdateRegistration,
    handleUpdateOperador,
  } = useContext(OperatorsContext);

  const [name, setName] = useState("");
  const [registration, setRegistration] = useState("");

  const handleForm = (e) => {
    e.preventDefault();
    handleSubmitOperators({ name, registration });
    setName("");
    setRegistration("");
  };
  return (
    <div className="mt-1">
      {toggle ? (
        <div>
          <h5 className="mb-4">Adicionar Operador</h5>
          <form onSubmit={handleForm}>
            <div className="row">
              <div className="col-md-6 form-group">
                <label>Nome:</label>
                <input
                  type="text"
                  placeholder="Digite o nome"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="form-control"
                />
              </div>
              <div className="col-md-6 form-group">
                <label>Nº Operador:</label>
                <input
                  type="text"
                  placeholder="Digite o número do operador"
                  value={registration}
                  onInput={(event) => {
                    const inputValue = event.target.value;
                    if (!isNaN(inputValue)) {
                      setRegistration(inputValue);
                    }
                  }}
                  className="form-control"
                />
              </div>
            </div>
            <button
              className="btn btn-success"
              type="submit"
              disabled={!name || !registration}
            >
              Adicionar
            </button>
          </form>
        </div>
      ) : (
        <div>
          <h5 className="mb-4">Editar Operador</h5>
          <form>
            <div className="row">
              <div className="col-md-6 form-group">
                <label>Nome:</label>
                <input
                  type="text"
                  placeholder="Nome"
                  value={updateName}
                  onChange={(event) => setUpdateName(event.target.value)}
                  className="form-control"
                />
              </div>
              <div className="col-md-6 form-group">
                <label>Matrícula:</label>
                <input
                  type="text"
                  placeholder="Matrícula"
                  value={updateRegistration}
                  onInput={(event) => {
                    const inputValue = event.target.value;
                    if (!isNaN(inputValue)) {
                      setUpdateRegistration(inputValue);
                    }
                  }}
                  className="form-control"
                />
              </div>
            </div>
            <button className="btn btn-success" onClick={handleUpdateOperador}>
              Atualizar
            </button>
            <button className="btn btn-danger ml-2" onClick={handleUpdateBack}>
              Voltar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddOrEditOperator;
