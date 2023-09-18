import React, { createContext, useState, useContext } from 'react';
import api from '../api'
import { MessageContext } from './Message';

export const UsersContext = createContext();

export const UsersProvider = (props) => {

  const [dataUsers, setDataUsers] = useState([]);
  const [toggle, setToggle] = useState(true); // Alterna entre o modo de Cadastro e Edição

  const [updateName, setUpdateName] = useState('');
  const [updateRegistration, setUpdateRegistration] = useState('');
  const [updatePassword, setUpdatePassword] = useState('');
  const [updatePerfil, setUpdatePerfil] = useState('');
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

  // Busca os operadores cadastrados no banco de dados e armazena no estado
  const fetchUsers = async () => {
    const response = await api('get', '/api/users/users.php');

    // Ordenando os dados
    const sortedData = response.data.sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else {
        return sortOrder === "asc" ? a.registration.localeCompare(b.registration) : b.registration.localeCompare(a.registration);
      }
    });
    setDataUsers(sortedData);
  };

  // Adiciona um novo operador no banco de dados e atualiza o estado 
  const handleSubmitUsers = async ({ name, registration, password, perfil }) => {

    try {
      const response = await api('post', '/api/users/users.php',
        { name, registration, password, perfil }
      );

      if (response.data.status.success) {

        const newUser = response.data.status.user;
        let updatedUsers = [...dataUsers, newUser];
        updatedUsers.sort((a, b) => {
          if (sortBy === "name") {
            return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
          } else {
            return sortOrder === "asc" ? a.registration.localeCompare(b.registration) : b.registration.localeCompare(a.registration);
          }
        });

        setDataUsers(updatedUsers)
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
    const user = dataUsers.find((user) => user.id === id);
    setToggle(!toggle); // altera para o modo de edição
    setUpdateName(user.name);
    setUpdateRegistration(user.registration);

    setUpdatePerfil(user.perfil);
    setUpdateId(user.id);
  };

  const handleUpdateBack = async () => {
    setToggle(!toggle); // altera para o modo de edição
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      // Constrói o objeto com os dados a serem atualizados
      const dataToUpdate = { id: updateId };

      if (updateName) dataToUpdate.name = updateName;
      if (updateRegistration) dataToUpdate.registration = updateRegistration;
      if (updatePassword) dataToUpdate.password = updatePassword;
      if (updatePerfil) dataToUpdate.perfil = updatePerfil;

      const response = await api('put', `/api/users/users.php`, dataToUpdate);

      if (response.data.status.success) {
        setMessage({ message: response.data.status.message, status: 'success' });

        const updatedUser = response.data.status.user;
        let updatedUsers = dataUsers.map(user => user.id === updateId ? updatedUser : user);
        updatedUsers.sort((a, b) => {
          if (sortBy === "name") {
            return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
          } else {
            return sortOrder === "asc" ? a.registration.localeCompare(b.registration) : b.registration.localeCompare(a.registration);
          }
        });
        setDataUsers(updatedUsers);

        setToggle(!toggle); // Alterna para o modo de edição
      } else if (!response.data.status.success) {
        setMessage({ message: response.data.status.message, status: 'error' });
      }

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

      const response = await api('delete', `/api/users/users.php/${id}`);

      if (response.data.success) {
        // Atualiza o estado com os operadores que não foram deletados
        setDataUsers(dataUsers.filter(user => user.id !== id));

        setMessage({ message: response.data.message, status: 'success' });
      } else {
        setMessage({ message: response.data.message, status: 'error' });
      }
    } catch (error) {
      console.log(error);
      setMessage({ message: "Erro ao excluir o usuário. Tente novamente.", status: 'error' });
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
  let usersToShow = [...dataUsers].sort((a, b) => {
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
  usersToShow = usersToShow.slice(startIndex, endIndex);

  return (
    <UsersContext.Provider value={{
      fetchUsers,
      toggle,
      handleSubmitUsers,
      updateName,
      setUpdateName,
      updateRegistration,
      setUpdateRegistration,
      handleUpdateUser,
      handleSortByName,
      handleSortByRegistration,
      setUpdatePassword,
      usersToShow,
      handleUpdate,
      handleDelete,
      setCurrentPage,
      currentPage,
      totalPages,
      setMessage,
      dataUsers,
      handleUpdateBack,
      setTotalPages,
      setUpdatePerfil,
    }}>
      {props.children}
    </UsersContext.Provider>
  );
};
