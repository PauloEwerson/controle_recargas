import React, { useState, useEffect } from "react";

import api from "../../../api";

import "./styles.css";

const LastUploadData = () => {
  const [lastUploadDate, setLastUploadDate] = useState(null);

  useEffect(() => {
    const fetchLastUploadDate = async () => {
      try {
        const { data } = await api("get", "/api/data/last_upload.php");

        if (data && data.last_updated) {
          setLastUploadDate(new Date(data.last_updated).toLocaleString());
        }
      } catch (error) {
        console.error("Error fetching the last upload date:", error);
      }
    };

    fetchLastUploadDate();
  }, []);

  if (!lastUploadDate) return null;

  return (
    <section className="lastUpload-section">
      <p>Última Atualização</p>
      <p>{lastUploadDate}</p>
    </section>
  );
};

export default LastUploadData;
