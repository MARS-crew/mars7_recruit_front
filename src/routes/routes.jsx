import { Routes, Route } from 'react-router-dom';
import Test from "../pages/test";
import Home from "../pages/home";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/test" element={<Test />} />
    </Routes>
  );
}