import React, { useContext, useState } from "react";

import { HomeContext } from "../../../context/HomeContext";

import { AiOutlineUpload } from "react-icons/ai";

const UploadCSV = ({
  fileName,
  handleFileChangeName,
  handleGenerateCSV,
  ambient,
}) => {

  const { handleUpload } = useContext(HomeContext);
  
  const [selectedFile, setSelectedFile] = useState(false);

  return (
    <div>
      <form action="">
        <label htmlFor="csv_upload">Importar CSV</label>
        <div className="upload-btn">
          <input
            className="button-input"
            id="csv_upload"
            name="csv_upload"
            type="file"
            accept=".csv"
            onChange={(e) => {
              handleFileChangeName(e);
              setSelectedFile(true);
            }}
          />
          <button
            type="button"
            htmlFor="csv_upload"
            tabIndex="-1"
            title="Upload"
          >
            <AiOutlineUpload />
          </button>
          <input
            className="button-input"
            id="csv_name"
            name="csv_name"
            type="text"
            placeholder={fileName}
            disabled
          />
        </div>
        {ambient === "development" && (
          <button
            className="button-input"
            id="demo-csv-btn"
            type="button"
            onClick={handleGenerateCSV}
          >
            Gerar CSV Demo
          </button>
        )}
        <button
          className="button-input"
          id="reset-btn"
          type="button"
          onClick={handleUpload}
          disabled={!selectedFile}
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default UploadCSV;
