import { useNavigate } from "react-router-dom";
import BottomNavBar from "../components/BottomNavBar";
import Nobackheader from "../components/nobackheader";

// 더미 데이터
const mockApplications = [
  {
    id: 1,
    status: "reject",
    title: "2026년도 전공동아리 ONE 신입...",
    summary: "어떤일이든 최선을 다하겠습니다. 포기하지 않는 지원자...",
    date: "2025.12.23",
  },
  {
    id: 2,
    status: "pass",
    title: "2026년도 전공동아리 ONE 신입...",
    summary: "어떤일이든 최선을 다하겠습니다. 포기하지 않는 지원자...",
    date: "2025.12.23",
  },
  {
    id: 3,
    status: "pending",
    title: "2026년도 전공동아리 ONE 신입...",
    summary: "어떤일이든 최선을 다하겠습니다. 포기하지 않는 지원자...",
    date: "2025.12.23",
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

export default function Applications() {
  const navigate = useNavigate();

  return (
    <div style={{ paddingBottom: 72 }}>
      <Nobackheader title = "지원서 목록"/>

      <div style={{ padding: "0 16px" }}>
        <div style={{ height: 10 }} />

        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {mockApplications.map((item) => (
            <li
              key={item.id}
              style={{
                borderBottom: "1px solid #eee",
                cursor: "pointer",
                userSelect: "none",
              }}
              onClick={() => navigate(`/applications/${item.id}`)}
            >
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                  padding: "18px 0 10px",
                }}
              >
                <StatusPill status={item.status} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#111",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.title}
                  </div>

                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 12,
                      color: "#8A8FA3",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.summary}
                  </div>
                </div>
              </div>

              <div
                style={{
                  paddingBottom: 14,
                  color: "#C9CDD6",
                  fontSize: 12,
                }}
              >
                {item.date}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <BottomNavBar />
    </div>
  );
}
