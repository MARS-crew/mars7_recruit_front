import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/App.css'
import AppRoutes from './routes/routes';

function App() {

  return (
    <BrowserRouter>
    <AppRoutes/>
    </BrowserRouter>
  );
}

export default App
