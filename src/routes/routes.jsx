import { Routes, Route } from 'react-router-dom';
import Test from "../pages/test";
import Home from "../pages/home";
import Clubs from "../pages/clubs";
import Applications from "../pages/applications";
import Schedule from "../pages/schedule";
import MyPage from "../pages/mypage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/clubs" element={<Clubs />} />
      <Route path="/applications" element={<Applications />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/test" element={<Test />} />
    </Routes>
  );
}