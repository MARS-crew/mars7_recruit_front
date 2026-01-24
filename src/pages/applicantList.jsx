import { useLocation, useNavigate } from "react-router-dom";
import BottomNavBar from "../components/BottomNavBar";
import Header from "../components/Header";
import Profile from "../icon/Profile.png";
import { useEffect, useState } from "react";
import { getApplicants } from "../api/resume";

export default function ApplicantList() {
  const navigate = useNavigate();
  const location = useLocation();
  const recruitId =
    location.state?.recruitId ??
    Number(new URLSearchParams(location.search).get("recruitId") ?? 1);
  const [applicants, setApplicants] = useState([]);

useEffect(() => {
  const fetchApplicants = async () => {
    try {
      const res = await getApplicants(recruitId);
      const list = res?.data?.data ?? [];
      setApplicants(list);
    } catch (e) {
      console.error("지원자 목록 조회 실패", e);
      setApplicants([]);
    }
  };

  fetchApplicants();
}, [recruitId]);

  return (
    <div style={{ paddingBottom: 72 }}>
      <Header title="지원자 목록" />

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {applicants.map((applicant) => (
          <li
            key={applicant.resumeId}
            onClick={() =>
              navigate(`/applicants/${applicant.resumeId}?recruitId=${recruitId}`, {
                state: { recruitId },
              })
            }
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
                width: 62,
                height: 62,
                borderRadius: "50%",
                overflow: "hidden",
                marginRight: 16,
                flexShrink: 0,
              }}
            >
              {/* 프로필 */}
              <img
                src={applicant.profileImage || Profile}
                alt="프로필"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", fontSize: 14, fontWeight: 700 }}>
                {applicant.name}
                <span
                  style={{ color: "#888", fontWeight: "normal", marginLeft: 8, fontSize: 11, fontWeight: 500 }}
                >
                  {applicant.gender === "F" ? "여자" : "남자"} · {applicant.age}세
                </span>
              </div>

              <div style={{ color: "#666", fontSize: 12, fontWeight: 500, marginTop: 4 }}>
                {applicant.major} ({applicant.grade}학년)
              </div>
            </div>

            <div style={{ fontSize: 12, color: "#bbb" }}>
              {applicant.createdAt
                ? new Date(applicant.createdAt).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                : ""}
            </div>
          </li>
        ))}
      </ul>

      <BottomNavBar />
    </div>
  );
}