import React, { createContext, useState } from 'react';

export const ReportContext = createContext();

export const ReportProvider = (props) => {
  const [uniqueOperators, setUniqueOperators] = useState([]);

  const getUniqueOperators = async (data) => {
    setUniqueOperators([...new Set(data.map(item => item.operador))])
  }

  // Ordena operadores por valor de venda
  const sortedOperators = (data) => {
    return uniqueOperators.sort((a, b) => {
      const operatorDataA = data.filter(dataItem => dataItem.operador === a && dataItem.estado === "Efetuada PDV ");
      const operatorDataB = data.filter(dataItem => dataItem.operador === b && dataItem.estado === "Efetuada PDV ");
      return operatorDataB.reduce(
        (total, item) => total + Number(item.valor), 0
      ) - operatorDataA.reduce(
        (total, item) => total + Number(item.valor), 0
      );
    });
  }

  return (
    <ReportContext.Provider value={{
      getUniqueOperators,
      sortedOperators,
    }}>
      {props.children}
    </ReportContext.Provider>
  );
};
