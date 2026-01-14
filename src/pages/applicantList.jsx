import BottomNavBar from "../components/BottomNavBar";
import Header from "../components/Header";
import Profile from "../icon/Profile.png";

const mockApplicants = [
  {
    id: 1,
    name: "진선정",
    gender: "여자",
    age: 22,
    major: "컴퓨터소프트웨어공학과",
    grade: "3학년",
    appliedAt: "2025.12.23",
  },
  {
    id: 2,
    name: "진선정",
    gender: "여자",
    age: 22,
    major: "컴퓨터소프트웨어공학과",
    grade: "3학년",
    appliedAt: "2025.12.23",
  },
];

export default function ApplicantList() {
  return (
    <div style={{ paddingBottom: 72 }}>
      <Header title="지원자 목록" />

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {mockApplicants.map((applicant) => (
          <li
            key={applicant.id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "16px",
              borderBottom: "1px solid #eee",
            }}
          >

            {/* 프로필 이미지 */}
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
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* 정보 영역 */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", fontSize: 16 }}>
                {applicant.name}
                <span style={{ color: "#888", fontWeight: "normal", marginLeft: 8 }}>
                  {applicant.gender} · {applicant.age}세
                </span>
              </div>

              <div style={{ color: "#666", fontSize: 14, marginTop: 4 }}>
                {applicant.major} ({applicant.grade})
              </div>
            </div>

            {/* 지원 날짜 */}
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