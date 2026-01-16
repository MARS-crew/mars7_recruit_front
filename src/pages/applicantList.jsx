import { useNavigate } from "react-router-dom";
import BottomNavBar from "../components/BottomNavBar";
import Header from "../components/header";
import Profile from "../icon/Profile.png";

const mockApplicants = [
  {
    id: 1,
    name: "진선정",
    gender: "여자",
    age: 22,
    major: "컴퓨터소프트웨어공학과",
    grade: "3학년",
    title: "어떤 일이든 최선을 다하겠습니다.",
    address: "경기도 광명시",
    phone: "010-0000-0000",
    intro: "첫 번째 자기소개입니다.",
  },
  {
    id: 2,
    name: "진선정",
    gender: "여자",
    age: 22,
    major: "컴퓨터소프트웨어공학과",
    grade: "3학년",
    title: "열심히 하겠습니다.",
    address: "서울특별시",
    phone: "010-0000-0000",
    intro: "두 번째 자기소개입니다.",
  },
];

export default function ApplicantList() {
  const navigate = useNavigate();

  return (
    <div style={{ paddingBottom: 72 }}>
      <Header title="지원자 목록" />

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {mockApplicants.map((applicant) => (
          <li
            key={applicant.id}
            onClick={() => navigate(`/applicants/${applicant.id}`)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "16px",
              borderBottom: "1px solid #eee",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                overflow: "hidden",
                marginRight: 16,
                flexShrink: 0,
              }}
            >
              <img
                src={Profile}
                alt="프로필"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", fontSize: 16 }}>
                {applicant.name}
                <span
                  style={{ color: "#888", fontWeight: "normal", marginLeft: 8 }}
                >
                  {applicant.gender} · {applicant.age}세
                </span>
              </div>

              <div style={{ color: "#666", fontSize: 14, marginTop: 4 }}>
                {applicant.major} ({applicant.grade})
              </div>
            </div>

            <div style={{ fontSize: 12, color: "#bbb" }}>
              {applicant.appliedAt}
            </div>
          </li>
        ))}
      </ul>

      <BottomNavBar />
    </div>
  );
}