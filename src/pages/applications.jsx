import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyResumes } from "../api/resume";
import { getRecruitDetail } from "../api/resume";
import BottomNavBar from "../components/BottomNavBar";
import Nobackheader from "../components/nobackheader";

function StatusPill({ status }) {
  const s = status ?? "INPROGRESS";

  const map = {
    INPROGRESS: { label: "심사중", border: "#CFCFCF", bg: "#F5F5F5", color: "#888" },
    PASS: { label: "합격", border: "#2B7FFF", bg: "#E8F1FF", color: "#2B7FFF" },
    FAIL: { label: "불합격", border: "#FF4D4D", bg: "#FFECEC", color: "#FF4D4D" },
  };

  const v = map[s] ?? map.INPROGRESS;

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
        border: `1.5px solid ${v.border}`,
        background: v.bg,
        color: v.color,
        fontWeight: 500,
        fontSize: 13,
        flexShrink: 0,
      }}
    >
      {v.label}
    </span>
  );
}

export default function Applications() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [recruitTitles, setRecruitTitles] = useState({});

  useEffect(() => {
    const fetchMyResumes = async () => {
      try {
        const res = await getMyResumes();
        const list = res?.data?.data ?? [];
        setItems(Array.isArray(list) ? list : []);
        // Fetch recruit titles
        const titles = {};
        await Promise.all(
          list.map(async (item) => {
            if (item.recruitId) {
              try {
                const r = await getRecruitDetail(item.recruitId);
                titles[item.recruitId] = r?.data?.data?.title ?? "";
              } catch {}
            }
          })
        );
        setRecruitTitles(titles);
      } catch (e) {
        console.error("내 지원서 목록 조회 실패", e);
        setItems([]);
      }
    };

    fetchMyResumes();
  }, []);

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";

  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
};

  return (
    <div style={{ paddingBottom: 72 }}>
      <Nobackheader title="지원서 목록" />

      <div style={{ padding: "0 16px" }}>
        <div style={{ height: 10 }} />

        {items.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: 60, color: "#9EA382", fontSize: 14 }}>
            아직 지원서가 없습니다.
          </div>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {items.map((item) => (
              <li
                key={item.resumeId}
                style={{
                  borderBottom: "1px solid #F5F5F5",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={() =>
                  navigate(`/applications/${item.resumeId}`, {
                    state: { recruitId: item.recruitId },
                  })
                }
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
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#111",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {recruitTitles[item.recruitId] || item.title}
                    </div>

                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 12,
                        fontWeight: 500,
                        color: "rgba(158, 163, 178,1)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.selfIntroduce}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    paddingBottom: 14,
                    color: "#D9D9D9",
                    fontSize: 10,
                  }}
                >
                  {formatDate(item.createdAt)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <BottomNavBar />
    </div>
  );
}
