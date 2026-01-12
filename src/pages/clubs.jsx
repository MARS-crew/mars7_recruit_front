import { useState } from 'react';
import LoginRequiredModal from '../components/LoginRequiredModal';

export default function Clubs() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="page-container">
      <h1 
        onClick={() => setIsModalOpen(true)}
        style={{ cursor: 'pointer' }}
      >동아리</h1>
      <p>동아리 목록 페이지입니다.</p>
      <LoginRequiredModal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)} 
            />
    </div>
  );
}
