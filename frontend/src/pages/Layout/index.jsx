import React, { useState, useContext, useEffect } from "react";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";

import Sidebar from "../components/SideBar";

import Loading from "../../shared/Loading";
import Ballon from "../../shared/Ballon";
import Footer from "../../shared/Footer";
import Toast from "../../shared/Toast";

import Title from "./title";
import "./styles.css";

import { MessageContext } from "../../context/Message";
import { HomeContext } from "../../context/HomeContext";
import { OperatorsContext } from "../../context/OperatorsContext";
import { AuthContext } from "../../context/AuthContext";
import { UsersContext } from "../../context/UsersContext";

import { Home, Operadores, Report, Users } from "../../pages";

const Layout = () => {
  const [selectedOption, setSelectedOption] = useState("Dashboard");

  const {
    data,
    fetchData,
    fetchMeta,
    isDataLoaded,
    setIsDataLoaded
  } = useContext(HomeContext);

  const { fetchOperators, dataOperators } = useContext(OperatorsContext);
  const { userData, isAuthenticated } = useContext(AuthContext);
  const { fetchUsers } = useContext(UsersContext);
  const { message } = useContext(MessageContext);

  useEffect(() => {
    if (!isDataLoaded && data && data.length === 0) {
      fetchData();
      fetchMeta();
      fetchOperators();
      fetchUsers();
    } else if (data.length > 0) {
      setIsDataLoaded(true);
      fetchMeta();
      fetchOperators();
      fetchUsers();
    }
  }, []);

  useEffect(() => {
    if (isDataLoaded && !isAuthenticated) {
      window.location.href = "/login";
    }
  }, [isDataLoaded]);

  return (
    <div className="layout">
      {(!isDataLoaded && userData) && <Loading />}
        <div className="section-menu-main">
          <section className="menu">
            <Sidebar
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              currentUser={userData.perfil}
              reuseOperators={userData.reuseOperators}
              hasData={data.length > 0}
            />
          </section>
          <section className="main">
            <div className="main-content">
              <Title selectedOption={selectedOption} name={userData.name} />
              <div>
                {selectedOption === "Dashboard" && <Home />}
                {selectedOption === "Ranking" && (
                  <Report data={data} dataOperators={dataOperators} />
                )}
                {selectedOption === "Operadores" && <Operadores />}
                {selectedOption === "Usuários" && <Users />}
              </div>
            </div>
          </section>
        </div>
      <Toast message={message.message} status={message.status} />
      <span className="ballon">
        <Ballon />
      </span>
      <section className="footer">
        <Footer />
      </section>
    </div>
  );
};

export default Layout;
