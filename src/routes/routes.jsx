import { Routes, Route } from "react-router-dom";
import Test from "../pages/Test";
import Home from "../pages/Home";
import Clubs from "../pages/Clubs";
import Applications from "../pages/applications";
import Schedule from "../pages/Schedule";
import MyPage from "../pages/MyPage";
import Login from "../pages/Login";
import ApplicantList from "../pages/applicantList";
import ApplicantDetail from "../pages/applicantDetail";
import Notice from "../pages/notice";
import SignUpDetail from "../pages/signUpDetail";
import Findpw from "../pages/findPw";
import SignUp from "../pages/signUp";
import TermsDetail from "../pages/termsDetail";
import PushTermsDetail from "../pages/pushTermsDetail";
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
      <Route path="/applicants" element={<ApplicantList />} />
      <Route path="/applicants/:id" element={<ApplicantDetail />} />
      <Route path="/notice" element={<Notice />} />
      <Route path="/findpw" element={<Findpw />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signupdetail" element={<SignUpDetail />} />
      <Route path="/termsDetail" element={<TermsDetail />} />/
      <Route path="/pushTermsDetail" element={<PushTermsDetail />} />
    </Routes>
  );
}
