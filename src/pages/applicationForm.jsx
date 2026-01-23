import Header from "../components/Header";
import Button from "../components/Button";
import Profile from "../icon/Profile.png";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { createResume } from "../api/resume";
import { getMyPageInfo } from "../api/resume";

export default function ApplicationForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const recruitId = useMemo(() => {
    return (
      location.state?.recruitId ??
      searchParams.get("recruitId")
    );
  }, [location.state, searchParams]);

  const INTRO_MAX = 500;

  const [title, setTitle] = useState("");
  const [intro, setIntro] = useState("");
  const [profile, setProfile] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const res = await getMyPageInfo();
        setProfile(res?.data ?? null);
      } catch (e) {
        console.error("마이페이지 정보 불러오기 실패", e);
        setProfile(null);
      }
    };

    fetchMyProfile();
  }, [recruitId]);

  const handleConfirm = async () => {
    if (!recruitId) {
      console.error("recruitId 없음.");
      closeModal();
      return;
    }

    if (!title.trim() || !intro.trim()) {
      closeModal();
      return;
    }

    try {
      setIsSubmitting(true);

      await createResume(recruitId, {
        title: title.trim(),
        intro: intro.trim(),
      });

      setIsModalOpen(false);
      navigate("/applications");
    } catch (e) {
      console.error("지원서 생성 실패", e);
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ paddingBottom: 92 }}>
      <Header title="지원서 작성" leftAction={() => navigate(-1)} />

      <div style={{ padding: 24 }}>
        {/* 제목 input */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력해주세요."
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            fontSize: 20,
            fontWeight: 600,
            color: "#111",
            padding: "10px 0 14px",
          }}
        />
        <div style={{ height: 1, background: "#eee", marginBottom: 18 }} />

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
              src={profile?.profileImageUrl || Profile}
              alt="프로필"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 16, color: "#111" }}>
              {profile?.name ?? ""}
            </div>
            <div style={{ marginTop: 6, fontSize: 13, color: "#8A8FA3" }}>
              {profile?.gender ?? ""} · {profile?.age ?? ""}세 / {profile?.major ?? ""} {profile?.grade ?? ""}
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: "#eee", margin: "40px 0 20px" }} />

        {/* 주소, 연락처 */}
        <div style={{ display: "grid", rowGap: 14 }}>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 400,
                width: 64,
                color: "#9AA0A6",
              }}
            >
              주소
            </div>
            <div style={{ fontSize: 14, fontWeight: 400, color: "#111" }}>
              {profile?.address ?? ""}
            </div>
          </div>

          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 400,
                width: 64,
                color: "#9AA0A6",
              }}
            >
              연락처
            </div>
            <div style={{ fontSize: 14, fontWeight: 400, color: "#111" }}>
              {profile?.phone ?? ""}
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: "#eee", margin: "20px 0" }} />

        {/* 자기소개*/}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 16, color: "#111" }}>
            자기소개<span style={{ color: "#FF4D4D" }}> *</span>
          </div>
          <div style={{ fontSize: 12, fontWeight: 400 }}>
            <span style={{ color: "#2572B9" }}>{intro.length}</span>
            <span style={{ color: "#B0B5C0" }}>/{INTRO_MAX}</span>
          </div>
        </div>

        {/* 자기소개 input */}
        <textarea
          value={intro}
          onChange={(e) => setIntro(e.target.value.slice(0, INTRO_MAX))}
          placeholder="자기소개를 입력해주세요."
          style={{
            width: "100%",
            minHeight: 150,
            resize: "none",
            padding: 16,
            borderRadius: 18,
            border: "1px solid #E6E6E6",
            outline: "none",
            fontSize: 14,
            fontWeight: 400,
            lineHeight: 1.6,
            color: "#111",
            background: "#fff",
          }}
        />

        {/* 하단 버튼 */}
        <div style={{ marginTop: 80 }}>
          <Button
            label="지원하기"
            onClick={openModal}
            disabled={!title.trim() || !intro.trim() || isSubmitting}
          />
        </div>
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <div
          onClick={closeModal}
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
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 380,
              background: "#fff",
              borderRadius: 18,
              padding: "22px 18px",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 10 }}>
              지원하시겠습니까?
            </div>

            <div
              style={{
                fontWeight: 400,
                color: "#000000",
                fontSize: 14,
                lineHeight: 1.5,
              }}
            >
              지금 지원한 내용은 수정 및 취소가 되지 않습니다.
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
              <button
                type="button"
                onClick={closeModal}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  height: 46,
                  borderRadius: 14,
                  border: "1px solid #E5E5E5",
                  background: "#fff",
                  fontWeight: 500,
                  opacity: isSubmitting ? 0.6 : 1,
                }}
              >
                취소
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  height: 46,
                  borderRadius: 14,
                  border: "none",
                  background: "#2572B9",
                  color: "#fff",
                  fontWeight: 500,
                  opacity: isSubmitting ? 0.6 : 1,
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