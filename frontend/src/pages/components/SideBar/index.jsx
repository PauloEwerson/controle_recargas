import React, { useContext } from "react";

import logo from "../../../assets/logo-v-cor-borda.png";
import { RxDashboard } from "react-icons/rx";
import { GiChampions } from "react-icons/gi";
import { AiOutlineUserAdd, AiFillSetting } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { AuthContext } from "../../../context/AuthContext";
import "./sidebar.css";

import { createBrowserHistory } from "history";

const Menu = ({
  selectedOption,
  setSelectedOption,
  currentUser,
  reuseOperators,
  hasData,
}) => {
  const history = createBrowserHistory();

  const handleOptionClick = (option) => {
    if (option === "Sair") {
      logout();
      return;
    }

    setSelectedOption(option);
    let route = "#";
    switch (option) {
      case "Dashboard":
        route = "#";
        break;
      case "Operadores":
        route = "#";
        break;
      case "Ranking":
        route = "#";
        break;
      case "Usuários":
        route = "#";
        break;
      default:
        break;
    }
    history.push(route);
  };

  const { logout } = useContext(AuthContext);

  const options = [
    {
      name: "Dashboard",
      component: <RxDashboard />,
    },
    {
      name: "Ranking",
      component: <GiChampions />,
    },
  ];

  // Adiciona "Operadores" apenas se reuseOperators for false
  if (!reuseOperators) {
    options.push({
      name: "Operadores",
      component: <AiOutlineUserAdd />,
    });
  }

  // Adicionando a opção Usuários se o perfil for admin
  if (currentUser === "admin") {
    options.push({
      name: "Usuários",
      component: <AiFillSetting />,
    });
  }

  // Adicione a opção "Sair" ao final
  options.push({
    name: "Sair",
    component: <BiLogOut />,
  });

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="Logo Atacadão" />
      </div>
      <ul className="list-unstyled components">
        {options.map((option) => (
          <li className={`
            active
            ${!hasData && option.name === "Ranking" ? ("disabled-button") : ("")}
          `} key={option.name}>
            <div className="menu-content">
              <span
                className={`${
                  selectedOption === option.name ? "text-warning" : ""
                }`}
              >
                {option.component}
              </span>
              <button
                disabled={!hasData && option.name === "Ranking"}
                className={`nav-link ${
                  selectedOption === option.name ? ("text-warning") : ("")
                }`}
                onClick={() => handleOptionClick(option.name)}
              >
                {option.name}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Menu;
