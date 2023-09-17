import React, { useContext, useState, useEffect } from "react";

import moment from "moment";
import Tooltip from "../../../shared/Tooltip";
import Loading from "../../../shared/Loading";

import { Modal } from "react-bootstrap";
import "./styles.css";

import { HomeContext } from "../../../context/HomeContext";

const CountUp = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { data, meta, isDataLoaded } = useContext(HomeContext);

  useEffect(() => {
    if (isDataLoaded) {
      setIsLoading(false);
    }
  }, [isDataLoaded, data.lengh, data]);

  // Função para abrir o modal
  const handleOpenModal = () => {
    setShowModal(true);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Passo 0: Dias do mês
  const today = moment().startOf("day");
  const firstDayOfMonth = moment().startOf("month");
  const numberOfDays = today.diff(firstDayOfMonth, "days") + 1;

  // Passo 1: calcula o total de vendas válidas por dia
  const totalSales = data.reduce((acc, transaction) => {
    if (transaction.estado === "Efetuada PDV ") {
      acc += Number(transaction.valor);
      return acc;
    }
    return acc;
  }, 0);

  // Passo 2: calcula as vendas do dia
  const dateNow = new Date();
  dateNow.setHours(0, 0, 0, 0);
  const todaySplit = dateNow.toISOString().split("T")[0];

  const todaySales = data.reduce((acc, transaction) => {
    const data = new Date(transaction.data);
    const dia = data.getUTCDate().toString().padStart(2, "0");
    const mes = (data.getUTCMonth() + 1).toString().padStart(2, "0");
    const ano = data.getUTCFullYear();
    const dataCorrigida = `${ano}-${mes}-${dia}`;

    if (
      (transaction.estado.trim() === "Efetuado PDV " ||
        transaction.estado.trim() === "Efetuada PDV " ||
        transaction.estado.trim() === "Efetuado PDV" ||
        transaction.estado.trim() === "Efetuada PDV") &&
      dataCorrigida === todaySplit
    ) {
      return acc + parseFloat(transaction.valor);
    }
    return acc;
  }, 0);

  // Stet 3 - Calcula a média de vendas por dia
  const averageSalesPerDay = totalSales / numberOfDays;

  // Passo 4: calcula quanto falta vender para alcançar a meta
  const remainingSales = meta - totalSales;

  // Passo 5: calcula a previsão para bater a meta (data)
  const todayDate = new Date();
  const daysRemaining = remainingSales / averageSalesPerDay;
  const projectedDate = new Date();
  projectedDate.setDate(todayDate.getDate() + daysRemaining);

  // Passo 6: calcular a porcentagem alcançada
  const percentageAchieved = ((totalSales / meta) * 100).toFixed(2);

  // Passo 7: Calcula a saúde da meta:
  let colorClass = "";
  const endOfMonth = moment().endOf("month");
  const daysLeft = endOfMonth.diff(today, "days");
  const dailyTarget = (meta - totalSales) / daysLeft;

  const daysOverProjected = moment(projectedDate).diff(endOfMonth, "days");

  if (totalSales > meta) {
    colorClass = "gold";
  } else if (daysOverProjected < -2) {
    colorClass = "green";
  } else if (daysOverProjected >= -2 && daysOverProjected < 0) {
    colorClass = "yellow";
  } else if (daysOverProjected >= 0 && daysOverProjected <= 1) {
    colorClass = "blue";
  } else if (daysOverProjected >= 2 && daysOverProjected < 5) {
    colorClass = "purple";
  } else if (daysOverProjected >= 5 && daysOverProjected < 10) {
    colorClass = "red";
  } else {
    colorClass = "dark_red";
  }

  const colorInformation = {
    dark_red: {
      description: "Muito improvável atingir a meta.",
      action: "Ação urgente necessária. Reavalie estratégias.",
      calculation:
        "Condição onde a projeção indica que levará 10 dias ou mais após o final do mês para alcançar a meta.",
    },
    red: {
      description: "Difícil atingir a meta.",
      action: "Reforce estratégias de venda.",
      calculation:
        "A projeção indica que levará entre 5 a 9 dias após o final do mês para alcançar a meta.",
    },
    purple: {
      description: "Possível atingir a meta, mas precisa de mais esforço.",
      action: "Aumente as iniciativas de vendas. Você está perto.",
      calculation:
        "A projeção indica que a meta será alcançada entre 2 a 4 dias após o final do mês.",
    },
    blue: {
      description: "Boa chance de atingir a meta, mas arriscado.",
      action: "Mantenha o ritmo. Ajuste se necessário.",
      calculation:
        "A projeção indica que a meta será alcançada entre o último dia do mês e o dia seguinte.",
    },
    yellow: {
      description: "No caminho para bater a meta.",
      action: "Um pequeno esforço adicional pode fazer a diferença.",
      calculation:
        "A projeção indica que a meta será alcançada até 2 dias antes do final do mês.",
    },
    green: {
      description: "No caminho para superar a meta.",
      action: "Mantenha o ritmo. Continue assim.",
      calculation:
        "A projeção indica que a meta será alcançada 3 dias ou mais antes do final do mês.",
    },
    gold: {
      description: "Meta superada.",
      action: "Parabéns, a meta foi superada.",
      calculation:
        "As vendas totais já superaram a meta estabelecida para o mês.",
    },
  };

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div id="countdown-wrap">
      <span className={`progress-bar-${colorClass}`}></span>

      <div id="goal">Meta R${meta.toLocaleString()}</div>

      <Tooltip title={colorInformation[colorClass].description}>
        <div id="glass">
          <div
            id="progress"
            className={`progress-bar-${colorClass}`}
            style={{ width: `${percentageAchieved}%`, cursor: "pointer" }}
            onClick={handleOpenModal}
          >
            {`${percentageAchieved === "NaN" ? "0,00" : percentageAchieved}%`}
          </div>

          <Modal show={showModal} onHide={handleCloseModal} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Informações da Barra de Progresso</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {Object.keys(colorInformation).map((color) => (
                <div key={color} className="mb-3 modal-flex-container">
                  <div
                    className={`progress-bar-color progress-bar-${color}`}
                  ></div>
                  <p className="modal-description">
                    <strong>{colorInformation[color].description}</strong>
                  </p>
                  <p className="modal-action">
                    <em>Sugestão:</em> {colorInformation[color].action}
                  </p>
                  <p className="modal-calculation">
                    <em>Cálculo:</em> {colorInformation[color].calculation}
                  </p>
                </div>
              ))}
            </Modal.Body>
            <Modal.Footer>
              <button onClick={handleCloseModal}>Fechar</button>
            </Modal.Footer>
          </Modal>
        </div>
      </Tooltip>

      <div className="goal-stat">
        <Tooltip title="Meta de vendas estabelecida para o dia atual.">
          <span className="goal-number">{`R$ ${dailyTarget.toLocaleString(
            undefined,
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
          )}`}</span>
          <span className="goal-label">Meta / dia</span>
        </Tooltip>
      </div>

      <div className="goal-stat">
        <Tooltip title="Total de vendas realizadas no dia atual.">
          <span className="goal-number">{`R$ ${todaySales.toLocaleString(
            undefined,
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
          )}`}</span>
          <span className="goal-label">Venda / dia</span>
        </Tooltip>
      </div>

      <div className="goal-stat">
        <Tooltip title="Média de vendas diárias ao longo do mês atual.">
          <span className="goal-number">{`R$ ${averageSalesPerDay.toLocaleString(
            undefined,
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
          )}`}</span>
          <span className="goal-label">Média / mês</span>
        </Tooltip>
      </div>

      <div className="goal-stat">
        <Tooltip title="Quantidade faltante para atingir a meta do mês.">
          <span className="goal-number">
            <div id="countdown"></div>
          </span>
          <span className="goal-number">{`R$ ${remainingSales.toLocaleString(
            undefined,
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
          )}`}</span>
          <span className="goal-label">Falta</span>
        </Tooltip>
      </div>

      <div className="goal-stat">
        <Tooltip title="Estimativa de quando a meta será alcançada mantendo o ritmo atual de vendas.">
          <span className="goal-number">
            {projectedDate.toLocaleDateString() === "Invalid Date"
              ? "Sem projeção"
              : projectedDate.toLocaleDateString()}
          </span>
          <span className="goal-label">Projeção</span>
        </Tooltip>
      </div>
    </div>
  );
};

export default CountUp;
