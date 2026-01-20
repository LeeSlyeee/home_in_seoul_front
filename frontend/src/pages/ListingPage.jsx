import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, ArrowUp } from 'lucide-react';
import DetailModal from '../components/DetailModal';
import './ListingPage.css';

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
  
  // State
  const [selectedTab, setSelectedTab] = useState('apartment');
  const [selectedItem, setSelectedItem] = useState(null);
  const [realEstateStats, setRealEstateStats] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // District Filter State
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  
  // Initialize from URL params directly to ensure first render has correct state
  const initialDistricts = () => {
      const guListParam = searchParams.get('gu_list');
      if (guListParam) {
          return guListParam.split(',').map(d => d.trim()).filter(d => d);
      }
      return [];
  };

  const [tempSelectedDistricts, setTempSelectedDistricts] = useState(initialDistricts); 
  const [appliedDistricts, setAppliedDistricts] = useState(initialDistricts); 

  // Price Filter State
  const initialPrice = () => {
      const p = searchParams.get('price_target');
      return p ? parseInt(p, 10).toLocaleString() : '';
  };
  const [priceTarget, setPriceTarget] = useState(initialPrice); // Stores formatted string "50,000"
  const [tempPriceTarget, setTempPriceTarget] = useState(initialPrice); // Input state

  // Mapping Backend Types to Frontend Tab Keys
  const TYPE_MAPPING = {
    'apartment': '아파트',
    'villa': '연립다세대',
    'officetel': '오피스텔'
  };

  // Fetch Real Estate Stats
  const fetchStats = async () => {
    setLoading(true);
    try {
        const params = new URLSearchParams();
        if (appliedDistricts.length > 0) {
            params.append('gu_list', appliedDistricts.join(','));
        }
        
        // Use state for price_target
        if (priceTarget) {
            params.append('price_target', priceTarget.replace(/,/g, ''));
        }

        // Increase limit to fetch enough data for client-side filtering by type
        params.append('per_page', 1000); 

        const response = await fetch(`/api/v2/stats/real-estate?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        
        if (result.data) {
            setRealEstateStats(result.data);
        }
    } catch (error) {
        console.error("Failed to fetch stats:", error);
    }
    setLoading(false);
  };

  // Effect: Fetch when filters change (Initial fetch will happen because appliedDistricts is initialized)
  useEffect(() => {
    fetchStats();
  }, [appliedDistricts, priceTarget]);

  // Filter Data for UI (Client-side filtering by selected tab "Type")
  const filteredData = realEstateStats.filter(item => {
      return item.building_usage === TYPE_MAPPING[selectedTab];
  });

  // Input Handlers
  const handlePriceChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value === '') {
        setTempPriceTarget('');
        return;
    }
    const numValue = parseInt(value, 10);
    setTempPriceTarget(numValue.toLocaleString());
  };

  // Price Formatter (Unit: 10,000 KRW)
  const formatPrice = (price) => {
     if (!price) return '0원';
     const unit = 10000; // 1억
     const uk = Math.floor(price / unit);
     const remainder = Math.round(price % unit); // Round to avoid decimals
     
     if (uk > 0) {
         return remainder > 0 
            ? `${uk}억 ${remainder.toLocaleString()}만원` 
            : `${uk}억원`;
     }
     return `${remainder.toLocaleString()}만원`;
  };

  const handleRowClick = async (item) => {
    try {
        // Fetch Infra for this District to populate chart
        const res = await fetch(`/api/v2/stats/infra?gu_list=${item.gu_name}&per_page=100`);
        const json = await res.json();
        const infraData = json.data ? json.data.find(d => d.dong_name === item.dong_name) : null;
        
        let chartData = [];
        if (infraData) {
            chartData = [
                { name: '버스 정류장', value: infraData.bus_count, color: '#FF8A80' },
                { name: '병원', value: infraData.hospital_count, color: '#69F0AE' },
                { name: '공원', value: infraData.park_count, color: '#FF80AB' },
                { name: '지하철 역', value: infraData.subway_count, color: '#82B1FF' },
                { name: '학교', value: infraData.school_count, color: '#FFBB33' },
                { name: '마트', value: infraData.mart_count, color: '#E0E0E0' },
            ];
        } else {
             chartData = [{ name: '데이터 없음', value: 0, color: '#CCC' }];
        }
        
        setSelectedItem({
            ...item,
            district: item.gu_name,
            neighborhood: item.dong_name,
            formattedPrice: formatPrice(item.avg_price),
            chartData
        });

    } catch (e) {
        console.error("Failed to fetch details:", e);
        setSelectedItem({
            ...item,
            district: item.gu_name,
            neighborhood: item.dong_name,
            formattedPrice: formatPrice(item.avg_price),
            chartData: []
        });
    }
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handleSearchClick = () => {
      // Just focus input? or navigate home? User wants to search here now.
      // navigate('/'); 
  }

  // Toggle District Dropdown
  const toggleDistrictDropdown = () => {
    if (!showDistrictDropdown) {
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

  // Apply Selection (Main Search Action)
  const handleApplySearch = () => {
      setAppliedDistricts(tempSelectedDistricts);
      setPriceTarget(tempPriceTarget);
      setShowDistrictDropdown(false);
  };

  return (
    <div className="listing-container">
      {/* Header */}
      <header className="listing-header">
        <div className="search-bar-fake">
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
            {/* 1. District Filter */}
            <div className="filter-group">
                <div 
                    className={`dropdown ${showDistrictDropdown ? 'active' : ''} ${appliedDistricts.length > 0 ? 'highlight' : ''}`} 
                    onClick={toggleDistrictDropdown}
                >
                    <span>
                        {tempSelectedDistricts.length > 0 
                            ? `${tempSelectedDistricts[0]} 외 ${tempSelectedDistricts.length - 1}개` 
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
                        {/* No confirm button inside dropdown needed now, usage pattern changed to global search button */}
                    </div>
                )}
            </div>
            
            {/* 2. Price Filter */}
            <div className="filter-group">
                <div className="price-input-wrapper">
                    <input 
                        type="text" 
                        value={tempPriceTarget}
                        onChange={handlePriceChange}
                        placeholder="예산 (만원)"
                    />
                    <span className="unit">만원</span>
                </div>
            </div>

            {/* 3. Search Button */}
            <button className="btn-search-apply" onClick={handleApplySearch}>
                검색
            </button>
            
            {/* Loading Indicator */}
            {loading && <div className="loading-indicator">데이터 로딩중...</div>}
        </div>

        {/* Stats */}
        <div className="stats-row">
            총 매물(그룹) 수 <strong>{filteredData.length.toLocaleString()}</strong>
        </div>

        {/* Table */}
        <div className="table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        <th style={{width: '60px'}}>No</th>
                        <th>자치구명</th>
                        <th>법정동명</th>
                        <th>평균 실거래가</th>
                        <th>거래 건수</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.length > 0 ? (
                        filteredData.map((item, index) => (
                            <tr key={`${item.gu_name}-${item.dong_name}-${index}`} onClick={() => handleRowClick(item)}>
                                <td>{index + 1}</td>
                                <td>{item.gu_name}</td>
                                <td>{item.dong_name}</td>
                                <td>{formatPrice(item.avg_price)}</td>
                                <td>{item.count}건</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>
                                {loading ? '데이터를 불러오는 중입니다...' : '조건에 맞는 데이터가 없습니다.'}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </main>

      <div className="fab-up" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
        <ArrowUp size={20} />
      </div>

      <DetailModal item={selectedItem} onClose={handleCloseModal} />
    </div>
  );
};

export default ListingPage;
