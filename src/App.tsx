import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import './App.css';

// Importation des composants
import Interface from './components/interface';

function App() {

  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Interface />} />

      </Routes>
    </Router>
  );
}

export default App;