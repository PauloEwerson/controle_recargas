import React, { useState, useEffect } from "react";

import './styles.css'

import { BsFillPersonLinesFill } from "react-icons/bs";

const Title = ({ selectedOption, name }) => {
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    if (name !== undefined) {
      const firstName = name.includes(" ")
        ? name.split(" ")[0] + " " + name.split(" ")[1]
        : name.split(" ")[0];
      setFirstName(firstName);
    }
  }, [name]);

  return (
    <section
      className="title-section"
    >
      <h1 className="h2">{selectedOption}</h1>
      {firstName && (
      <div className="title-section-user">
        <BsFillPersonLinesFill className="user-icon" size={20} />
        <h1 className="h4">{`${firstName}`}</h1>
      </div>
      )}
    </section>
  );
};

export default Title;
