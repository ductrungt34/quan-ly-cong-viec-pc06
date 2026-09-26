import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Upload, Paperclip, AlertTriangle, MapPin, Calendar, Lock } from 'lucide-react';
import { formatDateVN, calculateDaysRemaining } from '../utils/dateUtils';
import { OFFICERS } from '../constants/officersData';

export default function TaskSubmissionModal({ isOpen, onClose, onSaveSubmission, task, officerId }) {
  const officer = OFFICERS.find(o => o.id === officerId) || {};
  const currentSubmission = task?.submissions?.[officerId] || {};

  // Lấy danh sách xã được giao cụ thể trong nhiệm vụ này
  const assignedCommunesForThisTask = (task?.assignedCommunes && task.assignedCommunes[officerId]) 
    ? task.assignedCommunes[officerId] 
    : (officer.communes || []);

  const [mode, setMode] = useState('per_commune'); // 'per_commune' | 'all_communes'
  const [generalStatus, setGeneralStatus] = useState('Đang thực hiện');
  const [communeStatuses, setCommuneStatuses] = useState({});
  const [notes, setNotes] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const daysRemaining = task ? calculateDaysRemaining(task.deadline) : null;
  const isPastDeadline = daysRemaining !== null && daysRemaining < 0;

  // Kiểm tra nếu đã quá hạn mà chưa hoàn thành -> KHÓA cập nhật!
  const isAlreadyDoneBefore = currentSubmission?.urgingStatus === 'Đã đôn đốc / Hoàn thành' || currentSubmission?.urgingStatus === 'Đã hoàn thành';
  const isLockedDueToOverdue = isPastDeadline && !isAlreadyDoneBefore;

  useEffect(() => {
    if (task && officerId) {
      const sub = task.submissions?.[officerId] || {};
      setGeneralStatus(sub.urgingStatus || 'Đang thực hiện');
      setMode(sub.mode || 'per_commune');
      setNotes(sub.notes || '');
      setAttachmentName(sub.attachmentName || '');
      setSelectedFileName(sub.attachmentName || '');

      const initialCommuneStatus = {};
      assignedCommunesForThisTask.forEach(cName => {
        initialCommuneStatus[cName] = {
          status: sub.communeResults?.[cName]?.status || sub.urgingStatus || 'Đang thực hiện',
          notes: sub.communeResults?.[cName]?.notes || ''
        };
      });
      setCommuneStatuses(initialCommuneStatus);
      setErrorMsg('');
    }
  }, [task, officerId, isOpen]);

  if (!isOpen || !task) return null;

  const handleCommuneStatusChange = (communeName, newStatus) => {
    if (isLockedDueToOverdue) return;
    setCommuneStatuses(prev => ({
      ...prev,
      [communeName]: {
        ...(prev[communeName] || {}),
        status: newStatus
      }
    }));
  };

  const handleCommuneNoteChange = (communeName, newNote) => {
    if (isLockedDueToOverdue) return;
    setCommuneStatuses(prev => ({
      ...prev,
      [communeName]: {
        ...(prev[communeName] || {}),
        notes: newNote
      }
    }));
  };

  const applyStatusToAllCommunes = (statusToApply) => {
    if (isLockedDueToOverdue) return;
    const updated = {};
    assignedCommunesForThisTask.forEach(cName => {
      updated[cName] = {
        status: statusToApply,
        notes: communeStatuses[cName]?.notes || ''
      };
    });
    setCommuneStatuses(updated);
    setGeneralStatus(statusToApply);
  };

  const handleFileChange = (e) => {
    if (isLockedDueToOverdue) return;
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      setAttachmentName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLockedDueToOverdue) {
      alert('Nhiệm vụ đã quá thời hạn được giao và không thể chỉnh sửa. Hệ thống đã khóa và ghi nhận trạng thái: Chưa đôn đốc.');
      return;
    }

    if (!notes.trim()) {
      setErrorMsg('Vui lòng nhập Báo cáo tóm tắt chung tình hình đôn đốc');
      return;
    }

    let computedGeneralStatus = generalStatus;
    if (mode === 'per_commune' && assignedCommunesForThisTask.length > 0) {
      const allDone = assignedCommunesForThisTask.every(c => communeStatuses[c]?.status === 'Đã hoàn thành');
      const anyProgress = assignedCommunesForThisTask.some(c => communeStatuses[c]?.status === 'Đã hoàn thành' || communeStatuses[c]?.status === 'Đang thực hiện');
      if (allDone) {
        computedGeneralStatus = 'Đã đôn đốc / Hoàn thành';
      } else if (anyProgress) {
        computedGeneralStatus = 'Đang thực hiện';
      } else {
        computedGeneralStatus = 'Chưa đôn đốc';
      }
    }

    onSaveSubmission(task.id, officerId, {
      mode,
      urgingStatus: computedGeneralStatus,
      communeResults: communeStatuses,
      notes: notes.trim(),
      attachmentName: attachmentName.trim() || selectedFileName || '',
      submittedAt: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-emerald-300 animate-in fade-in zoom-in-95 duration-200 max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#143e21] text-white px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between border-b border-[#286f3b] flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="p-1.5 sm:p-2 bg-lime-500/20 rounded-lg text-lime-300 flex-shrink-0">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold leading-tight">Cập Nhật Tiến Độ Đôn Đốc Công An Xã</h2>
              <p className="text-[10px] sm:text-xs text-lime-200">Cán bộ phụ trách: <strong>{officer.name}</strong> ({officer.rank})</p>
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
            {/* Cảnh báo khóa quá hạn */}
            {isLockedDueToOverdue && (
              <div className="p-3 bg-red-100 border border-red-300 text-red-900 rounded-xl flex items-start gap-2 text-xs font-semibold">
                <Lock className="w-4 h-4 text-red-700 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold uppercase text-red-800">Quyền Cập Nhật Đã Bị Khóa</div>
                  <p className="mt-0.5 text-[11px] font-normal">
                    Đã quá thời hạn được giao ({formatDateVN(task.deadline)}). Theo quy chế nghiệp vụ, hệ thống đã khóa quyền cập nhật, chỉnh sửa kết quả đôn đốc của cán bộ và tự động ghi nhận trạng thái: <strong>Chưa đôn đốc</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* Task summary */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
              <div className="font-bold text-slate-900 text-sm">{task.title}</div>
              <p className="text-slate-600 line-clamp-2">{task.content}</p>
              
              <div className="flex flex-wrap items-center justify-between pt-1.5 border-t border-emerald-200 text-[11px]">
                <div className="flex items-center gap-1 text-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Hạn chót hoàn thành: <strong>{formatDateVN(task.deadline)}</strong></span>
                </div>
                <div>
                  {isPastDeadline ? (
                    <span className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      Đã quá hạn {Math.abs(daysRemaining)} ngày
                    </span>
                  ) : (
                    <span className="text-emerald-800 font-semibold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                      Còn {daysRemaining} ngày đến hạn
                    </span>
                  )}
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* LỰA CHỌN ĐÔN ĐỐC */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <label className="font-bold text-[#143e21] text-xs flex items-center gap-1.5 uppercase tracking-wide">
                  <MapPin className="w-4 h-4 text-emerald-700" /> Địa bàn được giao đôn đốc ({assignedCommunesForThisTask.length} xã/phường)
                </label>
                
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="reportMode"
                      value="per_commune"
                      disabled={isLockedDueToOverdue}
                      checked={mode === 'per_commune'}
                      onChange={() => setMode('per_commune')}
                      className="text-emerald-700 focus:ring-emerald-500"
                    />
                    <span className={mode === 'per_commune' ? 'text-emerald-800 font-bold' : 'text-slate-600'}>
                      Từng xã riêng biệt
                    </span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="reportMode"
                      value="all_communes"
                      disabled={isLockedDueToOverdue}
                      checked={mode === 'all_communes'}
                      onChange={() => setMode('all_communes')}
                      className="text-emerald-700 focus:ring-emerald-500"
                    />
                    <span className={mode === 'all_communes' ? 'text-emerald-800 font-bold' : 'text-slate-600'}>
                      Chung tất cả các xã
                    </span>
                  </label>
                </div>
              </div>

              {/* Mode 1: Từng xã riêng biệt */}
              {mode === 'per_commune' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Chọn kết quả đôn đốc cho từng địa bàn:</span>
                    {!isLockedDueToOverdue && (
                      <div className="space-x-1.5">
                        <button
                          type="button"
                          onClick={() => applyStatusToAllCommunes('Đã hoàn thành')}
                          className="text-emerald-700 font-semibold hover:underline"
                        >
                          ✓ Đặt tất cả Hoàn thành
                        </button>
                        <span>|</span>
                        <button
                          type="button"
                          onClick={() => applyStatusToAllCommunes('Đang thực hiện')}
                          className="text-blue-700 font-semibold hover:underline"
                        >
                          Đặt tất cả Đang làm
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {assignedCommunesForThisTask.map((communeName, idx) => {
                      const cStatus = communeStatuses[communeName]?.status || 'Đang thực hiện';
                      const cNote = communeStatuses[communeName]?.notes || '';

                      return (
                        <div key={idx} className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1.5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                            <div className="font-bold text-slate-800 flex items-center gap-1">
                              <span className="w-4 text-slate-400 font-mono text-[10px]">{idx + 1}.</span>
                              <span className="text-xs text-[#143e21]">{communeName}</span>
                            </div>

                            <div className="flex items-center gap-1 text-[11px]">
                              {['Đã hoàn thành', 'Đang thực hiện', 'Chưa đôn đốc'].map((st) => (
                                <button
                                  key={st}
                                  type="button"
                                  disabled={isLockedDueToOverdue}
                                  onClick={() => handleCommuneStatusChange(communeName, st)}
                                  className={`px-2 py-0.5 rounded border text-[10px] font-semibold transition-all ${
                                    cStatus === st
                                      ? st === 'Đã hoàn thành'
                                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                        : st === 'Đang thực hiện'
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                        : 'bg-slate-700 text-white border-slate-700 shadow-xs'
                                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                  } ${isLockedDueToOverdue ? 'opacity-60 cursor-not-allowed' : ''}`}
                                >
                                  {st === 'Đã hoàn thành' ? 'Hoàn thành' : st === 'Đang thực hiện' ? 'Đang làm' : 'Chưa làm'}
                                </button>
                              ))}
                            </div>
                          </div>

                          <input
                            type="text"
                            disabled={isLockedDueToOverdue}
                            placeholder={`Ghi chú số liệu/vướng mắc riêng tại ${communeName}...`}
                            value={cNote}
                            onChange={(e) => handleCommuneNoteChange(communeName, e.target.value)}
                            className={`w-full px-2 py-1 text-[11px] border border-slate-200 rounded focus:ring-1 focus:ring-emerald-500 focus:outline-none ${isLockedDueToOverdue ? 'bg-slate-100 cursor-not-allowed' : ''}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Mode 2: Chung tất cả */
                <div className="space-y-2">
                  <span className="text-[11px] text-slate-600">Chọn trạng thái áp dụng đồng bộ cho {assignedCommunesForThisTask.length} xã phụ trách:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {['Đã đôn đốc / Hoàn thành', 'Đang thực hiện', 'Chưa đôn đốc'].map(st => (
                      <button
                        key={st}
                        type="button"
                        disabled={isLockedDueToOverdue}
                        onClick={() => applyStatusToAllCommunes(st === 'Đã đôn đốc / Hoàn thành' ? 'Đã hoàn thành' : st)}
                        className={`p-2 rounded-lg border text-xs font-bold transition-all ${
                          generalStatus === st || (st.includes('Hoàn thành') && generalStatus.includes('Hoàn thành'))
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs ring-2 ring-emerald-300'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        } ${isLockedDueToOverdue ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tài liệu đính kèm */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Tài liệu đính kèm minh chứng (Biên bản kiểm tra, file Excel danh sách...)
              </label>
              <div className="flex items-center gap-2">
                <label className={`px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-lg border border-emerald-300 flex items-center gap-1.5 transition-colors font-medium ${isLockedDueToOverdue ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
                  <Upload className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Chọn tệp</span>
                  <input type="file" disabled={isLockedDueToOverdue} onChange={handleFileChange} className="hidden" />
                </label>
                <div className="flex-1 flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    disabled={isLockedDueToOverdue}
                    placeholder="VD: BienBan_KiemTra_DiaBan.pdf..."
                    value={attachmentName}
                    onChange={(e) => setAttachmentName(e.target.value)}
                    className={`w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none ${isLockedDueToOverdue ? 'bg-slate-100 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>
            </div>

            {/* Báo cáo tổng hợp */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Báo cáo tổng hợp tình hình đôn đốc toàn địa bàn <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                disabled={isLockedDueToOverdue}
                placeholder="Nêu tóm tắt kết quả toàn địa bàn phụ trách, các khó khăn vướng mắc chung, kiến nghị Ban Chỉ huy Đội..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={`w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none ${isLockedDueToOverdue ? 'bg-slate-100 cursor-not-allowed' : ''}`}
                required
              />
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
            >
              {isLockedDueToOverdue ? 'Đóng lại' : 'Hủy'}
            </button>
            {!isLockedDueToOverdue && (
              <button
                type="submit"
                className="px-5 py-1.5 bg-[#143e21] hover:bg-[#1a4e2a] text-amber-300 font-bold rounded-lg shadow-md transition-colors"
              >
                Lưu & Nộp Báo Cáo
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
