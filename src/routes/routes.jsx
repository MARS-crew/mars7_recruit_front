import { Routes, Route } from "react-router-dom";
import Test from "../pages/test";
import Home from "../pages/home";
import Clubs from "../pages/clubs";
import Applications from "../pages/applications";
import Schedule from "../pages/schedule";
import MyPage from "../pages/mypage";
import Login from "../pages/login";
import ApplicantList from "../pages/applicantList";
import ApplicantDetail from "../pages/applicantDetail";
import Notice from "../pages/notice";
import SignUpDetail from "../pages/signUpDetail";
import Findpw from "../pages/findPw";
import SignUp from "../pages/signUp";
import TermsDetail from "../pages/termsDetail";
import PushTermsDetail from "../pages/pushTermsDetail";
import ApplicationDetail from "../pages/applicationDetail";
import ApplicationForm from "../pages/applicationForm";
import ClubDetailPage from "../pages/ClubDetailPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/clubs" element={<Clubs />} />
      <Route path="/clubs/:id" element={<ClubDetailPage />} />
      <Route path="/applications" element={<Applications />} />
      <Route path="/applications/:id" element={<ApplicationDetail />}/>
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
      <Route path="/termsDetail" element={<TermsDetail />} />
      <Route path="/pushTermsDetail" element={<PushTermsDetail />} />
      <Route path="/applications/new" element={<ApplicationForm />}/>

    </Routes>
  );
}
