import React, { createContext, useState, useEffect } from 'react';

export const MessageContext = createContext();

export const MessageProvider = (props) => {
  const [message, setMessage] = useState({ message: '', status: '' });

  useEffect(() => {
    if (message.message) {
      setMessage({ message: '', status: '' });
    }
  }, [message]);

  return (
    <MessageContext.Provider value={{ message, setMessage }}>
      {props.children}
    </MessageContext.Provider>
  );
};
