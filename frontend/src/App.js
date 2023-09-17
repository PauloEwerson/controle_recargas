import './App.css';
import React from 'react';

import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import {
  Layout,
  Login,
  PrivateRoute,
  Installation,
} from './pages';

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/home" element={<PrivateRoute />}>
            <Route index element={<Layout />} />
          </Route>
          <Route exact path="/install" element={<Installation />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
