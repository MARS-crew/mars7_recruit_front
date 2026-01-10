import { Routes, Route } from "react-router-dom";
import Test from "../pages/test";
import Home from "../pages/home";
import Login from "../pages/Login";
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/test" element={<Test />} />
    </Routes>
  );
}
