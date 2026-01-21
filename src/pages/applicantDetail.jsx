import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Profile from "../icon/Profile.png";
import { getResumeDetail } from "../api/resume";

export default function ApplicantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [modalType, setModalType] = useState(null);
  const [applicant, setApplicant] = useState(null);

  const closeModal = () => setModalType(null);

  const handleConfirm = () => {
    // 지원서 상태 업데이트 api 추가 예정
    closeModal();
  };

  useEffect(() => {
    const resumeId = id;

    if (!resumeId) {
      setApplicant(null);
      return;
    }

    const fetchDetail = async () => {
      try {
        const res = await getResumeDetail(resumeId);
        setApplicant(res.data);
      } catch (e) {
        console.error("지원서 상세 조회 실패", e);
        setApplicant(null);
      }
    };

    fetchDetail();
  }, [id]);


  if (!applicant) {
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
        {/* 제목 */}
        <h2 style={{ margin: "8px 0 10px", fontSize: 20, fontWeight: 600, marginBottom: 30 }}>
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
              src={applicant.profileImageUrl || Profile}
              alt="프로필"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{applicant.name}</div>
            <div style={{ color: "#888", marginTop: 6, fontSize: 13 }}>
              {applicant.gender} · {applicant.age}세 / {applicant.major} {applicant.grade}
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: "#eee", margin: "30px 0" }} />

        {/* 주소, 연락처 */}
        <div style={{ display: "grid", rowGap: 14 }}>
          <div style={{ display: "flex", gap: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 400, width: 64, color: "#999" }}>주소</div>
            <div style={{ fontSize: 14, fontWeight: 400, color: "#222" }}>{applicant.address}</div>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 400, width: 64, color: "#999" }}>연락처</div>
            <div style={{ fontSize: 14, fontWeight: 400, color: "#222" }}>{applicant.phone}</div>
          </div>
        </div>

        <div style={{ height: 1, background: "#eee", margin: "30px 0" }} />

        {/* 자기소개 */}
        <div>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}>자기소개</div>
          <p style={{ fontWeight: 400, fontSize: 14, margin: 0, lineHeight: 1.7, color: "#333" }}>
            {applicant.intro}
          </p>
        </div>

        {/* 하단 버튼 */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 300,
            justifyContent: "space-between",
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
              border: "1.5px solid #FF383C",
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
            {/* 아이콘 */}
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

            {/* 문구 */}
            <div style={{ fontWeight: 600, fontSize: 20 }}>
              {modalType === "pass"
                ? "해당 지원자를 합격시키시겠습니까?"
                : "해당 지원자를 불합격시키시겠습니까?"}
            </div>

            <div
              style={{
                marginTop: 8,
                fontSize: 14,
                fontWeight: 400,
                lineHeight: 1.5,
              }}
            >
              취소가 불가능합니다.
              <br />
              신중하게 선택해주세요.
            </div>

            {/* 버튼 */}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button
                type="button"
                onClick={closeModal}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: 12,
                  border: "1px solid #E5E5E5",
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
                  borderRadius: 12,
                  border: "none",
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