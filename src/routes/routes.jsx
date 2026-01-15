import { Routes, Route } from "react-router-dom";
import Test from "../pages/Test";
import Home from "../pages/Home";
import Clubs from "../pages/clubs";
import Applications from "../pages/applications";
import Schedule from "../pages/Schedule";
import MyPage from "../pages/MyPage";
import Login from "../pages/Login";
import ApplicantList from "../pages/applicantList";
import ApplicantDetail from "../pages/applicantDetail";
import Notice from "../pages/notice";
import RecruitCreate from "../pages/RecruitCreate";
import Findpw from "../pages/findPw";
import ApplicationDetail from "../pages/applicationDetail"

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/clubs" element={<Clubs />} />
      <Route path="/applications" element={<Applications />} />
      <Route path="/applications/:id" element={<ApplicationDetail />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/test" element={<Test />} />
      <Route path="/login" element={<Login />} />
      <Route path="/applicants" element={<ApplicantList/>} />
      <Route path="/applicants/:id" element={<ApplicantDetail />} />
      <Route path="/notice" element={<Notice />} />
      <Route path="/recruit" element={<RecruitCreate />} />
      <Route path="/findpw" element={<Findpw />} />

    </Routes>
  );
}
