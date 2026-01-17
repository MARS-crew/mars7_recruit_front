import React from "react";
import { useNavigate } from "react-router-dom";
import MainLogo from "../icon/MainLogo.png";
import notice from "../icon/notice.png";
import MainImg from "../icon/MainImg.png";
import person from "../icon/person.png";

function Home() {
  const recruits = [
    {
      id: 1,
      title: "26학년도 ONE 신입부원을 모집합니다...",
      content:
        "2026학년도 전공동아리 ONE에서 신입 부원을 모집합니다! 전공동아리 ONE 웹응용소프트웨어공학과 동...",
      dDay: "D-1",
      startDate: "26.02.18 시작",
      targetCount: "00명",
      poster: MainImg,
    },
    {
      id: 2,
      title: "데이터베이스 스터디 모집",
      content:
        "함께 SQL 자격증을 준비할 열정 있는 부원을 찾고 있습니다. 매주 목요일 저녁에 진행됩니다.",
      dDay: "D-4",
      startDate: "26.03.01 시작",
      targetCount: "05명",
      poster: MainImg,
    },
    {
      id: 3,
      title: "환영합니다~",
      content:
        "안녕하세요. 누구나 같이 즐길 수 있다면 환영합니다. 만나는 시간은 미정이예요~",
      dDay: "D-4",
      startDate: "26.03.01 시작",
      targetCount: "05명",
      poster: MainImg,
    },
  ];
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        padding: "0 16px",
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* 1. 상단 헤더 영역 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: 56,
          width: "100%",
        }}
      >
        <img style={{ height: 56, minWidth: 144 }} src={MainLogo} alt="로고" />
        <img
          style={{ height: 24, width: 24, cursor: "pointer" }}
          src={notice}
          alt="알림"
          onClick={() => navigate("/notice")}
        />
      </div>

      <div style={{ marginTop: 23 }}>
        <p
          style={{
            color: "#000000",
            fontSize: 24,
            fontWeight: "bold",
            margin: 0,
          }}
        >
          지금 핫한 동아리
        </p>
        <p
          style={{
            color: "#2572B9",
            fontSize: 12,
            fontWeight: "500",
            margin: "4px 0 20px",
          }}
        >
          동양미래대학교에서 핫한 동아리를 모았다!!
        </p>

        {/* 목록 영역 */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* 2 영역 */}
          <div
            style={{ width: "28%", minWidth: "100px" }}
            onClick={() => {
              navigate("/clubs/1");
            }}
          >
            <span
              style={{ fontSize: 18, fontWeight: "bold", color: "#FFC100" }}
            >
              2
            </span>
            <span style={{ fontSize: 14, fontWeight: "500", color: "#FFC100" }}>
              위
            </span>
            <div
              style={{
                width: "100%",
                border: "1px solid #fff",
                borderRadius: 8,
                boxShadow: "0px 2px 4px 1px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
              }}
            >
              <img
                style={{
                  width: "100%",
                  aspectRatio: "100 / 116",
                  objectFit: "cover",
                }}
                src={MainImg}
                alt="동아리"
              />
              <div
                style={{
                  margin: "4px",
                  display: "flex",
                  alignItems: "flex-end",
                  width: "calc(100% - 8px)",
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: "500",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    margin: 0,
                    width: "100%",
                  }}
                >
                  26학년도 ONE 신입 모집 안내...
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  margin: "4px",
                }}
              >
                <div
                  style={{
                    background: "#FFC10033",
                    padding: "2px 8px",
                    borderRadius: 8,
                  }}
                >
                  <p
                    style={{
                      color: "#D6A200",
                      fontSize: 8,
                      margin: 0,
                      fontWeight: "bold",
                    }}
                  >
                    D-4
                  </p>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "2px" }}
                >
                  <img src={person} style={{ height: 10 }} />
                  <p style={{ color: "#9EA3B2", fontSize: 8, margin: 0 }}>
                    00명
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 1 영역 */}
          <div
            style={{ width: "36%", minWidth: "133px" }}
            onClick={() => {
              navigate("/clubs/1");
            }}
          >
            <span
              style={{ fontSize: 18, fontWeight: "bold", color: "#FFC100" }}
            >
              1
            </span>
            <span style={{ fontSize: 14, fontWeight: "500", color: "#FFC100" }}>
              위
            </span>
            <div
              style={{
                width: "100%",
                border: "1px solid #fff",
                borderRadius: 8,
                boxShadow: "0px 2px 4px 1px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
              }}
            >
              <img
                style={{
                  width: "100%",
                  aspectRatio: "133 / 154",
                  objectFit: "cover",
                }}
                src={MainImg}
                alt="동아리"
              />
              <div
                style={{
                  margin: "4px",
                  display: "flex",
                  alignItems: "flex-end",
                  width: "calc(100% - 8px)",
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: "500",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    margin: 0,
                    width: "100%",
                  }}
                >
                  26학년도 ONE 신입 모집 안내...
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  margin: "6px 8px",
                }}
              >
                <div
                  style={{
                    background: "#FFC10033",
                    padding: "4px 10px",
                    borderRadius: 8,
                  }}
                >
                  <p
                    style={{
                      color: "#D6A200",
                      fontSize: 12,
                      margin: 0,
                      fontWeight: "bold",
                    }}
                  >
                    D-4
                  </p>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "2px" }}
                >
                  <img src={person} style={{ height: 14 }} />
                  <p style={{ color: "#9EA3B2", fontSize: 12, margin: 0 }}>
                    00명
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3 영역 */}
          <div
            style={{ width: "28%", minWidth: "100px" }}
            onClick={() => {
              navigate("/clubs/1");
            }}
          >
            <span
              style={{ fontSize: 18, fontWeight: "bold", color: "#FFC100" }}
            >
              3
            </span>
            <span style={{ fontSize: 14, fontWeight: "500", color: "#FFC100" }}>
              위
            </span>
            <div
              style={{
                width: "100%",
                border: "1px solid #fff",
                borderRadius: 8,
                boxShadow: "0px 2px 4px 1px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
              }}
            >
              <img
                style={{
                  width: "100%",
                  aspectRatio: "100 / 116",
                  objectFit: "cover",
                }}
                src={MainImg}
                alt="동아리"
              />
              <div
                style={{
                  margin: "4px",
                  display: "flex",
                  alignItems: "flex-end",
                  width: "calc(100% - 8px)",
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: "500",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    margin: 0,
                    width: "100%",
                  }}
                >
                  26학년도 ONE 신입 모집 안내...
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  margin: "4px",
                }}
              >
                <div
                  style={{
                    background: "#FFC10033",
                    padding: "2px 8px",
                    borderRadius: 8,
                  }}
                >
                  <p
                    style={{
                      color: "#D6A200",
                      fontSize: 8,
                      margin: 0,
                      fontWeight: "bold",
                    }}
                  >
                    D-4
                  </p>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "2px" }}
                >
                  <img src={person} style={{ height: 10 }} />
                  <p style={{ color: "#9EA3B2", fontSize: 8, margin: 0 }}>
                    00명
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*리스트 영역 */}
        <div style={{ marginTop: 23 }}>
          <p
            style={{
              color: "#000000",
              fontSize: 24,
              fontWeight: "bold",
              margin: 0,
            }}
          >
            최근 올라온 모집글
          </p>
          <p
            style={{
              color: "#2572B9",
              fontSize: 12,
              fontWeight: "500",
              margin: "4px 0 20px",
            }}
          >
            방금 막 올라온 신상 모집글!
          </p>
        </div>

        {recruits.map((item, index) => {
          const showBorder =
            recruits.length >= 2 && index !== recruits.length - 1;
          const isDay1 = item.dDay === "D-1";
          return (
            <div
              onClick={() => {
                navigate("/clubs/1");
              }}
              key={item.id}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                padding: "16px 0",
                borderBottom: showBorder ? "1px solid #9EA3B2" : "none",
              }}
            >
              {/* 1. 왼쪽 텍스트 영역*/}
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: "flex",
                  flexDirection: "column",
                  marginRight: 16,
                }}
              >
                {/* 제목 */}
                <p
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    margin: "0 0 6px 0",
                    color: "#000",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis", // 너비를 넘어가면 무조건 ... 처리
                  }}
                >
                  {item.title}
                </p>

                {/* 본문 요약 */}
                <p
                  style={{
                    fontSize: 14,
                    color: "#9EA3B2",
                    margin: "0 0 16px 0",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    lineHeight: "1.4",
                  }}
                >
                  {item.content}
                </p>

                {/* 하단 메타 정보 (D-Day 등) */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div
                    style={{
                      backgroundColor: !isDay1 ? "#FFC10033" : "#FFEBEB",
                      color: !isDay1 ? "#D6A200" : "#FF4D4D",
                      padding: "4px 12px",
                      borderRadius: "16px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {item.dDay}
                  </div>
                  <span
                    style={{
                      color: "#9EA3B2",
                      fontSize: "14px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.startDate}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      marginLeft: "auto",
                    }}
                  >
                    <img
                      src={person}
                      alt="인원"
                      style={{ width: 14, height: 14 }}
                    />
                    <span style={{ color: "#9EA3B2", fontSize: "14px" }}>
                      {item.targetCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. 오른쪽 이미지 영역: 크기를 딱 고정하고 절대 줄어들지 않게 설정 */}
              <div
                style={{
                  width: 82,
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  style={{
                    width: 82,
                    height: 117,
                    borderRadius: "4px",
                    objectFit: "cover",
                    border: "1px solid #E0E0E0",
                  }}
                  src={item.poster}
                  alt="포스터"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
