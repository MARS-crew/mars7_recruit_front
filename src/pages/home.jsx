import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>
        <Link to="/notice">홈(알림이동)</Link>
      </h1>
      <p>메인페이지입니다.</p>
    </div>
  );
}

export default Home;