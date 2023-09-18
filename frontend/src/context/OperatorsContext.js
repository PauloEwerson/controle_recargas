import React, { createContext, useState, useContext } from 'react';
import api from '../api'
import { MessageContext } from './Message';

export const OperatorsContext = createContext();

export const OperatorsProvider = (props) => {

  const [dataOperators, setDataOperators] = useState([]);
  const [toggle, setToggle] = useState(true); // Alterna entre o modo de Cadastro e Edição
  const [updateName, setUpdateName] = useState('');
  const [updateRegistration, setUpdateRegistration] = useState('');
  const [updateId, setUpdateId] = useState('');
  // Ordenamento dos operadores por Nome e Matrícula
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  // Controle da paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const {
    setMessage,
  } = useContext(MessageContext);

  const fetchOperators = async () => {
    const response = await api('get', '/api/operators/operators.php');

    // Se os dados vierem do Portal de Sacolas
    if (response.data && Array.isArray(response.data) && response.data.length > 0 && response.data[0].hasOwnProperty('matricula')) {
      const transformedData = response.data.map(operator => ({
        id: operator.matricula,
        name: operator.nome,
        registration: operator.matricula.toString().slice(-4)[0] === '0'
          ? operator.matricula.toString().slice(-3)
          : operator.matricula.toString().slice(-4),
      }));

      // Oedena os dados
      const sortedData = transformedData.sort((a, b) => {
        if (sortBy === "name") {
          return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else {
          return sortOrder === "asc" ? a.registration.localeCompare(b.registration) : b.registration.localeCompare(a.registration);
        }
      });

      setDataOperators(sortedData);
    } else {
      // Ordenando os dados
      const sortedData = response.data.sort((a, b) => {
        if (sortBy === "name") {
          return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else {
          return sortOrder === "asc" ? a.registration.localeCompare(b.registration) : b.registration.localeCompare(a.registration);
        }
      });
      setDataOperators(sortedData);
    }
  };


  // Adiciona um novo operador no banco de dados e atualiza o estado 
  const handleSubmitOperators = async (e) => {
    const { name, registration } = e;
    try {
      const response = await api('post', '/api/operators/operators.php', { name, registration });

      if (response.data.status.success) {

        const newOperator = response.data.status.operator;
        let updatedOperators = [...dataOperators, newOperator];
        updatedOperators.sort((a, b) => {
          if (sortBy === "name") {
            return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
          } else {
            return sortOrder === "asc" ? a.registration.localeCompare(b.registration) : b.registration.localeCompare(a.registration);
          }
        });

        setDataOperators(updatedOperators)
        setMessage({ message: response.data.status.message, status: 'success' });
      } else if (!response.data.status.success) {
        setMessage({ message: response.data.status.message, status: 'error' });
      }
    } catch (error) {
      if (error.response.data.error) {
        setMessage({ message: error.response.data.error, status: 'error' });
      }
      console.error(error);
    }
  };

  // Altera o estado para o modo de edição
  const handleUpdate = async (id) => {
    const operador = dataOperators.find((operador) => operador.id === id);
    setToggle(!toggle); // altera para o modo de edição
    setUpdateName(operador.name);
    setUpdateRegistration(operador.registration);
    setUpdateId(operador.id);
  };

  const handleUpdateBack = async () => {
    setToggle(!toggle); // altera para o modo de edição
  };

  // Atualiza um operador no banco de dados e atualiza o estado
  const handleUpdateOperador = async (e) => {
    e.preventDefault();
    try {
      const response = await api('put', `/api/operators/operators.php`, {
        id: updateId,
        name: updateName,
        registration: updateRegistration
      });
      if (response.data.status.success) {
        setMessage({ message: response.data.status.message, status: 'success' });

        setDataOperators(dataOperators.map(
          (operador) => operador.id === updateId ? response.data.status.operator : operador
        ));

      } else if (!response.data.status.success) {
        setMessage({ message: response.data.status.message, status: 'error' });
      }

      setToggle(!toggle); // altera para o modo de edição
    } catch (error) {
      console.log(error);
      if (!error.response.data.status.success) {
        setMessage({ message: error.response.data.status.message, status: 'error' });
      }
    }
  }

  // Deleta um operador do banco de dados e atualiza o estado
  const handleDelete = async (id) => {
    try {
      // Make a DELETE request to the backend
      const response = await api('delete', `/api/operators/operators.php/${id}`);

      // Check the response from the backend
      if (response.data.success) {
        // Update the local list of operators by filtering out the deleted operator
        setDataOperators(dataOperators.filter(operador => operador.id !== id));

        // Display a success message
        setMessage({ message: response.data.message, status: 'success' });
      } else {
        // Display an error message if the deletion failed
        setMessage({ message: response.data.message, status: 'error' });
      }
    } catch (error) {
      console.log(error);
      // Handle unexpected errors
      setMessage({ message: "Erro ao excluir o operador. Tente novamente.", status: 'error' });
    }
  }

  // Ordenamento dos operadores por Nome e Matrícula
  const handleSortByName = () => {
    setSortBy("name");
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleSortByRegistration = () => {
    setSortBy("registration");
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  /* ORDENAÇÃO */
  // Filtra os operadores e ordena de acordo com o estado sortBy e sortOrder
  let operatorsToShow = [...dataOperators].sort((a, b) => {
    if (!a.name) return 1;
    if (!b.name) return -1;

    if (sortBy === "name") {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    } else {
      if (!a.registration) return 1;
      if (!b.registration) return -1;

      if (sortOrder === "asc") {
        return a.registration.localeCompare(b.registration);
      } else {
        return b.registration.localeCompare(a.registration);
      }
    }
  });

  /* PAGINAÇÃO */
  // Usa o estado currentPage para determinar quais operadores devem ser exibidos na tabela:
  const startIndex = (currentPage - 1) * 8;
  const endIndex = startIndex + 8;
  operatorsToShow = operatorsToShow.slice(startIndex, endIndex);

  return (
    <OperatorsContext.Provider value={{
      fetchOperators,
      toggle,
      handleSubmitOperators,
      updateName,
      setUpdateName,
      updateRegistration,
      setUpdateRegistration,
      handleUpdateOperador,
      handleSortByName,
      handleSortByRegistration,
      operatorsToShow,
      handleUpdate,
      handleDelete,
      setCurrentPage,
      currentPage,
      totalPages,
      setMessage,
      dataOperators,
      handleUpdateBack,
      setTotalPages,
    }}>
      {props.children}
    </OperatorsContext.Provider>
  );
};
