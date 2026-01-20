import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react'; 
import './LandingPage.css';

const SEOUL_DISTRICTS = [
  '강남구', '강동구', '강북구', '강서구', '관악구', 
  '광진구', '구로구', '금천구', '노원구', '도봉구', 
  '동대문구', '동작구', '마포구', '서대문구', '서초구', 
  '성동구', '성북구', '송파구', '양천구', '영등포구', 
  '용산구', '은평구', '종로구', '중구', '중랑구'
];

const LandingPage = () => {
  // Use API parameter names for state where possible for clarity
  const [priceTarget, setPriceTarget] = useState(''); 
  
  // Dropdown States
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [tempSelectedDistricts, setTempSelectedDistricts] = useState([]); // Checkbox toggle state
  const [appliedDistricts, setAppliedDistricts] = useState([]); // Confirmed selection (Mapped to 'gu_list')
  
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDistrictDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleApply = () => {
      const params = new URLSearchParams();
      
      // API Spec: 'price_target' (단위: 만원)
      if (priceTarget) {
          const rawPrice = priceTarget.replace(/,/g, '');
          params.append('price_target', rawPrice);
      }
      
      // API Spec: 'gu_list' (콤마로 구분된 자치구명)
      if (appliedDistricts.length > 0) {
          params.append('gu_list', appliedDistricts.join(','));
      }
      
      navigate(`/listing?${params.toString()}`);
  };

  const handlePriceChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value === '') {
        setPriceTarget('');
        return;
    }
    const numValue = parseInt(value, 10);
    setPriceTarget(numValue.toLocaleString());
  };

  // Dropdown Logic
  const toggleDropdown = () => {
      if (!showDistrictDropdown) {
          // Sync temp with applied when opening
          setTempSelectedDistricts([...appliedDistricts]);
      }
      setShowDistrictDropdown(!showDistrictDropdown);
  };

  const toggleDistrict = (district) => {
      if (tempSelectedDistricts.includes(district)) {
          setTempSelectedDistricts(tempSelectedDistricts.filter(d => d !== district));
      } else {
          setTempSelectedDistricts([...tempSelectedDistricts, district]);
      }
  };

  const confirmSelection = () => {
      setAppliedDistricts([...tempSelectedDistricts]);
      setShowDistrictDropdown(false);
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
            <label>원하는 지역을 선택해주세요</label>
            <div className="dropdown-wrapper" ref={dropdownRef}>
                <div 
                    className={`dropdown-trigger ${showDistrictDropdown ? 'active' : ''}`} 
                    onClick={toggleDropdown}
                >
                    <span>
                        {appliedDistricts.length > 0 
                            ? `${appliedDistricts[0]} 외 ${appliedDistricts.length - 1}개` 
                            : '구 선택 (복수 선택 가능)'}
                    </span>
                    <ChevronDown size={18} color="#666"/>
                </div>
                
                {showDistrictDropdown && (
                    <div className="dropdown-menu">
                        <div className="dropdown-grid">
                            {SEOUL_DISTRICTS.map((district) => (
                                <label key={district} className="dropdown-item">
                                    <input 
                                        type="checkbox" 
                                        checked={tempSelectedDistricts.includes(district)}
                                        onChange={() => toggleDistrict(district)}
                                    />
                                    <span>{district}</span>
                                </label>
                            ))}
                        </div>
                        <div className="dropdown-footer">
                            <button className="btn-confirm-sm" onClick={confirmSelection}>확인</button>
                        </div>
                    </div>
                )}
            </div>
        </div>

        <div className="input-group">
            <label>예산을 입력해주세요</label>
            <div className="input-wrapper">
                <input 
                    type="text" 
                    value={priceTarget} 
                    onChange={handlePriceChange} 
                    placeholder="50,000"
                />
                <span className="unit">만원</span>
            </div>
        </div>
        
        <button className="btn-primary" onClick={handleApply}>검색하기</button>
      </div>
    </div>
  );
};

export default LandingPage;
