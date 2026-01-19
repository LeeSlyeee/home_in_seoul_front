import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, ArrowUp } from 'lucide-react';
import DetailModal from '../components/DetailModal';
import './ListingPage.css';

const MOCK_DATA = [
  // Apartments
  { 
    id: 1, type: 'apartment', district: '도봉구', neighborhood: '방학동', price: '3억 5,000만원', score: 85,
    chartData: [
        { name: '버스 정류장', value: 24, color: '#FF8A80' },
        { name: '병원', value: 12, color: '#69F0AE' },
        { name: '공원', value: 3, color: '#FF80AB' },
        { name: '지하철 역', value: 1, color: '#82B1FF' },
        { name: '학교', value: 5, color: '#FF8A80' },
    ]
  },
  { 
    id: 2, type: 'apartment', district: '강서구', neighborhood: '등촌동', price: '6억 2,000만원', score: 70,
    chartData: [
        { name: '버스 정류장', value: 18, color: '#FF8A80' },
        { name: '병원', value: 8, color: '#69F0AE' },
        { name: '공원', value: 2, color: '#FF80AB' },
        { name: '지하철 역', value: 2, color: '#82B1FF' },
        { name: '학교', value: 4, color: '#FF8A80' },
    ]
  },
  { 
    id: 5, type: 'apartment', district: '광진구', neighborhood: '자양동', price: '12억 5,000만원', score: 92,
    chartData: [
        { name: '버스 정류장', value: 35, color: '#FF8A80' },
        { name: '병원', value: 25, color: '#69F0AE' },
        { name: '공원', value: 6, color: '#FF80AB' },
        { name: '지하철 역', value: 2, color: '#82B1FF' },
        { name: '학교', value: 7, color: '#FF8A80' },
    ]
  },
  { 
    id: 11, type: 'apartment', district: '종로구', neighborhood: '평창동', price: '15억 2,000만원', score: 88,
    chartData: [
        { name: '버스 정류장', value: 15, color: '#FF8A80' },
        { name: '병원', value: 5, color: '#69F0AE' },
        { name: '공원', value: 10, color: '#FF80AB' },
        { name: '지하철 역', value: 0, color: '#82B1FF' },
        { name: '학교', value: 3, color: '#FF8A80' },
    ]
  },

  // Villas (연립다세대)
  { 
    id: 3, type: 'villa', district: '관악구', neighborhood: '신림동', price: '2억 2,000만원', score: 89,
    chartData: [
        { name: '버스 정류장', value: 45, color: '#FF8A80' },
        { name: '병원', value: 15, color: '#69F0AE' },
        { name: '공원', value: 4, color: '#FF80AB' },
        { name: '지하철 역', value: 3, color: '#82B1FF' },
        { name: '학교', value: 6, color: '#FF8A80' },
    ]
  },
  { 
    id: 6, type: 'villa', district: '동대문구', neighborhood: '회기동', price: '2억 8,000만원', score: 80,
    chartData: [
        { name: '버스 정류장', value: 22, color: '#FF8A80' },
        { name: '병원', value: 18, color: '#69F0AE' },
        { name: '공원', value: 2, color: '#FF80AB' },
        { name: '지하철 역', value: 1, color: '#82B1FF' },
        { name: '학교', value: 5, color: '#FF8A80' },
    ]
  },
  { 
    id: 9, type: 'villa', district: '은평구', neighborhood: '대조동', price: '3억 1,000만원', score: 75,
    chartData: [
        { name: '버스 정류장', value: 28, color: '#FF8A80' },
        { name: '병원', value: 11, color: '#69F0AE' },
        { name: '공원', value: 3, color: '#FF80AB' },
        { name: '지하철 역', value: 2, color: '#82B1FF' },
        { name: '학교', value: 4, color: '#FF8A80' },
    ]
  },

  // Officetels
  { 
    id: 4, type: 'officetel', district: '구로구', neighborhood: '고척동', price: '1억 8,000만원', score: 85,
    chartData: [
        { name: '버스 정류장', value: 30, color: '#FF8A80' },
        { name: '병원', value: 14, color: '#69F0AE' },
        { name: '공원', value: 5, color: '#FF80AB' },
        { name: '지하철 역', value: 1, color: '#82B1FF' },
        { name: '학교', value: 6, color: '#FF8A80' },
    ]
  },
  { 
    id: 7, type: 'officetel', district: '마포구', neighborhood: '마포동', price: '3억 5,000만원', score: 90,
    chartData: [
        { name: '버스 정류장', value: 40, color: '#FF8A80' },
        { name: '병원', value: 20, color: '#69F0AE' },
        { name: '공원', value: 7, color: '#FF80AB' },
        { name: '지하철 역', value: 2, color: '#82B1FF' },
        { name: '학교', value: 3, color: '#FF8A80' },
    ]
  },
  { 
    id: 8, type: 'officetel', district: '마포구', neighborhood: '도화동', price: '2억 9,000만원', score: 87,
    chartData: [
        { name: '버스 정류장', value: 38, color: '#FF8A80' },
        { name: '병원', value: 16, color: '#69F0AE' },
        { name: '공원', value: 4, color: '#FF80AB' },
        { name: '지하철 역', value: 2, color: '#82B1FF' },
        { name: '학교', value: 2, color: '#FF8A80' },
    ]
  },
  { 
    id: 10, type: 'officetel', district: '영등포구', neighborhood: '양평동5가', price: '2억 4,000만원', score: 83,
    chartData: [
        { name: '버스 정류장', value: 25, color: '#FF8A80' },
        { name: '병원', value: 9, color: '#69F0AE' },
        { name: '공원', value: 5, color: '#FF80AB' },
        { name: '지하철 역', value: 2, color: '#82B1FF' },
        { name: '학교', value: 3, color: '#FF8A80' },
    ]
  },
  { 
    id: 12, type: 'officetel', district: '종로구', neighborhood: '내수동', price: '4억 1,000만원', score: 85,
    chartData: [
        { name: '버스 정류장', value: 12, color: '#FF8A80' },
        { name: '병원', value: 15, color: '#69F0AE' },
        { name: '공원', value: 8, color: '#FF80AB' },
        { name: '지하철 역', value: 3, color: '#82B1FF' },
        { name: '학교', value: 2, color: '#FF8A80' },
    ]
  },
];

