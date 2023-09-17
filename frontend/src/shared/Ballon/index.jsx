import React, { useContext, useState, useRef, useEffect } from "react";

import { HomeContext } from "../../context/HomeContext";
import { AuthContext } from "../../context/AuthContext";

import LastUploadData from "./LastUploadData";

import AddMetas from "./addMetas";
import UploadCSV from "./ImportCSV";
import GenerateReport from "../GenerateReport";

import { BsArrowUpCircleFill } from "react-icons/bs";
import "./styles.css";
import api from "../../api";

const Ballon = () => {
  const [fileName, setFileName] = useState("Selecione");
  const [isOpen, setIsOpen] = useState(false);

  const { handleFileChange } = useContext(HomeContext);
  const { userData } = useContext(AuthContext);

  const balloonRef = useRef(null);

  const handleFileChangeName = (event) => {
    setFileName(event.target.files[0].name);
    handleFileChange(event.target.files[0]);
  };

  // const handleGenerateCSV = async () => {
  //   const response = await api('get', '/api/data/download_demo_csv.php');
  //   console.log(response)
  // };

  const handleGenerateCSV = async () => {
    try {
        const response = await api('get', '/api/data/download_demo_csv.php');

        if (response && response.data) {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'demo.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    } catch (error) {
        console.error("Erro ao baixar o CSV: ", error);
    }
};


  const toggleAside = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (balloonRef.current && !balloonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={balloonRef}>
      <section className={`ballon-open ${isOpen ? "open" : "closed"}`}>
        <span
          className={`arrow-${isOpen ? "open" : "closed"}`}
          onClick={toggleAside}
        >
          <BsArrowUpCircleFill />
        </span>
        {isOpen && (
          <div className="btn-Ballon">
            <UploadCSV
              fileName={fileName}
              handleFileChangeName={handleFileChangeName}
              handleGenerateCSV={handleGenerateCSV}
              ambient={userData.ambient}
            />
            <hr />
            <LastUploadData />
            <hr />
            <AddMetas />
            <hr />
            <GenerateReport />
          </div>
        )}
      </section>
    </div>
  );
};

export default Ballon;
