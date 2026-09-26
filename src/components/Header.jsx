import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Award, CheckCircle2, Layers, UserCheck } from 'lucide-react';
import { OFFICERS } from '../constants/officersData';

export default function Header({ currentUser, onSwitchUser, activeTab, onSelectTab, onOpenCategoryModal }) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      setCurrentDateTime(now.toLocaleDateString('vi-VN', options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isAdmin = currentUser.role === 'admin';

  return (
    <header className="bg-[#143e21] text-white shadow-lg sticky top-0 z-50 border-b border-[#286f3b]">
      {/* Top Banner - Xanh lá mạ & Đỏ viền Vàng Cảnh sát */}
      <div className="bg-gradient-to-r from-[#10351b] via-[#184e28] to-[#1f6333] px-2.5 sm:px-6 py-1.5 sm:py-2 border-b border-amber-400/30">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-2 text-[11px] sm:text-xs md:text-sm">
          <div className="flex items-center gap-1.5 sm:gap-2 tracking-wide font-semibold text-amber-300 text-center sm:text-left">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-lime-400 animate-ping inline-block flex-shrink-0"></span>
            <span className="hidden md:inline">CÔNG AN THÀNH PHỐ HẢI PHÒNG • PHÒNG CẢNH SÁT QUẢN LÝ HÀNH CHÍNH VỀ TRẬT TỰ XÃ HỘI (PC06)</span>
            <span className="inline md:hidden text-[10.5px]">CATP HẢI PHÒNG • PHÒNG CẢNH SÁT QLHC VỀ TTXH (PC06)</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-lime-200 text-[10px] sm:text-xs">
            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 flex-shrink-0" />
            <span className="truncate">{currentDateTime || 'Đang đồng bộ thời gian...'}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="w-full px-2.5 sm:px-6 py-2">
        <div className="flex items-center justify-between gap-2">
          {/* Logo với Huy hiệu chính thức C06/PC06 & Tiêu đề */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div 
              className="relative rounded-full overflow-hidden bg-white shadow-md ring-2 ring-amber-400 flex items-center justify-center flex-shrink-0"
              style={{ width: '44px', height: '44px', minWidth: '44px', minHeight: '44px', maxWidth: '44px', maxHeight: '44px' }}
            >
              <img 
                src="/logo_pc06.png" 
                alt="Huy hiệu Cảnh sát QLHC về TTXH" 
                className="object-cover scale-105"
                style={{ width: '44px', height: '44px', minWidth: '44px', minHeight: '44px', maxWidth: '44px', maxHeight: '44px', display: 'block' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'logo_pc06.png';
                }}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="bg-red-700 text-amber-300 border border-amber-400/60 text-[10px] sm:text-[11px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider shadow-xs">
                  Đội 2 - PC06
                </span>
                <span className="text-[10px] sm:text-xs text-lime-200 font-medium truncate">
                  Điều hành Nội bộ
                </span>
              </div>
              <h1 className="text-xs sm:text-base md:text-xl font-bold tracking-tight text-white leading-tight mt-0.5 truncate">
                Quản Lý Văn Bản & Đôn Đốc Công An Xã
              </h1>
            </div>
          </div>

          {/* User Profile & Role Switcher */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-1.5 sm:gap-2.5 bg-[#194c29] hover:bg-[#1f5e34] text-left px-2 sm:px-3 py-1.5 rounded-xl border border-[#2e7d44] transition-all shadow-sm group"
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-inner flex-shrink-0 ${
                  isAdmin 
                    ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300' 
                    : 'bg-lime-500 text-slate-950 ring-2 ring-lime-300'
                }`}>
                  {isAdmin ? 'CH' : 'CB'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-amber-200 truncate max-w-[120px] md:max-w-[160px]">
                      {currentUser.name}
                    </span>
                    <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      isAdmin 
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' 
                        : 'bg-lime-400/20 text-lime-300 border border-lime-400/40'
                    }`}>
                      {isAdmin ? 'Chỉ huy' : 'Cán bộ'}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-lime-200/80 truncate max-w-[170px]">
                    {currentUser.position}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-lime-300 group-hover:text-white transition-transform" />
              </button>

              {/* Dropdown Menu - Phù hợp màn hình điện thoại */}
              {showUserDropdown && (
                <div 
                  className="absolute right-0 mt-2 w-[calc(100vw-24px)] sm:w-84 max-w-[350px] max-h-[75vh] overflow-y-auto bg-[#133e21] rounded-xl shadow-2xl border border-[#2f8546] py-2 z-50 divide-y divide-[#1e5830]"
                  onClick={() => setShowUserDropdown(false)}
                >
                  <div className="px-3 py-1.5 bg-[#0e2c17]">
                    <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Mô phỏng Phân quyền / Đổi Cán bộ
                    </p>
                    <p className="text-[10px] text-lime-200/80">
                      Chạm để chọn Chỉ huy hoặc Cán bộ kiểm tra phân quyền.
                    </p>
                  </div>

                  {/* Chỉ huy Đội (Admin) */}
                  <div className="py-1">
                    <div className="px-3 py-1 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                      Ban Chỉ Huy Đội (Admin)
                    </div>
                    {OFFICERS.filter(o => o.role === 'admin').map(officer => (
                      <button
                        key={officer.id}
                        type="button"
                        onClick={() => onSwitchUser(officer.id)}
                        className={`w-full text-left px-3 py-2 flex items-start gap-2.5 text-xs hover:bg-[#1b552d] transition-colors ${
                          officer.id === currentUser.id ? 'bg-[#206636] text-amber-200 border-l-4 border-amber-400 font-bold' : 'text-slate-100'
                        }`}
                      >
                        <UserCheck className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-white">{officer.name}</div>
                          <div className="text-[11px] text-lime-200/80">{officer.position} ({officer.responsibility})</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* 21 Cán bộ địa bàn */}
                  <div className="py-1">
                    <div className="px-3 py-1 text-[11px] font-bold text-lime-400 uppercase tracking-wider">
                      21 Cán Bộ Địa Bàn (User)
                    </div>
                    {OFFICERS.filter(o => o.role === 'user').map((officer, idx) => (
                      <button
                        key={officer.id}
                        type="button"
                        onClick={() => onSwitchUser(officer.id)}
                        className={`w-full text-left px-3 py-2 flex items-start gap-2.5 text-xs hover:bg-[#1b552d] transition-colors ${
                          officer.id === currentUser.id ? 'bg-[#206636] text-lime-200 border-l-4 border-lime-400 font-bold' : 'text-slate-100'
                        }`}
                      >
                        <span className="w-4 text-lime-400 font-mono text-[11px] text-right mt-0.5">{idx + 1}.</span>
                        <div className="flex-1">
                          <div className="font-semibold text-white">{officer.name}</div>
                          <div className="text-[11px] text-lime-200/80 truncate">
                            Địa bàn: {officer.communes.join(', ')}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation - Tông màu Xanh lá mạ & Vàng Đồng, vuốt mượt mà trên điện thoại */}
        <div className="flex items-center gap-1.5 sm:gap-2 mt-2 pt-2 border-t border-[#205831] overflow-x-auto no-scrollbar text-xs sm:text-sm pb-1">
          <button
            type="button"
            onClick={() => onSelectTab('dashboard')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg font-bold transition-all whitespace-nowrap min-h-[36px] ${
              activeTab === 'dashboard'
                ? 'bg-lime-400 text-slate-950 font-bold shadow-md ring-2 ring-lime-300'
                : 'text-lime-100 hover:bg-[#1c552e] hover:text-white'
            }`}
          >
            <Award className="w-4 h-4 flex-shrink-0" />
            <span>Tổng Quan & Xếp Hạng</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('documents')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg font-bold transition-all whitespace-nowrap min-h-[36px] ${
              activeTab === 'documents'
                ? 'bg-lime-400 text-slate-950 font-bold shadow-md ring-2 ring-lime-300'
                : 'text-lime-100 hover:bg-[#1c552e] hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 flex-shrink-0" />
            <span>Module 1: Văn Bản Hàng Ngày</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('tasks')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg font-bold transition-all whitespace-nowrap min-h-[36px] ${
              activeTab === 'tasks'
                ? 'bg-lime-400 text-slate-950 font-bold shadow-md ring-2 ring-lime-300'
                : 'text-lime-100 hover:bg-[#1c552e] hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Module 2: Đôn Đốc Công An Xã</span>
          </button>

          {/* Admin category settings button */}
          {isAdmin && (
            <button
              type="button"
              onClick={onOpenCategoryModal}
              className="ml-auto text-xs bg-[#194c29] hover:bg-[#205d33] text-lime-200 hover:text-white px-2.5 sm:px-3 py-1.5 rounded-lg border border-[#2d7943] flex items-center gap-1.5 transition-colors whitespace-nowrap min-h-[36px]"
            >
              <span>⚙️ Lĩnh vực</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
