import React from "react";
import { Link } from "react-router-dom";
import { useState } from 'react';
import LoginRequiredModal from '../components/LoginRequiredModal';

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      <h1>
        <Link to="/notice">홈(알림이동)</Link>
      </h1>
      <h1
        onClick={() => setIsModalOpen(true)}
        style={{ cursor: 'pointer' }}
      >로그인 모달.</h1>
      <LoginRequiredModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                  />
    </div>
  );
}

export default Home;