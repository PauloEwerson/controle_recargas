import React, { useContext, useState, useEffect } from "react";
import { OperatorsContext } from "../../context/OperatorsContext";
import AddOrEditOperator from "./AddOrEditOperator";
import "./styles.css";
import { Modal, Button } from "react-bootstrap";

const OperadoresPage = () => {
  const {
    handleSortByName,
    handleSortByRegistration,
    handleUpdate,
    handleDelete,
    setCurrentPage,
    currentPage,
    totalPages,
    setTotalPages,
    dataOperators,
  } = useContext(OperatorsContext);

  const [isOpen, setIsOpen] = useState(false);
  const [currentOperator, setCurrentOperator] = useState({});
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const onConfirmDelete = () => {
    handleDelete(currentOperator.id);
    setIsOpen(false);
    setCurrentOperator({});
  };

  useEffect(() => {
    setTotalPages(Math.ceil(dataOperators.length / itemsPerPage));
  }, [dataOperators, itemsPerPage, setTotalPages]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOperators = dataOperators.slice(startIndex, endIndex);

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
          <Modal.Title>Exclusão de operador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
            }}
          >
            Deseja realmente excluir este operador?
            <span style={{ marginTop: "1rem" }}>
              <h4>{currentOperator?.name}</h4>
              <h4>{currentOperator?.registration}</h4>
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
        <AddOrEditOperator />
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
                <th className="table-acoes">Ações</th>
              </tr>
            </thead>
            <tbody>
              {currentOperators.map((operator) => (
                <tr key={operator.id}>
                  <td>{operator.name}</td>
                  <td>{operator.registration}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handleUpdate(operator.id)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => {
                        setIsOpen(true);
                        setCurrentOperator(operator);
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
        <label>Operadores por página</label>
        <p>
          Página {currentPage} de {totalPages}
        </p>
      </section>
    </div>
  );
};

export default OperadoresPage;