// SEOUL_DISTRICTS constant
const SEOUL_DISTRICTS = [
  '강남구', '강동구', '강북구', '강서구', '관악구', 
  '광진구', '구로구', '금천구', '노원구', '도봉구', 
  '동대문구', '동작구', '마포구', '서대문구', '서초구', 
  '성동구', '성북구', '송파구', '양천구', '영등포구', 
  '용산구', '은평구', '종로구', '중구', '중랑구'
];

const ListingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('apartment');
  const [selectedItem, setSelectedItem] = useState(null);
  
  // District Filter State
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [tempSelectedDistricts, setTempSelectedDistricts] = useState([]); // For checkboxes
  const [appliedDistricts, setAppliedDistricts] = useState([]); // For actual filtering

  // Read budget from URL just to show we "used" it
  const budget = searchParams.get('budget'); 

  // Filter data
  const filteredData = MOCK_DATA.filter(item => {
    // 1. Filter by Tab (Type)
    if (item.type !== selectedTab) return false;

    // 2. Filter by District
    if (appliedDistricts.length === 0) return true;
    return appliedDistricts.includes(item.district);
  });

  const handleRowClick = (item) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handleSearchClick = () => {
      navigate('/');
  }

  // Toggle District Dropdown
  const toggleDistrictDropdown = () => {
    if (!showDistrictDropdown) {
        // When opening, sync temp with currently applied
        setTempSelectedDistricts([...appliedDistricts]);
    }
    setShowDistrictDropdown(!showDistrictDropdown);
  };

  // Toggle Individual District (Checkboxes)
  const toggleDistrict = (district) => {
    if (tempSelectedDistricts.includes(district)) {
      setTempSelectedDistricts(tempSelectedDistricts.filter(d => d !== district));
    } else {
      setTempSelectedDistricts([...tempSelectedDistricts, district]);
    }
  };

  // Apply Selection
  const handleApplyDistricts = () => {
      setAppliedDistricts(tempSelectedDistricts);
      setShowDistrictDropdown(false);
  };

  return (
    <div className="listing-container">
      {/* Header */}
      <header className="listing-header">
        <div className="search-bar-fake" onClick={handleSearchClick}>
            <Search size={20} color="#666" />
            <span>서울에 있는 나만의 보금자리 찾기</span>
        </div>
      </header>
      
      {/* Tabs */}
      <div className="tabs-container">
          <button 
            className={`tab-btn ${selectedTab === 'apartment' ? 'active' : ''}`}
            onClick={() => setSelectedTab('apartment')}>
            아파트
          </button>
          <button 
            className={`tab-btn ${selectedTab === 'villa' ? 'active' : ''}`}
            onClick={() => setSelectedTab('villa')}>
            연립다세대
          </button>
          <button 
            className={`tab-btn ${selectedTab === 'officetel' ? 'active' : ''}`}
            onClick={() => setSelectedTab('officetel')}>
            오피스텔
          </button>
      </div>

      {/* Main Content */}
      <main className="listing-content">
        {/* Filters */}
        <div className="filters-row">
            <div className="filter-group">
                <div 
                    className={`dropdown ${showDistrictDropdown ? 'active' : ''} ${appliedDistricts.length > 0 ? 'highlight' : ''}`} 
                    onClick={toggleDistrictDropdown}
                >
                    <span>
                        {appliedDistricts.length > 0 
                            ? `${appliedDistricts[0]} 외 ${appliedDistricts.length - 1}개` 
                            : '구 선택'}
                    </span> 
                    <ChevronDown size={16} />
                </div>
                
                {showDistrictDropdown && (
                    <div className="district-dropdown-content">
                        <div className="district-grid">
                            {SEOUL_DISTRICTS.map((district) => (
                                <label key={district} className="checkbox-item">
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
                            <button className="btn-confirm" onClick={handleApplyDistricts}>
                                확인
                            </button>
                        </div>
                    </div>
                )}
            </div>


        </div>

        {/* Stats */}
        <div className="stats-row">
            총 매물 수 <strong>{filteredData.length.toLocaleString()}</strong>
        </div>

        {/* Table */}
        <div className="table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        <th style={{width: '60px'}}>ID</th>
                        <th>자치구명</th>
                        <th>법정동명</th>
                        <th>평균 실거래가</th>
                        <th>종합점수</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item) => (
                        <tr key={item.id} onClick={() => handleRowClick(item)}>
                            <td>{item.id}</td>
                            <td>{item.district}</td>
                            <td>{item.neighborhood}</td>
                            <td>{item.price}</td>
                            <td>{item.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </main>

      <div className="fab-up">
        <ArrowUp size={20} />
      </div>

      <DetailModal item={selectedItem} onClose={handleCloseModal} />
    </div>
  );
};

export default ListingPage;
