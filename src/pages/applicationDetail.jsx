import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Profile from "../icon/Profile.png";
import { getMyResumeDetail, getRecruitDetail } from "../api/resume";

function StatusPill({ status }) {
  const map = {
    FAIL: { label: "불합격", border: "#FF4D4D", bg: "#FFECEC", color: "#FF4D4D" },
    PASS: { label: "합격", border: "#2B7FFF", bg: "#E8F1FF", color: "#2B7FFF" },
    INPROGRESS: { label: "심사중", border: "#CFCFCF", bg: "#F5F5F5", color: "#888" },
  };

  const s = map[status] ?? map.INPROGRESS;

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
  const location = useLocation();

  const recruitId =
    location.state?.recruitId ??
    new URLSearchParams(location.search).get("recruitId");

  const [detail, setDetail] = useState(null);
  const [fetched, setFetched] = useState(false);
  const [recruitTitle, setRecruitTitle] = useState("");

  const safeStatus = (v) => {
    const s = (v ?? "").toString().trim();
    return s ? s : null;
  };

  const savedStatus = () => {
    try {
      const map = JSON.parse(localStorage.getItem("resumeStatusMap") || "{}");
      const item = map[String(id)];
      const s1 = safeStatus(typeof item === "string" ? item : item?.status);
      if (s1) return s1;

      const rmap = JSON.parse(localStorage.getItem("resumeRecruitIdMap") || "{}");
      const recruitId = rmap[String(id)];
      const s2 = recruitId ? safeStatus(localStorage.getItem(`resumeStatus:${recruitId}:${id}`)) : null;
      return s2;
    } catch (e) {
      return null;
    }
  };

  const mergedStatus = safeStatus(detail?.status) || savedStatus() || "INPROGRESS";

  useEffect(() => {
    if (!id) {
      setDetail(null);
      setFetched(true);
      return;
    }

    const fetchDetail = async () => {
      try {
        const res = await getMyResumeDetail(id);
        setDetail(res.data.data);

        const incoming = res?.data?.data;
        const t = (incoming?.recruitTitle ?? "").toString().trim();
        if (t) {
          setRecruitTitle(t);
        } else if (recruitId) {
          try {
            const r = await getRecruitDetail(recruitId);
            setRecruitTitle((r?.data?.data?.title ?? "").toString());
          } catch {
            setRecruitTitle("");
          }
        } else {
          setRecruitTitle("");
        }
      } catch (e) {
        console.error("내 지원서 상세 조회 실패", e);
        setDetail(null);
        setRecruitTitle("");
      } finally {
        setFetched(true);
      }
    };

    fetchDetail();
  }, [id, recruitId]);

  if (!detail) {
    return (
      <div style={{ paddingBottom: 40 }}>
        <Header title="지원서 조회" leftAction={() => navigate(-1)} />
        <div style={{ padding: 20 }}>
          <p>지원서를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 40 }}>
      <Header title="지원서 조회" leftAction={() => navigate(-1)} />

      <div style={{ padding: 20 }}>
        {/* 상태 */}
        <div style={{ marginBottom: 14 }}>
          <StatusPill status={mergedStatus} />
        </div>

        {/* 제목 */}
        <h2
          style={{
            margin: "8px 0 10px",
            fontSize: 20,
            fontWeight: 600,
            marginBottom: 5,
          }}
        >
          {detail.title}
        </h2>
        {recruitTitle ? (
          <div
            style={{
              color: "rgba(164, 164, 164,1)",
              fontSize: 14,
              fontWeight: 500,
              marginBottom: 30,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {recruitTitle}
          </div>
        ) : (
          <div style={{ height: 30 }} />
        )}

        {/* 프로필 */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 79,
              height: 79,
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <img
              src={detail.profileImage || Profile}
              alt="프로필"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>
              {detail.name}
            </div>
            <div style={{ color: "#A4A4A4", marginTop: 6, fontSize: 14, fontWeight: 400 }}>
              {detail.gender === "F" ? "여자" : detail.gender === "M" ? "남자" : detail.gender}
              {detail.age ? ` · ${detail.age}세` : ""}
              {detail.major ? ` / ${detail.major}` : ""}
              {detail.grade ? ` ${detail.grade}학년` : ""}
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: "#F5F5F5", margin: "30px 0 20px" }} />

        {/* 주소, 연락처 */}
        <div style={{ display: "grid", rowGap: 14 }}>
          <div style={{ display: "flex", gap: 24 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 400,
                width: 64,
                color: "rgba(158, 163, 178,1)",
              }}
            >
              주소
            </div>
            <div style={{ fontSize: 14, fontWeight: 400, color: "#222" }}>
              {detail.address || "-"}
            </div>
          </div>

          <div style={{ display: "flex", gap: 24 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 400,
                width: 64,
                color: "rgba(158, 163, 178,1)",
              }}
            >
              연락처
            </div>
            <div style={{ fontSize: 14, fontWeight: 400, color: "#222" }}>
              {detail.phoneNumber || "-"}
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: "#F5F5F5", margin: "20px 0" }} />

        {/* 자기소개 */}
        <div>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 12, color: "#212121" }}>
            자기소개
          </div>
          <p
            style={{
              fontWeight: 400,
              fontSize: 14,
              margin: 0,
              lineHeight: 1.7,
              color: "#000000",
              whiteSpace: "pre-wrap",
            }}
          >
            {detail.selfIntroduce || ""}
          </p>
        </div>
      </div>
    </div>
  );
}