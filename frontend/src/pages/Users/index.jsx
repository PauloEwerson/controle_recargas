import React, { useContext, useState, useEffect } from "react";
import { UsersContext } from "../../context/UsersContext";
import AddOrEditUser from "./AddOrEditUser";
import "./styles.css";
import { Modal, Button } from "react-bootstrap";

const UsersPage = () => {
  const {
    handleSortByName,
    handleSortByRegistration,
    handleUpdate,
    handleDelete,
    setCurrentPage,
    currentPage,
    totalPages,
    setTotalPages,
    dataUsers,
  } = useContext(UsersContext);

  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const onConfirmDelete = () => {
    handleDelete(currentUser.id);
    setIsOpen(false);
    setCurrentUser({});
  };

  useEffect(() => {
    setTotalPages(Math.ceil(dataUsers.length / itemsPerPage));
  }, [dataUsers, itemsPerPage, setTotalPages]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = dataUsers.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleChangeItemsPerPage = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="operadores-page">
      <Modal show={isOpen} onHide={() => setIsOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Exclusão de usuário</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
            }}
          >
            Deseja realmente excluir este usuárip?
            <span style={{ marginTop: "1rem" }}>
              <h4>{currentUser?.name}</h4>
              <h4>{currentUser?.registration}</h4>
            </span>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={onConfirmDelete}>
            Sim
          </Button>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Não
          </Button>
        </Modal.Footer>
      </Modal>
      <section>
        <AddOrEditUser />
      </section>
      <section className="section-table">
        <section className="section-table-cad">
          <table>
            <thead>
              <tr>
                <th className="table-name" onClick={handleSortByName}>
                  Nome
                </th>
                <th
                  className="table-matricula"
                  onClick={handleSortByRegistration}
                >
                  Matrícula
                </th>
                <th className="table-matricula">Perfil</th>
                <th className="table-acoes">Ações</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.registration}</td>
                  <td>
                    {user.perfil === "admin" ? "Administrador" : "Colaborador"}
                  </td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handleUpdate(user.id)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => {
                        setIsOpen(true);
                        setCurrentUser(user);
                      }}
                    >
                      Excluir
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <div className="pagination">
          <Button
            variant="secondary"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>

          <Button
            variant="secondary"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Próximo
          </Button>
        </div>

        <select onChange={handleChangeItemsPerPage} value={itemsPerPage}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
        <label>Usuários por página</label>
        <p>
          Página {currentPage} de {totalPages}
        </p>
      </section>
    </div>
  );
};

export default UsersPage;
