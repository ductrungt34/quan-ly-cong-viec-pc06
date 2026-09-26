import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, FileCheck, Calendar, AlertCircle } from 'lucide-react';
import { getTodayDateString, formatDateVN } from '../utils/dateUtils';

export default function DocumentResultModal({ isOpen, onClose, onSaveResult, document }) {
  const [resultDocNumber, setResultDocNumber] = useState('');
  const [resultDocDate, setResultDocDate] = useState(getTodayDateString());
  const [resultExcerpt, setResultExcerpt] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (document) {
      setResultDocNumber(document.resultDocNumber || '');
      setResultDocDate(document.resultDocDate || getTodayDateString());
      setResultExcerpt(document.resultExcerpt || '');
      setErrorMsg('');
    }
  }, [document, isOpen]);

  if (!isOpen || !document) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!resultDocNumber.trim()) {
      setErrorMsg('Vui lòng nhập Số/Ký hiệu văn bản kết quả');
      return;
    }
    if (!resultExcerpt.trim()) {
      setErrorMsg('Vui lòng nhập Trích yếu kết quả thực hiện');
      return;
    }

    onSaveResult(document.id, {
      resultDocNumber: resultDocNumber.trim(),
      resultDocDate: resultDocDate,
      resultExcerpt: resultExcerpt.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="bg-emerald-900 text-white px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between border-b border-emerald-800 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="p-1.5 sm:p-2 bg-emerald-700/50 rounded-lg text-emerald-200 flex-shrink-0">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold leading-tight">Cập Nhật Kết Quả Thực Hiện Văn Bản</h2>
              <p className="text-[10px] sm:text-xs text-emerald-200">Chốt trạng thái "Đã hoàn thành" khi có văn bản kết quả</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-4 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1">
            {/* Info summary */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-sm">{document.docNumber}</span>
                <span className="text-slate-500 font-mono">Ngày VB: {formatDateVN(document.docDate)}</span>
              </div>
              <p className="text-slate-700 text-xs line-clamp-2 italic">"{document.excerpt}"</p>
              {document.deadlineDate && (
                <div className="text-[11px] text-amber-700 font-semibold pt-1">
                  Thời hạn xử lý: {formatDateVN(document.deadlineDate)}
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Số / Ký hiệu VB kết quả <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: 512/BC-PC06 hoặc 48/Đ2"
                  value={resultDocNumber}
                  onChange={(e) => setResultDocNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Ngày ban hành VB kết quả <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={resultDocDate}
                  onChange={(e) => setResultDocDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Trích yếu kết quả thực hiện <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Mô tả tóm tắt kết quả, báo cáo, biện pháp đã tiến hành giải quyết công việc..."
                value={resultExcerpt}
                onChange={(e) => setResultExcerpt(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-md transition-colors flex items-center gap-1.5"
            >
              <FileCheck className="w-4 h-4" /> Cập Nhật Kết Quả
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
