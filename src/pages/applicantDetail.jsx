import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
    title: "어떤 일이든 최선을 다하겠습니다.",
    address: "경기도 광명시",
    phone: "010-0000-0000",
    intro:
      "첫 번째 자기소개입니다.",
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

export default function ApplicantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const applicant = useMemo(() => {
    const numId = Number(id);
    return mockApplicants.find((a) => a.id === numId);
  }, [id]);

  if (!applicant) {
    return (
      <div style={{ padding: 24 }}>
        <button onClick={() => navigate(-1)}>뒤로</button>
        <p style={{ marginTop: 12 }}>지원자를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 40 }}>
      <Header title="지원서 조회" leftAction={() => navigate(-1)} />

      <div style={{ padding: 24 }}>
        {/* 제목 */}
        <h2 style={{ margin: "8px 0 20px", fontSize: 20 }}>
          {applicant.title}
        </h2>

        {/* 프로필 */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
              background: "#FFC107",
            }}
          >
            <img
              src={Profile}
              alt="프로필"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{applicant.name}</div>
            <div style={{ color: "#888", marginTop: 6, fontSize: 13 }}>
              {applicant.gender} · {applicant.age}세 / {applicant.major}{" "}
              {applicant.grade}
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: "#eee", margin: "20px 0" }} />

        {/* 주소, 연락처 */}
        <div style={{ display: "grid", rowGap: 14 }}>
          <div style={{ display: "flex", gap: 24 }}>
            <div style={{ width: 64, color: "#999" }}>주소</div>
            <div style={{ color: "#222" }}>{applicant.address}</div>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            <div style={{ width: 64, color: "#999" }}>연락처</div>
            <div style={{ color: "#222" }}>{applicant.phone}</div>
          </div>
        </div>

        <div style={{ height: 1, background: "#eee", margin: "20px 0" }} />

        {/* 자기소개 */}
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>
            자기소개
          </div>
          <p style={{ margin: 0, lineHeight: 1.7, color: "#333" }}>
            {applicant.intro}
          </p>
        </div>

        {/* 하단 버튼 */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 48,
            justifyContent: "space-between",
          }}
        >
          <button
            type="button"
            onClick={() => alert("합격 처리(더미)")}
            style={{
              flex: 1,
              padding: "14px 0",
              borderRadius: 14,
              border: "1.5px solid #2B7FFF",
              background: "#E8F1FF",
              color: "#2B7FFF",
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            합격
          </button>

          <button
            type="button"
            onClick={() => alert("불합격 처리(더미)")}
            style={{
              flex: 1,
              padding: "14px 0",
              borderRadius: 14,
              border: "1.5px solid #FF4D4D",
              background: "#FFECEC",
              color: "#FF4D4D",
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            불합격
          </button>
        </div>
      </div>
    </div>
  );
}