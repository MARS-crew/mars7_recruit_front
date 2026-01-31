import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Header from "../components/Header";
import Profile from "../icon/Profile.png";
import { getResumeDetail, updateResumeStatus } from "../api/resume";

export default function ApplicantDetail() {
  const { id } = useParams();
  const location = useLocation();

  const resumeId = id;

  const recruitIdRaw =
    location.state?.recruitId ??
    new URLSearchParams(location.search).get("recruitId") ??
    sessionStorage.getItem(`recruitId:${resumeId}`) ??
    (() => {
      try {
        const map = JSON.parse(localStorage.getItem("resumeRecruitIdMap") || "{}");
        return map[String(resumeId)] ?? null;
      } catch {
        return null;
      }
    })();

  const recruitId = recruitIdRaw != null ? String(recruitIdRaw) : null;
  const recruitIdNum = recruitId ? Number(recruitId) : null;

  const [modalType, setModalType] = useState(null);
  const [applicant, setApplicant] = useState(null);

  const closeModal = () => setModalType(null);

  const safe = (v) => {
    const s = (v ?? "").toString().trim();
    return s ? s : null;
  };

  const readJson = (key) => {
    try {
      return JSON.parse(localStorage.getItem(key) || "{}");
    } catch {
      return {};
    }
  };

  const writeJson = (key, obj) => {
    try {
      localStorage.setItem(key, JSON.stringify(obj));
    } catch (e) {
      console.warn(`${key} 저장 실패`, e);
    }
  };

  const statusKey = recruitId ? `resumeStatus:${recruitId}:${resumeId}` : null;

  const getRecruitIdFromMap = () => {
    const map = readJson("resumeRecruitIdMap");
    return map[String(resumeId)] ?? null;
  };

  const setRecruitIdToMap = () => {
    if (!recruitId) return;
    const map = readJson("resumeRecruitIdMap");
    map[String(resumeId)] = String(recruitId);
    writeJson("resumeRecruitIdMap", map);
  };

  const getStatusFromMap = () => {
    const map = readJson("resumeStatusMap");
    const item = map[String(resumeId)];
    return safe(typeof item === "string" ? item : item?.status);
  };

  const setStatusToMap = (nextStatus) => {
    const map = readJson("resumeStatusMap");
    map[String(resumeId)] = {
      status: nextStatus,
      updatedAt: Date.now(),
      recruitId: recruitId ? String(recruitId) : null,
    };
    writeJson("resumeStatusMap", map);
  };

  const saveStatus = (nextStatus) => {
    try {
      if (statusKey) localStorage.setItem(statusKey, nextStatus);
    } catch (e) {
      console.warn("resumeStatus 저장 실패", e);
    }
    setRecruitIdToMap();
    setStatusToMap(nextStatus);
  };

  const loadStatus = () => {
    try {
      const v = statusKey ? localStorage.getItem(statusKey) : null;
      return safe(v) || getStatusFromMap();
    } catch {
      return getStatusFromMap();
    }
  };

  const mergedStatus = (serverStatus) => safe(serverStatus) || loadStatus();

  const handleConfirm = async () => {
    if (!modalType) return;

    if (!recruitId) {
      console.warn("recruitId가 없습니다.");
      return;
    }
    const status = modalType === "pass" ? "PASS" : "FAIL";

    try {
      await updateResumeStatus(recruitIdNum ?? recruitId, resumeId, status);
      saveStatus(status);

      setApplicant((prev) => (prev ? { ...prev, status: mergedStatus(status) } : prev));

      try {
        const refreshed = await getResumeDetail(resumeId);
        const base = refreshed?.data?.data ?? null;

        if (base) {
          setApplicant({ ...base, status: mergedStatus(base.status) });
        } else {
          setApplicant(base);
        }
      } catch (refreshErr) {
      }

      closeModal();
    } catch (e) {
      console.error("지원서 상태 업데이트 실패", e);
    }
  };

  useEffect(() => {
    if (!resumeId) {
      setApplicant(null);
      return;
    }
    if (recruitId) {
      sessionStorage.setItem(`recruitId:${resumeId}`, recruitId);
      setRecruitIdToMap();
    }

    const fetchDetail = async () => {
      try {
        const res = await getResumeDetail(resumeId);
        const base = res?.data?.data ?? null;

        if (base) {
          setApplicant({ ...base, status: mergedStatus(base.status) });
        } else {
          setApplicant(base);
        }
      } catch (e) {
        console.error("지원서 상세 조회 실패", e);
        setApplicant(null);
      }
    };

    fetchDetail();
  }, [resumeId, recruitId]);

  if (!applicant) {
    return (
      <div style={{ paddingBottom: 40 }}>
        <Header title="지원서 조회" />
        <div style={{ padding: 24 }}>
          <p>지원서를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
      }}
    >
      <Header title="지원서 조회" />

      <div style={{ padding: 24, paddingBottom: 120, flex: 1, overflow: "hidden" }}>
        {/* 제목 */}
        <h2
          style={{
            margin: "8px 0 10px",
            fontSize: 20,
            fontWeight: 600,
            marginBottom: 30,
          }}
        >
          {applicant.title}
        </h2>

        {/* 프로필 */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
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
              src={applicant.profileImageUrl || applicant.profileImage || Profile}
              alt="프로필"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>
              {applicant.userName ?? applicant.name ?? ""}
            </div>
            <div style={{ color: "#888", marginTop: 6, fontSize: 14, fontWeight: 400 }}>
              {applicant.gender === "F"
                ? "여자"
                : applicant.gender === "M"
                  ? "남자"
                  : applicant.gender}
              {applicant.age ? ` · ${applicant.age}세` : ""}
              {applicant.major ? ` / ${applicant.major}` : ""}
              {applicant.grade ? ` ${applicant.grade}학년` : ""}
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: "#F5F5F5", margin: "30px 0" }} />

        {/* 주소, 연락처 */}
        <div style={{ display: "grid", rowGap: 14 }}>
          <div style={{ display: "flex", gap: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 400, width: 64, color: "rgba(158, 163, 178, 1)" }}>
              주소
            </div>
            <div style={{ fontSize: 14, fontWeight: 400, color: "#212121" }}>
              {applicant.address ?? applicant.userAddress ?? "-"}
            </div>
          </div>

          <div style={{ display: "flex", gap: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 400, width: 64, color: "rgba(158, 163, 178, 1)" }}>
              연락처
            </div>
            <div style={{ fontSize: 14, fontWeight: 400, color: "#212121" }}>
              {applicant.phoneNumber ?? applicant.phone ?? "-"}
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: "#F5F5F5", margin: "30px 0" }} />

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
              overflow: "hidden"
            }}
          >
            {applicant.selfIntroduce ?? applicant.intro ?? ""}
          </p>
        </div>

        {/* 하단 버튼 */}
        <div
          style={{
            position: "fixed",
            left: 24,
            right: 24,
            bottom: 24,
            zIndex: 10,
            paddingBottom: "env(safe-area-inset-bottom)",
            display: "flex",
            gap: 8,
            justifyContent: "space-between",
            background: "#fff",
          }}
        >
          <button
            onClick={() => setModalType("pass")}
            style={{
              flex: 1,
              padding: "14px 0",
              borderRadius: 14,
              border: "1.5px solid #2572B9",
              background: "rgba(37, 114, 185, 0.2)",
              color: "#2572B9",
              fontWeight: 400,
              fontSize: 20,
            }}
          >
            합격
          </button>

          <button
            onClick={() => setModalType("fail")}
            style={{
              flex: 1,
              padding: "14px 0",
              borderRadius: 14,
              border: "1px solid #FF383C",
              background: "rgba(255, 56, 60, 0.2)",
              color: "#FF383C",
              fontWeight: 400,
              fontSize: 20,
            }}
          >
            불합격
          </button>
        </div>
      </div>

      {/* 모달 */}
      {modalType && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 24,
          }}
          onClick={closeModal}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 340,
              background: "#fff",
              borderRadius: 16,
              padding: 20,
              textAlign: "center",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: 28,
                height: 28,
                margin: "0 auto 12px",
                borderRadius: "50%",
                background: "#FFECEC",
                color: "#FF4D4D",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
              }}
            >
              !
            </div>

            <div style={{ fontWeight: 600, fontSize: 20 }}>
              {modalType === "pass"
                ? "해당 지원자를 합격시키시겠습니까?"
                : "해당 지원자를 불합격시키시겠습니까?"}
            </div>

            <div style={{ marginTop: 8, fontSize: 14, fontWeight: 400, lineHeight: 1.5 }}>
              취소가 불가능합니다.
              <br />
              신중하게 선택해주세요.
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button
                type="button"
                onClick={closeModal}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: 16,
                  border: "1px solid #EAEAEA",
                  background: "#fff",
                  fontWeight: 500,
                  fontSize: 16,
                }}
              >
                취소
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: 16,
                  border: "none",
                  border: "1px solid #EAEAEA",
                  background: modalType === "pass" ? "#2572B9" : "#FF383C",
                  color: "#fff",
                  fontWeight: 500,
                  fontSize: 16,
                }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}