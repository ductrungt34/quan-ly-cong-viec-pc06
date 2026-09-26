import React, { useState, useEffect } from 'react';
import { X, FileText, CheckCircle2, Calendar, User, Tag, Clock } from 'lucide-react';
import { OFFICERS } from '../constants/officersData';
import { getTodayDateString } from '../utils/dateUtils';

export default function DocumentModal({ isOpen, onClose, onSave, editingDoc, categories, currentUser }) {
  const [formData, setFormData] = useState({
    docNumber: '',
    docDate: getTodayDateString(),
    excerpt: '',
    category: categories[0]?.name || 'Cư trú',
    officerId: currentUser.role === 'user' ? currentUser.id : 'cb_1',
    receivedDate: getTodayDateString(),
    isTrackingOnly: false,
    deadlineDate: '',
    resultDocNumber: '',
    resultDocDate: '',
    resultExcerpt: ''
  });

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (editingDoc) {
      setFormData({
        ...editingDoc,
        deadlineDate: editingDoc.deadlineDate || '',
        resultDocNumber: editingDoc.resultDocNumber || '',
        resultDocDate: editingDoc.resultDocDate || '',
        resultExcerpt: editingDoc.resultExcerpt || ''
      });
    } else {
      setFormData({
        docNumber: '',
        docDate: getTodayDateString(),
        excerpt: '',
        category: categories[0]?.name || 'Cư trú',
        officerId: currentUser.role === 'user' ? currentUser.id : 'cb_1',
        receivedDate: getTodayDateString(),
        isTrackingOnly: false,
        deadlineDate: '',
        resultDocNumber: '',
        resultDocDate: '',
        resultExcerpt: ''
      });
    }
    setErrorMsg('');
  }, [editingDoc, isOpen, currentUser, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.docNumber.trim()) {
      setErrorMsg('Vui lòng nhập Số/Ký hiệu văn bản');
      return;
    }
    if (!formData.excerpt.trim()) {
      setErrorMsg('Vui lòng nhập Trích yếu nội dung văn bản');
      return;
    }
    if (!formData.isTrackingOnly && !formData.deadlineDate) {
      setErrorMsg('Vui lòng chọn Thời hạn xử lý hoặc tích chọn "Văn bản theo dõi"');
      return;
    }

    onSave({
      ...formData,
      id: editingDoc?.id || `doc_${Date.now()}`
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#143e21] text-white px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between border-b border-[#286f3b] flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="p-1.5 sm:p-2 bg-lime-500/20 rounded-lg text-lime-300 flex-shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold leading-tight">
                {editingDoc ? 'Cập Nhật Văn Bản' : 'Tiếp Nhận & Theo Dõi Văn Bản Mới'}
              </h2>
              <p className="text-[10px] sm:text-xs text-lime-200/80">Nhập đầy đủ thông tin văn bản đến và phân công cán bộ</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-3.5 sm:p-6 space-y-4 overflow-y-auto text-xs flex-1">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Row 1: Số hiệu & Ngày văn bản */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Số / Ký hiệu VB <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: 1245/CATP-PC06 hoặc 45/Đ2"
                  value={formData.docNumber}
                  onChange={(e) => setFormData({ ...formData, docNumber: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Ngày ban hành VB <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.docDate}
                  onChange={(e) => setFormData({ ...formData, docDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Row 2: Trích yếu */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Trích yếu nội dung <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                placeholder="Nhập tóm tắt nội dung chỉ đạo, yêu cầu của văn bản..."
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>

            {/* Row 3: Lĩnh vực & Cán bộ thực hiện */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-blue-600" /> Lĩnh vực <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-600" /> Cán bộ thực hiện <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.officerId}
                  onChange={(e) => setFormData({ ...formData, officerId: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  {OFFICERS.map((officer) => (
                    <option key={officer.id} value={officer.id}>
                      {officer.name} - {officer.position} {officer.communes.length > 0 ? `(${officer.communes.slice(0, 2).join(', ')}...)` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 4: Ngày nhận & Thời hạn xử lý */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-600" /> Ngày nhận <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.receivedDate}
                  onChange={(e) => setFormData({ ...formData, receivedDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" /> Thời hạn xử lý
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900 font-medium text-[11px]">
                    <input
                      type="checkbox"
                      checked={formData.isTrackingOnly}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData({
                          ...formData,
                          isTrackingOnly: checked,
                          deadlineDate: checked ? '' : formData.deadlineDate
                        });
                      }}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>Văn bản theo dõi (không hạn)</span>
                  </label>
                </div>

                <input
                  type="date"
                  disabled={formData.isTrackingOnly}
                  value={formData.deadlineDate}
                  onChange={(e) => setFormData({ ...formData, deadlineDate: e.target.value })}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none ${
                    formData.isTrackingOnly
                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                      : 'bg-white border-slate-300'
                  }`}
                />
              </div>
            </div>

            {/* Row 5: Kết quả thực hiện (Optional lúc tạo, cập nhật khi hoàn thành) */}
            <div className="pt-2">
              <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Kết quả thực hiện (Để chốt trạng thái "Đã hoàn thành")
                  </span>
                  <span className="text-[11px] text-emerald-700 italic">Có thể bổ sung sau khi có văn bản kết quả</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Số / Ký hiệu VB kết quả
                    </label>
                    <input
                      type="text"
                      placeholder="VD: 312/BC-Đ2 hoặc 56/TB-PC06"
                      value={formData.resultDocNumber}
                      onChange={(e) => setFormData({ ...formData, resultDocNumber: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Ngày VB kết quả
                    </label>
                    <input
                      type="date"
                      value={formData.resultDocDate}
                      onChange={(e) => setFormData({ ...formData, resultDocDate: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Trích yếu kết quả thực hiện
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Tóm tắt kết quả xử lý, báo cáo đã gửi, biện pháp thực hiện..."
                    value={formData.resultExcerpt}
                    onChange={(e) => setFormData({ ...formData, resultExcerpt: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg shadow-md transition-colors"
            >
              {editingDoc ? 'Lưu Thay Đổi' : 'Tạo Văn Bản Mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
