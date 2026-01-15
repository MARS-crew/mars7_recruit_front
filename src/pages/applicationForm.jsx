import Header from "../components/Header";
import Button from "../components/Button";
import Profile from "../icon/Profile.png";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const mockApplicationForm = [
  {
    id: 1,
    title: "",
    name: "진선정",
    gender: "여자",
    age: 22,
    major: "컴퓨터소프트웨어공학과",
    grade: "3학년",
    address: "경기도 광명시",
    phone: "010-0000-0000",
    intro: "",
  }
];

export default function ApplicationForm() {
    const navigate = useNavigate();
    const data = useMemo(() => mockApplicationForm[0], []);

    const INTRO_MAX = 500;

    const [title, setTitle] = useState(data.title);
    const [intro, setIntro] = useState(data.intro);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleConfirm = () => {
        alert("지원 완료");
        closeModal();
        navigate("/applications")
    }

    
    return (
    <div style={{ paddingBottom: 92 }}>
      <Header title="지원서 작성" leftAction={() => navigate(-1)} />

      <div style={{ padding: 24 }}>
        {/* 제목 input */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요."
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            fontSize: 22,
            fontWeight: 900,
            color: "#111",
            padding: "10px 0 14px",
          }}
        />
        <div style={{ height: 1, background: "#eee", marginBottom: 18 }} />

        {/* 프로필 */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 72,
              height: 72,
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

          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 900, fontSize: 16, color: "#111" }}>
              {data.name}
            </div>
            <div style={{ marginTop: 6, fontSize: 13, color: "#8A8FA3" }}>
              {data.gender} · {data.age}세 / {data.major} {data.grade}
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: "#eee", margin: "22px 0" }} />

        {/* 주소, 연락처 */}
        <div style={{ display: "grid", rowGap: 16 }}>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <div style={{ width: 64, color: "#9AA0A6" }}>주소</div>
            <div style={{ color: "#111" }}>{data.address}</div>
          </div>

          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <div style={{ width: 64, color: "#9AA0A6" }}>연락처</div>
            <div style={{ color: "#111" }}>{data.phone}</div>
          </div>
        </div>

        <div style={{ height: 1, background: "#eee", margin: "22px 0" }} />

        {/* 자기소개*/}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <div style={{ fontWeight: 900, fontSize: 16, color: "#111" }}>
            자기소개<span style={{ color: "#FF4D4D" }}> *</span>
          </div>
          <div style={{ color: "#2B7FFF", fontSize: 13, fontWeight: 800 }}>
            {intro.length}/{INTRO_MAX}
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
            lineHeight: 1.6,
            color: "#111",
            background: "#fff",
          }}
        />

        {/* 하단 버튼 */}
        <div style={{ marginTop: 28 }}>
          <Button label="지원하기" onClick={openModal}/>
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
            <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 10 }}>
              지원하시겠습니까?
            </div>

            <div style={{ color: "#666", fontSize: 14, lineHeight: 1.5 }}>
              지금 지원한 내용은 수정 및 취소가 되지 않습니다.
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
              <button
                type="button"
                onClick={closeModal}
                style={{
                  flex: 1,
                  height: 46,
                  borderRadius: 14,
                  border: "1px solid #E5E5E5",
                  background: "#fff",
                  fontWeight: 800,
                }}
              >
                취소
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                style={{
                  flex: 1,
                  height: 46,
                  borderRadius: 14,
                  border: "none",
                  background: "#2572B9",
                  color: "#fff",
                  fontWeight: 900,
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