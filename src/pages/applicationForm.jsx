import Header from "../components/Header";
import Button from "../components/Button";
import Profile from "../icon/Profile.png";
import Modal from "../components/Modal";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createResume, getMyPageInfo } from "../api/resume";

export default function ApplicationForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const topRef = useRef(null);


  const recruitId = useMemo(() => {
    return (
      searchParams.get("recruitId")
    );
  }, [searchParams]);

  const INTRO_MAX = 500;
  const TITLE_MAX = 20;


  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const isLoggedIn = useMemo(() => {
    const token = localStorage.getItem("accessToken");
    return Boolean(token && token.trim());
  }, []);

  const [title, setTitle] = useState("");
  const [intro, setIntro] = useState("");
  const [profile, setProfile] = useState(null);
  const [formError, setFormError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openModal = () => {
    if (!title.trim() || !intro.trim()) {
      setFormError("필수 정보를 입력해 주세요.");
      return;
    }
    setFormError("");
    setIsModalOpen(true);
  };
  const closeModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
  };



  useEffect(() => {
    // 포커스 고정
    if (topRef.current) {
      topRef.current.focus();
    }

    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    const fetchMyProfile = async () => {
      try {
        const res = await getMyPageInfo();
        setProfile(res?.data?.data ?? null);
      } catch (e) {
        setProfile(null);
      }
    };

    fetchMyProfile();
  }, []);

  const handleConfirm = async () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    const recruitIdNum = Number(recruitId);

    if (!recruitId || Number.isNaN(recruitIdNum)) {
      setFormError("모집글 정보(recruitId)를 가져오지 못했어요. 다시 시도해주세요.");
      closeModal();
      return;
    }

    if (!title.trim() || !intro.trim()) {
      closeModal();
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        recruitId: recruitIdNum,
        title: title.trim(),
        selfIntroduce: intro.trim(),
      };

      await createResume(payload);

      setIsModalOpen(false);
      navigate("/applications");
    } catch (e) {

      if (e?.response?.status === 409) {
        try {
          const myRes = await getMyResumes();
          const myList = myRes?.data?.data ?? [];

          const existed = Array.isArray(myList)
            ? myList.find((it) => Number(it.recruitId) === recruitIdNum)
            : null;

          if (existed?.resumeId) {
            setIsModalOpen(false);
            navigate(`/applications/${existed.resumeId}`, {
              state: { recruitId: existed.recruitId },
            });
            return;
          }

          setFormError("이미 지원한 모집글입니다.");
          setIsModalOpen(false);
          return;
        } catch (err) {
          setFormError("이미 지원한 모집글입니다.");
          setIsModalOpen(false);
          return;
        }
      }

      const msg =
        e?.response?.data?.error?.message ||
        e?.response?.data?.message ||
        "지원서 생성에 실패했습니다.";

      setFormError(msg);
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: "#FFFFFF",
        boxSizing: "border-box",
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      <Header title="지원서 작성" leftAction={() => navigate(-1)} />
      <div tabIndex={-1} ref={topRef} style={{ outline: "none" }} />

      <div style={{ padding: 24, flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
        {/* 제목 input */}
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value.slice(0, TITLE_MAX));
            if (formError) setFormError("");
          }}
          placeholder="제목을 입력해주세요."
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            fontSize: 20,
            fontWeight: 600,
            color: "#000000",
            padding: "10px 0 14px",
          }}
        />
        {title.length >= TITLE_MAX && (
          <div style={{ marginBottom: 10, fontSize: 12, color: "#A4A4A4" }}>
            20자까지 작성 가능합니다.
          </div>
        )}
        <div style={{ height: 1, background: "#F5F5F5", marginBottom: 30 }} />

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
              src={profile?.profileImage ? profile.profileImage : Profile}
              alt="프로필"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 16, color: "#000000" }}>
              {profile?.name ?? ""}
            </div>
            <div style={{ marginTop: 6, fontWeight: 400, fontSize: 14, color: "#A4A4A4" }}>
              {profile?.major ?? ""} {profile?.grade ? `· ${profile.grade}학년` : ""}
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: "#F5F5F5", margin: "30px 0 20px" }} />

        {/* 주소, 연락처 */}
        <div style={{ display: "grid", rowGap: 14 }}>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 400,
                width: 64,
                color: "#A4A4A4",
              }}
            >
              주소
            </div>
            <div style={{ fontSize: 14, fontWeight: 400, color: "#212121" }}>
              {profile?.address ?? "-"}
            </div>
          </div>

          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 400,
                width: 64,
                color: "#A4A4A4",
              }}
            >
              연락처
            </div>
            <div style={{ fontSize: 14, fontWeight: 400, color: "#212121" }}>
              {profile?.phoneNumber ?? ""}
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: "#F5F5F5", margin: "20px 0" }} />

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
          onChange={(e) => {
            setIntro(e.target.value.slice(0, INTRO_MAX));
            if (formError) setFormError("");
          }}
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
        {formError ? (
          <div style={{ marginTop: 10, fontSize: 13, color: "#FF4D4D" }}>
            {formError}
          </div>
        ) : null}

      </div>

      <div
        style={
          {
            padding: "12px 24px 20px",
            borderTop: "1px solid #F5F5F5",
            background: "#FFFFFF",
          }
        }
      >
        <Button label="지원하기" onClick={openModal} disabled={isSubmitting} />
      </div>

      {/* 로그인 필요 모달 */}
      <Modal
        isOpen={isLoginModalOpen}
        lBtn="취소"
        rBtn="로그인"
        rBtnColor="#2572B9"
        onClose={() => {
          setIsLoginModalOpen(false);
          navigate(-1);
        }}
        onRightClick={() => {
          setIsLoginModalOpen(false);
          navigate("/login");
        }}
      />

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