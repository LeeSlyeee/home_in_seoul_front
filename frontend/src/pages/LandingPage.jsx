import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const [budget, setBudget] = useState('');
  const navigate = useNavigate();

  const handleApply = () => {
    if (budget) {
      // Remove commas for the query param
      const rawBudget = budget.replace(/,/g, '');
      navigate(`/listing?budget=${rawBudget}`);
    }
  };

  const handleChange = (e) => {
    // Allow digits only
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value === '') {
        setBudget('');
        return;
    }
    const numValue = parseInt(value, 10);
    setBudget(numValue.toLocaleString());
  };

  return (
    <div className="landing-container">
      <div className="landing-card">
        <div className="icon-search">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
             </svg>
        </div>
        <h1 className="landing-title">서울에 있는<br/>나만의 보금자리 찾기</h1>
        
        <div className="input-group">
            <label>예산을 입력해주세요</label>
            <div className="input-wrapper">
                <input 
                    type="text" 
                    value={budget} 
                    onChange={handleChange} 
                    placeholder="50,000"
                />
                <span className="unit">만원</span>
            </div>
        </div>
        
        <button className="btn-primary" onClick={handleApply}>적용</button>
      </div>
    </div>
  );
};

export default LandingPage;
