import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Profile from "../icon/Profile.png";
import { getMyResumeDetail } from "../api/resume";

function StatusPill({ status }) {
  const map = {
    FAIL: { label: "불합격", border: "#FF4D4D", bg: "#FFECEC", color: "#FF4D4D" },
    PASS: { label: "합격", border: "#2B7FFF", bg: "#E8F1FF", color: "#2B7FFF" },
    INPROGRESS: { label: "심사중", border: "#CFCFCF", bg: "#F5F5F5", color: "#888" },

    reject: { label: "불합격", border: "#FF4D4D", bg: "#FFECEC", color: "#FF4D4D" },
    pass: { label: "합격", border: "#2B7FFF", bg: "#E8F1FF", color: "#2B7FFF" },
    pending: { label: "심사중", border: "#CFCFCF", bg: "#F5F5F5", color: "#888" },
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
  const { id } = useParams(); // resumeId
  const navigate = useNavigate();

  const [detail, setDetail] = useState(null);
  const [fetched, setFetched] = useState(false);

  // API 필드명이 케이스마다 달라서 화면용으로만 안전하게 fallback 처리
  const displayName = detail?.name ?? detail?.userName ?? "";
  const displayPhone = detail?.phone ?? detail?.phoneNumber ?? "";
  const displayIntro = detail?.intro ?? detail?.selfIntroduce ?? "";
  const displayProfile = detail?.profileImageUrl ?? detail?.profileImage ?? "";
  const displayAddress = detail?.address ?? "";

  useEffect(() => {
    if (!id) {
      setDetail(null);
      setFetched(true);
      return;
    }

    const fetchDetail = async () => {
      try {
        const res = await getMyResumeDetail(id);
        const payload = res?.data?.data ?? res?.data;
        setDetail(payload ?? null);
      } catch (e) {
        console.error("내 지원서 상세 조회 실패", e);
        setDetail(null);
      } finally {
        setFetched(true);
      }
    };

    fetchDetail();
  }, [id]);

  if (!detail) {
    return (
      <div style={{ paddingBottom: 40 }}>
        <Header title="지원서 조회" leftAction={() => navigate(-1)} />
        <div style={{ padding: 24 }}>
          <p>지원서를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 40 }}>
      <Header title="지원서 조회" leftAction={() => navigate(-1)} />

      <div style={{ padding: 24 }}>
        {/* 상태 */}
        <div style={{ marginBottom: 14 }}>
          <StatusPill status={detail.status} />
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

        {/* 공고/요약 */}
        {detail.summary || detail.recruitTitle ? (
          <div
            style={{
              color: "#8A8FA3",
              fontSize: 14,
              fontWeight: 500,
              marginBottom: 30,
            }}
          >
            {detail.summary ?? detail.recruitTitle}
          </div>
        ) : null}

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
              src={displayProfile || Profile}
              alt="프로필"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>
              {displayName}
            </div>
            <div style={{ color: "#888", marginTop: 6, fontSize: 13 }}>
              {detail.gender === "F" ? "여자" : detail.gender === "M" ? "남자" : detail.gender}
              {detail.age ? ` · ${detail.age}세` : ""}
              {detail.major ? ` / ${detail.major}` : ""}
              {detail.grade ? ` ${detail.grade}학년` : ""}
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: "#eee", margin: "40px 0 20px" }} />

        {/* 주소, 연락처 */}
        <div style={{ display: "grid", rowGap: 14 }}>
          <div style={{ display: "flex", gap: 24 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 400,
                width: 64,
                color: "#999",
              }}
            >
              주소
            </div>
            <div style={{ fontSize: 14, fontWeight: 400, color: "#222" }}>
              {displayAddress || "-"}
            </div>
          </div>

          <div style={{ display: "flex", gap: 24 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 400,
                width: 64,
                color: "#999",
              }}
            >
              연락처
            </div>
            <div style={{ fontSize: 14, fontWeight: 400, color: "#222" }}>
              {displayPhone || "-"}
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: "#eee", margin: "20px 0" }} />

        {/* 자기소개 */}
        <div>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}>
            자기소개
          </div>
          <p
            style={{
              fontWeight: 400,
              fontSize: 14,
              margin: 0,
              lineHeight: 1.7,
              color: "#333",
              whiteSpace: "pre-wrap",
            }}
          >
            {displayIntro}
          </p>
        </div>
      </div>
    </div>
  );
}