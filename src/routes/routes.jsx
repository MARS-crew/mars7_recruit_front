import { Routes, Route } from 'react-router-dom';
import Test from "../pages/Test";
import Home from "../pages/Home";
import Clubs from "../pages/Clubs";
import Applications from "../pages/Applications";
import Schedule from "../pages/Schedule";
import MyPage from "../pages/MyPage";
import Login from "../pages/Login";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/clubs" element={<Clubs />} />
      <Route path="/applications" element={<Applications />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/test" element={<Test />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}