import React, { createContext, useState, useContext } from 'react';
import api from '../api'
import { MessageContext } from './Message'

export const HomeContext = createContext();

export const HomeProvider = (props) => {
  const [file, setFile] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [updateMeta, setUpdateMeta] = useState('');

  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(0);

  const { setMessage } = useContext(MessageContext);

  // Carrega dados do backend
  const fetchData = async () => {
    setIsDataLoaded(false);
    try {
      const response = await api('get', '/api/reports/report.php');
      if (Array.isArray(response.data)) {
        setData(response.data);
      } else {
        setData([]);
        console.error('Unexpected data format from API.');
      }
    } catch (error) {
      console.log(error)
      if (error.response.data.error) {
        setMessage({ message: error.response.data.error, status: 'error' });
      }
    } finally {
      setIsDataLoaded(true);
    }
  };

  const fetchMeta = async () => {
    setIsDataLoaded(false);
    try {
      const response = await api('get', '/api/meta/meta.php');
      setMeta(response.data);
    } catch (error) {
      console.log(error)
      if (error.response.data.error) {
        setMessage({ message: error.response.data.error, status: 'error' });
      }
    } finally {
      setIsDataLoaded(true);
    }
  };

  // Envia arquivo CSV para o backend
  const handleFileChange = (e) => {
    setFile(e);
  }

  const handleUpload = async (e) => {
    e.preventDefault();
    setIsDataLoaded(false);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api('post', '/api/data/processCSV.php', formData);
      if (response.data.message) {
        setMessage({ message: response.data.message, status: response.data.status });
      }

      response && fetchMeta();
      fetchData()
      setMeta(response.data);

    } catch (error) {
      console.log(error)
      if (error.response.data.error) {
        setMessage({ message: error.response.data.error, status: 'error' });
      }
    } finally {
      setIsDataLoaded(true);
    }
  };

  const handleUpdateMeta = (e) => {
    setUpdateMeta(e);
  }

  const handleSubmitHome = async () => {
    setIsDataLoaded(false);
    try {
      const response = await api('put', '/api/meta/meta.php', { meta: updateMeta });
      fetchMeta();
      if (response.data.message) {
        setMessage({ message: response.data.message, status: 'success' });
      }
    } catch (error) {
      console.log(error)
      if (error.response.data.error) {
        setMessage({ message: error.response.data.error, status: 'error' });
      }
    } finally {
      setIsDataLoaded(true);
    }
  }

  return (
    <HomeContext.Provider value={{
      data,
      fetchData,
      meta,
      fetchMeta,
      isDataLoaded,
      setIsDataLoaded,
      updateMeta,
      handleUpdateMeta,
      handleUpload,
      handleFileChange,
      handleSubmitHome,
    }}>
      {props.children}
    </HomeContext.Provider>
  );
};
