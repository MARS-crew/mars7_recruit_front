import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLogo from "../icon/MainLogo.png";
import notice from "../icon/notice.png";
import mainApi from "../api/main";
import person from "../icon/person.png";

function Home() {
  const [latestList, setLatestList] = useState([]);
  const [popularList, setPopularList] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const MainData = async () => {
    try {
      setLoading(true);
      const response = await mainApi.mainPage();

      if (response.success) {
        setLatestList(response.data.latestRecruits);
        const originalPopular = response.data.popularRecruits;

        if (originalPopular) {
          const reordered = [
            originalPopular[1],
            originalPopular[0],
            originalPopular[2],
          ];
          setPopularList(reordered);
        } else {
          setPopularList(originalPopular);
        }
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };
  const calculateDDay = (dueDateString) => {
    if (!dueDateString) return "";

    const today = new Date();
    const targetDate = new Date(dueDateString);

    // 시간차를 밀리초 단위로 계산한 뒤 날짜로 변환
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return `D-${diffDays}`;
  };
  useEffect(() => {
    MainData();
  }, []);
  return (
    <div
      style={{
        minWidth: 393,
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
        <img
          style={{ height: 56, minWidth: 144, paddingTop: 4 }}
          src={MainLogo}
          alt="로고"
        />
        <img
          style={{ height: 24, width: 24, cursor: "pointer" }}
          src={notice}
          alt="알림"
          onClick={() => navigate("/notice")}
        />
      </div>
      {/**지금 핫한 동아리 영역 */}
      <div style={{ marginTop: 23 }}>
        <p
          style={{
            color: "#000000",
            fontSize: 24,
            fontWeight: "bold",
            margin: 0,
            lineHeight: "32px",
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
              navigate(`/clubs/${popularList[0]?.recruitId}`);
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
              <div
                style={{
                  width: "100px",
                  height: "116px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {popularList[0]?.posterImage ? (
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                    src={`${popularList[0]?.posterImage}`}
                  />
                ) : (
                  <p style={{ fontSize: 12, color: "#9EA3B2" }}>
                    포스터가
                    <br />
                    없습니다
                  </p>
                )}
              </div>
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
                  {popularList[0]?.title}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  margin: " 4px 6px",
                }}
              >
                <div
                  style={{
                    background: "#FFC10033",
                    padding: "2px 8px",
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 18,
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
                    {calculateDDay(popularList[0]?.dueDate)}
                  </p>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "2px" }}
                >
                  <img src={person} style={{ height: 16, width: 16 }} />
                  <p style={{ color: "#9EA3B2", fontSize: 10, margin: 0 }}>
                    {popularList[0]?.people < 10 ? "0명" : "00명"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 1 영역 */}
          <div
            style={{ width: "36%", minWidth: "133px" }}
            onClick={() => {
              navigate(`/clubs/${popularList[1]?.recruitId}`);
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
                backgroundColor: "#F5F5F5",
              }}
            >
              <div
                style={{
                  width: 133,
                  height: 154,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {popularList[1]?.posterImage ? (
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                    src={`${popularList[1]?.posterImage}`}
                    alt="동아리"
                  />
                ) : (
                  <p style={{ fontSize: 14, color: "#9EA3B2" }}>
                    포스터가
                    <br /> 없습니다
                  </p>
                )}
              </div>
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
                    fontSize: 12,
                    fontWeight: "500",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    margin: 0,
                    width: "100%",
                  }}
                >
                  {popularList[1]?.title}
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
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 53,
                    borderRadius: 16,
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
                    {calculateDDay(popularList[1]?.dueDate)}
                  </p>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "2px" }}
                >
                  <img src={person} style={{ height: 19, width: 19 }} />
                  <p style={{ color: "#9EA3B2", fontSize: 12, margin: 0 }}>
                    {popularList[1]?.people < 10 ? "0명" : "00명"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3 영역 */}
          <div
            style={{ width: "28%", minWidth: "100px" }}
            onClick={() => {
              navigate(`/clubs/${popularList[2]?.recruitId}`);
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
              <div
                style={{
                  width: "100px",
                  height: "116px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {popularList[2]?.posterImage ? (
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                    src={`${popularList[2]?.posterImage}`}
                    alt="동아리"
                  />
                ) : (
                  <p style={{ fontSize: 10, color: "#9EA3B2" }}>
                    포스터가
                    <br />
                    없습니다
                  </p>
                )}
              </div>
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
                  {popularList[2]?.title}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  margin: " 4px 6px",
                }}
              >
                <div
                  style={{
                    background: "#FFC10033",
                    padding: "2px 8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 18,
                    borderRadius: 16,
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
                    {calculateDDay(popularList[2]?.dueDate)}
                  </p>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "2px" }}
                >
                  <img src={person} style={{ height: 16, width: 16 }} />
                  <p style={{ color: "#9EA3B2", fontSize: 10, margin: 0 }}>
                    {popularList[2]?.people < 10 ? "0명" : "00명"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/**최근 동아리 영역 */}
        <div style={{ marginTop: 46 }}>
          <p
            style={{
              color: "#000000",
              fontSize: 24,
              fontWeight: "bold",
              margin: 0,
              lineHeight: "32px",
            }}
          >
            최근 올라온 모집글
          </p>
          <p
            style={{
              color: "#2572B9",
              fontSize: 12,
              fontWeight: "500",
              margin: 0,
            }}
          >
            방금 막 올라온 신상 모집글!
          </p>
        </div>

        {latestList?.map((item, index) => {
          const showBorder =
            latestList.length >= 2 && index !== latestList.length - 1;
          const dDayValue = calculateDDay(item?.dueDate);
          const isDay1 = dDayValue === "D-1";

          return (
            <div
              onClick={() => {
                navigate(`/clubs/${item.recruitId}`);
              }}
              key={item.recruitId}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",

                alignItems: "stretch",
                padding: "11px 0",
                borderBottom: showBorder ? "1px solid #EAEAEA" : "none",
              }}
            >
              {/* 1. 왼쪽 텍스트 영역*/}
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
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
                    lineHeight: "26px",
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
                    lineHeight: "22px",
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
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "53px",
                    }}
                  >
                    {calculateDDay(item?.dueDate)}
                  </div>
                  <span
                    style={{
                      color: "#9EA3B2",
                      fontSize: "14px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.createdAt.split("T")[0]} 시작
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
                      style={{ width: 19, height: 19 }}
                    />
                    <span style={{ color: "#9EA3B2", fontSize: "14px" }}>
                      {item?.people < 10 ? "0명" : "00명"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. 오른쪽 이미지 영역: 크기를 딱 고정하고 절대 줄어들지 않게 설정 */}
              <div
                style={{
                  width: 82,
                  height: 117,
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {item.posterImage ? (
                  <img
                    style={{
                      width: 82,
                      height: 117,
                      borderRadius: "8px",
                      objectFit: "contain",
                    }}
                    src={item.posterImage}
                  />
                ) : (
                  <p
                    style={{
                      fontSize: 10,
                      color: "#9EA3B2",
                      textAlign: "center",
                      margin: 0,
                    }}
                  >
                    포스터가
                    <br />
                    없습니다
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
