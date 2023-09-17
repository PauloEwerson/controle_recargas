import React, { useState, useRef, useEffect } from "react";
import "./styles.css";

const Tooltip = ({ children, title }) => {
  const [visible, setVisible] = useState(false);
  const parentRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    const parent = parentRef.current;
    const tooltip = tooltipRef.current;

    if (!parent || !tooltip) return;

    if (visible) {
      const parentRect = parent.getBoundingClientRect();
      tooltip.style.top = `${parentRect.top - tooltip.offsetHeight - 10}px`;
      tooltip.style.left = `${
        parentRect.left + parentRect.width / 2 - tooltip.offsetWidth / 2
      }px`;

      // Garante que o tooltip não saia da janela
      if (tooltip.getBoundingClientRect().right > window.innerWidth) {
        tooltip.style.left = `${
          window.innerWidth - tooltip.offsetWidth - 10
        }px`;
      }
    }
  }, [visible]);

  return (
    <div
      ref={parentRef}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <div
        ref={tooltipRef}
        className="tooltip"
        style={{
          visibility: visible ? "visible" : "hidden",
          opacity: visible ? 1 : 0,
        }}
      >
        {title}
      </div>
    </div>
  );
};

export default Tooltip;
