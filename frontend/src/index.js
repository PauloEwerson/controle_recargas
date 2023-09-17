import React from 'react';
import ReactDOM from 'react-dom/client';

import { MessageProvider } from './context/Message';
import { HomeProvider } from './context/HomeContext';
import { OperatorsProvider } from './context/OperatorsContext';
import { AuthProvider } from './context/AuthContext';
import { UsersProvider } from './context/UsersContext';

import App from './App';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.Fragment>
    <MessageProvider>
      <AuthProvider>
        <HomeProvider>
          <UsersProvider>
            <OperatorsProvider>
              <App />
            </OperatorsProvider>
          </UsersProvider>
        </HomeProvider>
      </AuthProvider>
    </MessageProvider>
  </React.Fragment>
);

