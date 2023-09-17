import React from "react";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>Desenvolvido por Paulo Ewerson - CPD 199 Patos</p>
    </footer>
  );
};

const styles = {
  footer: {
    background: "#9a9a9a",
    color: "#fff",
    padding: "10px",
    textAlign: "right",
    bottom: "0",
    width: "100%",
  },
  text: {
    margin: "0",
  },
};

export default Footer;
