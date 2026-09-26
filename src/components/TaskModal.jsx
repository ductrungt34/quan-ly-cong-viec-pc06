import React, { useState } from 'react';
import { X, CheckSquare, Users, Calendar, Tag, AlertCircle, MapPin, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { OFFICERS } from '../constants/officersData';
import { getTodayDateString } from '../utils/dateUtils';

export default function TaskModal({ isOpen, onClose, onSave, categories, currentUser }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Đề án 06');
  const [deadline, setDeadline] = useState('');
  
  // 1. Phân công Cán bộ: 'all' (Tất cả 21 cán bộ) hoặc 'custom' (Chỉ định từng cán bộ)
  const [assignScope, setAssignScope] = useState('all');
  const [selectedOfficerIds, setSelectedOfficerIds] = useState([]);

  // 2. Phân công Địa bàn: 'all_communes' (Tất cả xã/phường phụ trách) hoặc 'custom_communes' (Chỉ định 1 số xã/phường)
  const [communeScope, setCommuneScope] = useState('all_communes');
  
  // Lưu danh sách xã/phường được giao cho từng cán bộ: { officerId: ['Xã A', 'Xã B'] }
  const [officerCommuneSelections, setOfficerCommuneSelections] = useState({});
  const [expandedOfficerId, setExpandedOfficerId] = useState(null);

  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const areaOfficers = OFFICERS.filter(o => o.role === 'user');

  // Khởi tạo các xã mặc định
  const getAssignedOfficersList = () => {
    if (assignScope === 'all') return areaOfficers;
    return areaOfficers.filter(o => selectedOfficerIds.includes(o.id));
  };

  const handleToggleOfficer = (officerId) => {
    if (selectedOfficerIds.includes(officerId)) {
      setSelectedOfficerIds(selectedOfficerIds.filter(id => id !== officerId));
    } else {
      setSelectedOfficerIds([...selectedOfficerIds, officerId]);
      // Mặc định chọn tất cả các xã của đồng chí đó nếu chưa có
      if (!officerCommuneSelections[officerId]) {
        const off = areaOfficers.find(o => o.id === officerId);
        setOfficerCommuneSelections(prev => ({
          ...prev,
          [officerId]: off ? [...off.communes] : []
        }));
      }
    }
  };

  const handleToggleCommuneForOfficer = (officerId, communeName) => {
    const off = areaOfficers.find(o => o.id === officerId);
    const currentList = officerCommuneSelections[officerId] || (off ? [...off.communes] : []);
    
    let updated;
    if (currentList.includes(communeName)) {
      updated = currentList.filter(c => c !== communeName);
    } else {
      updated = [...currentList, communeName];
    }

    setOfficerCommuneSelections(prev => ({
      ...prev,
      [officerId]: updated
    }));
  };

  const handleSelectAllCommunesForOfficer = (officerId) => {
    const off = areaOfficers.find(o => o.id === officerId);
    if (off) {
      setOfficerCommuneSelections(prev => ({
        ...prev,
        [officerId]: [...off.communes]
      }));
    }
  };

  const handleDeselectAllCommunesForOfficer = (officerId) => {
    setOfficerCommuneSelections(prev => ({
      ...prev,
      [officerId]: []
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Vui lòng nhập Tiêu đề nhiệm vụ đôn đốc');
      return;
    }
    if (!content.trim()) {
      setErrorMsg('Vui lòng nhập Nội dung chi tiết chỉ đạo đôn đốc');
      return;
    }
    if (!deadline) {
      setErrorMsg('Vui lòng chọn Thời hạn chót hoàn thành đôn đốc');
      return;
    }

    const assignedOfficers = getAssignedOfficersList();
    if (assignedOfficers.length === 0) {
      setErrorMsg('Vui lòng chọn ít nhất một Cán bộ địa bàn phụ trách');
      return;
    }

    // Xây dựng bản đồ phân công xã/phường cho từng cán bộ
    const finalAssignedCommunes = {};
    for (const officer of assignedOfficers) {
      if (communeScope === 'all_communes') {
        finalAssignedCommunes[officer.id] = [...officer.communes];
      } else {
        const selectedForThisOfficer = officerCommuneSelections[officer.id];
        const list = (selectedForThisOfficer !== undefined) ? selectedForThisOfficer : [...officer.communes];
        if (list.length === 0) {
          setErrorMsg(`Đồng chí ${officer.name} chưa được giao xã/phường nào. Vui lòng chọn ít nhất 1 xã hoặc bỏ chọn đồng chí này.`);
          return;
        }
        finalAssignedCommunes[officer.id] = list;
      }
    }

    const newTask = {
      id: `task_${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      category: category,
      deadline: deadline,
      assignedToAll: assignScope === 'all',
      assignedOfficers: assignedOfficers.map(o => o.id),
      assignedCommunes: finalAssignedCommunes, // Danh sách xã cụ thể giao cho từng cán bộ
      createdAt: getTodayDateString(),
      createdByName: `${currentUser.position} ${currentUser.name}`,
      submissions: {}
    };

    onSave(newTask);
    onClose();
  };

  const assignedOfficers = getAssignedOfficersList();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-emerald-300 animate-in fade-in zoom-in-95 duration-200 max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#143e21] text-white px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between border-b border-[#286f3b] flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="p-1.5 sm:p-2 bg-lime-500/20 rounded-lg text-lime-300 flex-shrink-0">
              <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold leading-tight">Giao Nhiệm Vụ Đôn Đốc Công An Cấp Xã</h2>
              <p className="text-[10px] sm:text-xs text-lime-200">Tùy biến phân công theo cán bộ và địa bàn xã/phường cụ thể</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-lime-200 hover:text-white p-1 rounded-lg hover:bg-[#1a4e2a] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-3.5 sm:p-5 space-y-3.5 overflow-y-auto text-xs flex-1">
            {errorMsg && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Tiêu đề */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Tiêu đề nhiệm vụ đôn đốc <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Đôn đốc Công an các xã/phường làm sạch dữ liệu dân cư đợt 3"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            {/* Nội dung chi tiết */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Nội dung chỉ đạo & Yêu cầu cụ thể <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                placeholder="Ghi rõ các chỉ tiêu cụ thể cần đạt, đối tượng rà soát, phương thức báo cáo..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            {/* Lĩnh vực & Thời hạn */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-emerald-700" /> Lĩnh vực <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-red-600" /> Hạn chót hoàn thành <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* 1. LỰA CHỌN CÁN BỘ ĐỊA BÀN ĐƯỢC GIAO */}
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2.5">
              <label className="block font-bold text-[#143e21] flex items-center gap-1.5 text-xs uppercase tracking-wide">
                <Users className="w-4 h-4 text-emerald-700" /> 1. Phạm vi Cán bộ được phân công <span className="text-red-500">*</span>
              </label>

              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-800">
                  <input
                    type="radio"
                    name="assignScope"
                    checked={assignScope === 'all'}
                    onChange={() => {
                      setAssignScope('all');
                      setSelectedOfficerIds(areaOfficers.map(o => o.id));
                    }}
                    className="text-emerald-700 focus:ring-emerald-500"
                  />
                  <span>Giao cho tất cả 21 Cán bộ địa bàn</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-800">
                  <input
                    type="radio"
                    name="assignScope"
                    checked={assignScope === 'custom'}
                    onChange={() => setAssignScope('custom')}
                    className="text-emerald-700 focus:ring-emerald-500"
                  />
                  <span>Chọn cụ thể từng Cán bộ địa bàn</span>
                </label>
              </div>

              {/* Danh sách chọn cán bộ khi chọn 'custom' */}
              {assignScope === 'custom' && (
                <div className="pt-2 border-t border-emerald-200 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-600">
                    <span>Chọn cán bộ thực hiện (Đã chọn: {selectedOfficerIds.length}/21):</span>
                    <div className="space-x-2">
                      <button
                        type="button"
                        onClick={() => setSelectedOfficerIds(areaOfficers.map(o => o.id))}
                        className="text-emerald-700 font-bold hover:underline"
                      >
                        Chọn tất cả
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedOfficerIds([])}
                        className="text-slate-500 hover:underline"
                      >
                        Bỏ chọn
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-1.5 bg-white rounded-lg border border-slate-200">
                    {areaOfficers.map((o) => (
                      <label
                        key={o.id}
                        className={`flex items-center gap-2 p-1.5 rounded border text-[11px] cursor-pointer transition-colors ${
                          selectedOfficerIds.includes(o.id)
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedOfficerIds.includes(o.id)}
                          onChange={() => handleToggleOfficer(o.id)}
                          className="rounded text-emerald-700 focus:ring-emerald-500"
                        />
                        <span className="truncate">{o.name} ({o.communes.length} xã)</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. LỰA CHỌN ĐỊA BÀN ĐÔN ĐỐC (TẤT CẢ HOẶC MỘT SỐ XÃ CỤ THỂ) */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <label className="block font-bold text-[#143e21] flex items-center gap-1.5 text-xs uppercase tracking-wide">
                <MapPin className="w-4 h-4 text-emerald-700" /> 2. Phạm vi Địa bàn đôn đốc của cán bộ <span className="text-red-500">*</span>
              </label>

              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-800">
                  <input
                    type="radio"
                    name="communeScope"
                    checked={communeScope === 'all_communes'}
                    onChange={() => setCommuneScope('all_communes')}
                    className="text-emerald-700 focus:ring-emerald-500"
                  />
                  <span>Giao tất cả các địa bàn mà đồng chí đó phụ trách</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-800">
                  <input
                    type="radio"
                    name="communeScope"
                    checked={communeScope === 'custom_communes'}
                    onChange={() => setCommuneScope('custom_communes')}
                    className="text-emerald-700 focus:ring-emerald-500"
                  />
                  <span>Tùy chỉnh chọn 1 số địa bàn cụ thể cho từng đồng chí</span>
                </label>
              </div>

              {/* Chi tiết chọn xã khi chọn 'custom_communes' */}
              {communeScope === 'custom_communes' && (
                <div className="pt-2 border-t border-slate-200 space-y-2">
                  <p className="text-[11px] text-slate-500 italic">
                    Bấm vào từng cán bộ dưới đây để tích chọn các xã/phường cụ thể cần đôn đốc trong đợt này:
                  </p>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {assignedOfficers.map((officer) => {
                      const selectedCommunes = officerCommuneSelections[officer.id] !== undefined 
                        ? officerCommuneSelections[officer.id] 
                        : officer.communes;
                      const isExpanded = expandedOfficerId === officer.id;

                      return (
                        <div key={officer.id} className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
                          <div 
                            className="p-2 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                            onClick={() => setExpandedOfficerId(isExpanded ? null : officer.id)}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{officer.name}</span>
                              <span className="text-[10px] bg-emerald-100 text-emerald-950 font-semibold px-1.5 py-0.2 rounded border border-emerald-300">
                                Đã chọn: {selectedCommunes.length}/{officer.communes.length} xã
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                              <span className="text-[11px] text-emerald-700 font-semibold">Tùy chỉnh xã</span>
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="p-2.5 bg-emerald-50/40 border-t border-slate-200 space-y-1.5">
                              <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-500">Tích chọn xã đôn đốc cho đồng chí {officer.name}:</span>
                                <div className="space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => handleSelectAllCommunesForOfficer(officer.id)}
                                    className="text-emerald-700 font-bold hover:underline"
                                  >
                                    Chọn tất cả
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeselectAllCommunesForOfficer(officer.id)}
                                    className="text-slate-500 hover:underline"
                                  >
                                    Bỏ chọn
                                  </button>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {officer.communes.map((cName) => {
                                  const isChecked = selectedCommunes.includes(cName);
                                  return (
                                    <button
                                      key={cName}
                                      type="button"
                                      onClick={() => handleToggleCommuneForOfficer(officer.id, cName)}
                                      className={`px-2 py-1 rounded text-[11px] border flex items-center gap-1 transition-all ${
                                        isChecked
                                          ? 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-2xs'
                                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                      }`}
                                    >
                                      {isChecked && <Check className="w-3 h-3" />}
                                      <span>{cName}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 bg-[#143e21] hover:bg-[#1a4e2a] text-amber-300 font-bold rounded-lg shadow-md transition-colors"
            >
              Xác Nhận Giao Nhiệm Vụ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
