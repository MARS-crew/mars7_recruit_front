import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/header";
import Profile from "../icon/Profile.png";

// 더미 데이터
const mockApplicationDetails = [
  {
    id: 1,
    status: "reject",
    title: "어떤 일이든 최선을 다하겠습니다.",
    summary: "2026년도 전공동아리 ONE 신입 부원 모집",
    name: "진선정",
    gender: "여자",
    age: 22,
    major: "컴퓨터소프트웨어공학과",
    grade: "3학년",
    address: "경기도 광명시",
    phone: "010-0000-0000",
    intro: "첫 번째 자기소개입니다.",
  },
  {
    id: 2,
    status: "pass",
    title: "어떤 일이든 최선을 다하겠습니다.",
    summary: "2026년도 전공동아리 ONE 신입 부원 모집",
    name: "진선정",
    gender: "여자",
    age: 22,
    major: "컴퓨터소프트웨어공학과",
    grade: "3학년",
    address: "경기도 광명시",
    phone: "010-0000-0000",
    intro: "두 번째 자기소개입니다.",
  },
  {
    id: 3,
    status: "pending",
    title: "어떤 일이든 최선을 다하겠습니다.",
    summary: "2026년도 전공동아리 ONE 신입 부원 모집",
    name: "진선정",
    gender: "여자",
    age: 22,
    major: "컴퓨터소프트웨어공학과",
    grade: "3학년",
    address: "경기도 광명시",
    phone: "010-0000-0000",
    intro: "세 번째 자기소개입니다.",
  },
];

function StatusPill({ status }) {
  const map = {
    reject: { label: "불합격", border: "#FF4D4D", bg: "#FFECEC", color: "#FF4D4D" },
    pass: { label: "합격", border: "#2B7FFF", bg: "#E8F1FF", color: "#2B7FFF" },
    pending: { label: "심사중", border: "#CFCFCF", bg: "#F5F5F5", color: "#888" },
  };
  const s = map[status] ?? map.pending;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 77,
        height: 32,
        padding: "0 14px",
        borderRadius: 999,
        border: `1.5px solid ${s.border}`,
        background: s.bg,
        color: s.color,
        fontWeight: 500,
        fontSize: 13,
        flexShrink: 0,
      }}
    >
      {s.label}
    </span>
  );
}

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const detail = useMemo(() => {
    const numId = Number(id);
    return mockApplicationDetails.find((a) => a.id === numId);
  }, [id]);

  if (!detail) {
    return (
      <div
        style={{
          paddingBottom: 40,
        }}
      >
        <Header title="지원자 조회" leftAction={() => navigate(-1)} />
        <div style={{ padding: 24 }}>
          <p>지원서를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        paddingBottom: 40,
      }}
    >
      <Header title="지원자 조회" leftAction={() => navigate(-1)} />

      <div style={{ padding: 24 }}>
        {/* 상태 */}
        <div style={{ marginBottom: 14 }}>
          <StatusPill status={detail.status} />
        </div>

        {/* 제목 */}
        <h2 style={{ margin: "8px 0 10px", fontSize: 20, fontWeight: 600, marginBottom: 5 }}>{detail.title}</h2>
        <div style={{ color: "#8A8FA3", fontSize: 14, fontWeight: 500, marginBottom: 30 }}>
          {detail.summary}
        </div>

        {/* 프로필 */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 79,
              height: 79,
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
            <div style={{ fontWeight: 600, fontSize: 16 }}>{detail.name}</div>
            <div style={{ color: "#888", marginTop: 6, fontSize: 13 }}>
              {detail.gender} · {detail.age}세 / {detail.major} {detail.grade}
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: "#eee", margin: "40px 0 20px" }} />

        {/* 주소, 연락처 */}
        <div style={{ display: "grid", rowGap: 14 }}>
          <div style={{ display: "flex", gap: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 400, width: 64, color: "#999" }}>주소</div>
            <div style={{ fontSize: 14, fontWeight: 400, color: "#222" }}>{detail.address}</div>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 400, width: 64, color: "#999" }}>연락처</div>
            <div style={{ fontSize: 14, fontWeight: 400, color: "#222" }}>{detail.phone}</div>
          </div>
        </div>

        <div style={{ height: 1, background: "#eee", margin: "20px 0" }} />

        {/* 자기소개 */}
        <div>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}>
            자기소개
          </div>
          <p style={{ fontWeight: 400, fontSize: 14, margin: 0, lineHeight: 1.7, color: "#333" }}>{detail.intro}</p>
        </div>

      </div>
    </div>
  );
}