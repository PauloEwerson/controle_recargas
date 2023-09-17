import React, { useContext } from "react";

import { HomeContext } from "../../../context/HomeContext";

import "./styles.css";

const AddMetas = () => {
  const { meta, updateMeta, handleUpdateMeta, handleSubmitHome } =
    useContext(HomeContext);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    handleSubmitHome();
    handleUpdateMeta("");
  };

  return (
    <section className="metas-section">
      <div className="metas">
        <h5>Meta de vendas: {meta.toLocaleString()}</h5>

        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            value={updateMeta}
            onInput={(event) => {
              const inputValue = event.target.value;
              // Não permite caracteres diferentes de números
              if (!isNaN(inputValue)) {
                // Remove pontos e vírgulas
                handleUpdateMeta(inputValue.replace(/[^0-9]/g, ""));
              }
            }}
          />
          <button type="submit" disabled={!updateMeta}>
            Atualizar Meta
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddMetas;
