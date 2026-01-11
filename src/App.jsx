import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/App.css'
import AppRoutes from './routes/routes';
import BottomNavBar from './components/BottomNavBar';

function App() {

  return (
    <BrowserRouter>
      <div className="app-container">
        <main className="main-content">
          <AppRoutes/>
        </main>
        <BottomNavBar/>
      </div>
    </BrowserRouter>
  );
}

export default App
