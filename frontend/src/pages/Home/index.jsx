import React from "react";
import CountUp from "../components/CountUp";
import SalesTable from "../components/SalesTable";
import "./styles.css";

const HomePage = () => {
  
  return (
    <div className="home-page">
      <CountUp />
      <SalesTable />
    </div>
  );
};

export default HomePage;
