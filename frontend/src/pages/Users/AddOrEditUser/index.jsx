import React, { useContext, useState } from "react";
import { UsersContext } from "../../../context/UsersContext";

const AddOrEditOperator = () => {
  const {
    toggle,
    handleUpdateBack,
    handleSubmitUsers,
    updateName,
    setUpdateName,
    updateRegistration,
    setUpdateRegistration,
    setUpdatePassword,
    updatePerfil,
    setUpdatePerfil,
    handleUpdateUser,
  } = useContext(UsersContext);

  const [name, setName] = useState("");
  const [registration, setRegistration] = useState("");
  const [password, setPassword] = useState("");
  const [perfil, setPerfil] = useState("colab");

  const handleForm = (e) => {
    e.preventDefault();
    handleSubmitUsers({ name, registration, password, perfil });
    setName("");
    setRegistration("");
    setPassword("");
    setPerfil("colab");
  };

  return (
    <div className="mt-1">
      {toggle ? (
        <div>
          <h5 className="mb-1">Adicionar Usuário</h5>
          <form onSubmit={handleForm}>
            <div className="row">
              <div className="col-md-6 form-group">
                <label htmlFor="name">Nome:</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Digite o nome"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="form-control"
                />
              </div>
              <div className="col-md-6 form-group">
                <label htmlFor="registration">Matrícula:</label>
                <input
                  id="registration"
                  type="text"
                  placeholder="Digite a matrícula"
                  value={registration}
                  onChange={(event) => setRegistration(event.target.value)}
                  className="form-control"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 form-group">
                <label htmlFor="password">Senha:</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Digite a senha"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="form-control"
                />
              </div>
              <div className="col-md-6 form-group">
                <label htmlFor="perfil">Perfil:</label>
                <select
                  name="perfil"
                  id="perfil"
                  value={perfil}
                  onChange={(event) => setPerfil(event.target.value)}
                  className="form-control"
                >
                  <option value="colab">Colaborador</option>
                  <option value="admin">Administrador</option>
                </select>
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
                <label htmlFor="name">Nome:</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Digite o nome"
                  value={updateName}
                  onChange={(event) => setUpdateName(event.target.value)}
                  className="form-control"
                />
              </div>
              <div className="col-md-6 form-group">
                <label htmlFor="registration">Matrícula:</label>
                <input
                  id="registration"
                  type="text"
                  placeholder="Digite a matrícula"
                  value={updateRegistration}
                  onChange={(event) =>
                    setUpdateRegistration(event.target.value)
                  }
                  className="form-control"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 form-group">
                <label htmlFor="password">Senha:</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Digite a senha"
                  onChange={(event) => setUpdatePassword(event.target.value)}
                  className="form-control"
                />
              </div>
              <div className="col-md-6 form-group">
                <label htmlFor="perfil">Perfil:</label>
                <select
                  name="perfil"
                  id="perfil"
                  value={updatePerfil}
                  onChange={(event) => setUpdatePerfil(event.target.value)}
                  className="form-control"
                >
                  <option value="colab">Colaborador</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>
            <button className="btn btn-success" onClick={handleUpdateUser}>
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
