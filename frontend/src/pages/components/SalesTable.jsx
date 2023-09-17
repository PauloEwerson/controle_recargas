import React, { useContext } from "react";
import { Table } from "react-bootstrap";
import { HomeContext } from "../../context/HomeContext";
import "./styles.css";

function SalesTable() {
  const { data } = useContext(HomeContext);

  const transactions = data.reduce((acc, transaction) => {
    if (!acc[transaction.estado]) {
      acc[transaction.estado] = {
        qty: 0,
        total: 0,
      };
    }
    acc[transaction.estado].qty++;
    acc[transaction.estado].total += Number(transaction.valor);
    return acc;
  }, {});

  // Cria as linhas da tabela
  const rows = Object.keys(transactions).map((estado) => (
    <tr key={estado}>
      <td>{estado}</td>
      <td>{transactions[estado].qty}</td>
      <td>{`R$ ${transactions[estado].total.toLocaleString()}`}</td>
    </tr>
  ));
  return (
    <div className="table-sales table-responsive">
      <Table striped bordered hover size="sm" className="text-center">
        <thead>
          <tr>
            <th>Estado</th>
            <th>Quantidade</th>
            <th>Valor Total</th>
          </tr>
        </thead>
        <tbody>{rows && rows}</tbody>
      </Table>
    </div>
  );
}

export default SalesTable;
