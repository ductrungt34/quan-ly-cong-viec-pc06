import React, { useState, useMemo } from 'react';
import { 
  CheckSquare, Plus, Calendar, Clock, AlertTriangle, CheckCircle2, 
  Users, MapPin, Paperclip, ChevronDown, ChevronUp, Search, ShieldCheck, Lock, Eye
} from 'lucide-react';
import { OFFICERS } from '../constants/officersData';
import { formatDateVN, calculateDaysRemaining, computeTaskOfficerStatus } from '../utils/dateUtils';

export default function Module2Tasks({
  tasks,
  currentUser,
  categories,
  onAddTask,
  onOpenSubmissionModal,
  onDeleteTask
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterScope, setFilterScope] = useState('all');
  
  // Thu nhỏ mặc định các bảng theo dõi (expandedTaskId = null)
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const isAdmin = currentUser.role === 'admin';
  const areaOfficers = OFFICERS.filter(o => o.role === 'user');

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (!isAdmin || filterScope === 'my_tasks') {
        const isAssigned = task.assignedToAll || (task.assignedOfficers && task.assignedOfficers.includes(currentUser.id));
        if (!isAssigned && !isAdmin) return false;
      }

      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(term);
        const matchContent = task.content.toLowerCase().includes(term);
        if (!matchTitle && !matchContent) return false;
      }

      if (selectedCategory !== 'all' && task.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [tasks, searchTerm, selectedCategory, filterScope, isAdmin, currentUser]);

  const toggleExpand = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  return (
    <div className="space-y-4 w-full">
      {/* Header Banner */}
      <div className="bg-white p-4 md:p-5 rounded-2xl shadow-xs border border-emerald-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#194c29] text-amber-300 font-bold px-2 py-0.5 rounded text-xs">
                Module 2
              </span>
              <h2 className="text-lg md:text-xl font-bold text-slate-900">Quản Lý & Đánh Giá Tiến Độ Đôn Đốc Công An Cấp Xã</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Giao nhiệm vụ theo cán bộ và địa bàn cụ thể; quá hạn không đôn đốc sẽ bị khóa quyền cập nhật và ghi nhận "Chưa đôn đốc".
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin ? (
              <button
                type="button"
                onClick={onAddTask}
                className="px-4 py-1.5 bg-[#194c29] hover:bg-[#205e33] text-amber-300 text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>Giao Nhiệm Vụ Mới</span>
              </button>
            ) : (
              <div className="px-3 py-1.5 bg-emerald-50 text-emerald-900 text-xs font-semibold rounded-xl border border-emerald-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-700" />
                <span>Quyền Cán bộ: Cập nhật đôn đốc các xã được giao</span>
              </div>
            )}
          </div>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3 pt-3 border-t border-emerald-100">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm nhiệm vụ đôn đốc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value="all">-- Tất cả lĩnh vực --</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {!isAdmin && (
            <div>
              <select
                value={filterScope}
                onChange={(e) => setFilterScope(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="all">Tất cả nhiệm vụ của Đội</option>
                <option value="my_tasks">Chỉ nhiệm vụ tôi được phân công</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Danh sách nhiệm vụ dạng thẻ thu gọn */}
      <div className="space-y-3.5">
        {filteredTasks.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400">
            <CheckSquare className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-600">Không có nhiệm vụ đôn đốc nào</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const daysRemaining = calculateDaysRemaining(task.deadline);
            const isPastDeadline = daysRemaining < 0;

            const assignedList = task.assignedToAll 
              ? areaOfficers 
              : areaOfficers.filter(o => task.assignedOfficers?.includes(o.id));

            let completedCount = 0;
            let overdueNotUrgedCount = 0;
            let inProgressCount = 0;

            assignedList.forEach(officer => {
              const statusInfo = computeTaskOfficerStatus(task, officer);
              if (statusInfo.status === 'Đã hoàn thành') completedCount++;
              else if (statusInfo.isOverdueNotUrged) overdueNotUrgedCount++;
              else if (statusInfo.status === 'Đang thực hiện') inProgressCount++;
            });

            const completionPercentage = assignedList.length > 0 
              ? Math.round((completedCount / assignedList.length) * 100) 
              : 0;

            const isExpanded = expandedTaskId === task.id;
            const currentUserAssigned = task.assignedToAll || task.assignedOfficers?.includes(currentUser.id);
            const myStatusInfo = currentUser.role === 'user' ? computeTaskOfficerStatus(task, currentUser) : null;
            const isMyTaskLocked = myStatusInfo?.isLocked;

            return (
              <div 
                key={task.id} 
                className={`bg-white rounded-2xl shadow-xs border transition-all ${
                  isExpanded ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* THẺ THU NHỎ GỌN GÀNG */}
                <div className="p-4 md:p-4.5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-emerald-100 text-emerald-950 border border-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded">
                          {task.category}
                        </span>
                        
                        {isPastDeadline ? (
                          <span className="bg-rose-100 text-rose-950 border border-rose-300 text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            Đã qua hạn ({Math.abs(daysRemaining)} ngày)
                          </span>
                        ) : daysRemaining <= 3 ? (
                          <span className="bg-amber-100 text-amber-950 border border-amber-400 text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Còn {daysRemaining} ngày đến hạn
                          </span>
                        ) : (
                          <span className="bg-blue-50 text-blue-950 border border-blue-200 text-[11px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
                            <Clock className="w-3 h-3 text-blue-600" />
                            Còn {daysRemaining} ngày
                          </span>
                        )}

                        <span className="text-[11px] text-slate-500">
                          Hạn chót: <strong>{formatDateVN(task.deadline)}</strong> • Người giao: <strong>{task.createdByName}</strong>
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">
                        {task.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-1">
                        {task.content}
                      </p>
                    </div>

                    {/* Các nút thao tác & Nút xem chi tiết */}
                    <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                      {/* Nút báo cáo của cán bộ */}
                      {currentUser.role === 'user' && currentUserAssigned && (
                        <div>
                          {isMyTaskLocked ? (
                            <div className="px-3 py-1.5 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-300 flex items-center gap-1">
                              <Lock className="w-3.5 h-3.5 text-red-600" />
                              <span>Đã khóa do quá hạn (Chưa đôn đốc)</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onOpenSubmissionModal(task, currentUser.id)}
                              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all ${
                                myStatusInfo?.status === 'Đã hoàn thành'
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                  : 'bg-[#194c29] hover:bg-[#205e33] text-amber-300 ring-2 ring-lime-300'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>
                                {myStatusInfo?.status === 'Đã hoàn thành' ? 'Cập Nhật Lại Báo Cáo' : 'Cập Nhật Đôn Đốc Xã'}
                              </span>
                            </button>
                          )}
                        </div>
                      )}

                      {/* NÚT XEM CHI TIẾT THEO YÊU CẦU */}
                      <button
                        type="button"
                        onClick={() => toggleExpand(task.id)}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition-all ${
                          isExpanded 
                            ? 'bg-[#143e21] text-amber-300 border-[#143e21] shadow-xs' 
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{isExpanded ? 'Thu gọn bảng chi tiết' : `Xem chi tiết tiến độ (${assignedList.length} cán bộ)`}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => onDeleteTask(task.id)}
                          className="text-xs text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa nhiệm vụ"
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Thanh tiến độ tóm tắt ngắn gọn */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Tiến độ hoàn thành:</span>
                      <strong className="text-emerald-700 font-mono">{completedCount}/{assignedList.length} cán bộ</strong>
                      <span className="text-slate-400">|</span>
                      <span className="text-blue-700">Đang làm: {inProgressCount}</span>
                      {overdueNotUrgedCount > 0 && (
                        <span className="text-rose-700 font-bold">Chưa đôn đốc (quá hạn): {overdueNotUrgedCount}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden flex">
                        <div className="bg-emerald-500" style={{ width: `${(completedCount / assignedList.length) * 100}%` }} />
                        <div className="bg-blue-400" style={{ width: `${(inProgressCount / assignedList.length) * 100}%` }} />
                        <div className="bg-rose-500" style={{ width: `${(overdueNotUrgedCount / assignedList.length) * 100}%` }} />
                      </div>
                      <span className="font-mono font-bold text-slate-800">{completionPercentage}%</span>
                    </div>
                  </div>
                </div>

                {/* BẢNG CHI TIẾT THỰC HIỆN CỦA TỪNG CÁN BỘ (CHỈ HIỂN THỊ KHI BẤM NÚT XEM CHI TIẾT) */}
                {isExpanded && (
                  <div className="bg-emerald-50/50 p-4 rounded-b-2xl border-t border-emerald-200 animate-in fade-in duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#143e21] flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" /> Bảng Chi Tiết Tiến Độ Thực Hiện Của Các Cán Bộ Địa Bàn
                      </h4>
                      <span className="text-[11px] text-slate-500 italic">
                        * Quá hạn mà không đôn đốc sẽ khóa quyền sửa và hiển thị trạng thái "Chưa đôn đốc".
                      </span>
                    </div>

                    <div className="overflow-x-auto bg-white rounded-xl border border-emerald-200 shadow-2xs">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#143e21] text-white font-semibold">
                            <th className="py-2 px-2.5 text-center w-10">STT</th>
                            <th className="py-2 px-2.5 min-w-[140px]">Cán Bộ Phụ Trách</th>
                            <th className="py-2 px-2.5 min-w-[320px]">Các Xã/Phường Được Giao Đôn Đốc</th>
                            <th className="py-2 px-2 text-center min-w-[120px]">Đánh Giá</th>
                            <th className="py-2 px-2.5 min-w-[190px]">Báo Cáo & Minh Chứng</th>
                            <th className="py-2 px-2 text-center w-24">Thao Tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {assignedList.map((officer, idx) => {
                            const statusInfo = computeTaskOfficerStatus(task, officer);
                            const sub = statusInfo.submission;
                            const isMe = officer.id === currentUser.id;
                            const breakdown = statusInfo.communeBreakdown || {};
                            
                            // Lấy danh sách xã được giao trong nhiệm vụ này
                            const communesAssigned = (task.assignedCommunes && task.assignedCommunes[officer.id]) 
                              ? task.assignedCommunes[officer.id] 
                              : officer.communes;

                            return (
                              <tr key={officer.id} className={`hover:bg-slate-50 transition-colors ${isMe ? 'bg-amber-50/40 font-medium' : ''}`}>
                                <td className="py-2.5 px-2.5 text-center font-mono text-slate-400">{idx + 1}</td>
                                
                                <td className="py-2.5 px-2.5">
                                  <div className="font-bold text-slate-900">{officer.name}</div>
                                  <div className="text-[10px] text-slate-500">{officer.rank} {isMe ? '• (Bạn)' : ''}</div>
                                </td>

                                {/* Xã/phường được giao đôn đốc trong nhiệm vụ này */}
                                <td className="py-2.5 px-2.5">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
                                      <span>Tiến độ địa bàn ({statusInfo.completedCommunesCount}/{communesAssigned.length} xã hoàn thành):</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                      {communesAssigned.map((communeName, cIdx) => {
                                        const cInfo = breakdown[communeName] || {};
                                        const isDone = cInfo.status === 'Đã hoàn thành';
                                        const isInProgress = cInfo.status === 'Đang thực hiện';

                                        return (
                                          <div
                                            key={cIdx}
                                            className={`px-2 py-0.5 rounded text-[10px] border flex items-center gap-1 shadow-2xs ${
                                              isDone
                                                ? 'bg-emerald-100 text-emerald-950 border-emerald-300 font-semibold'
                                                : isInProgress
                                                ? 'bg-blue-100 text-blue-950 border-blue-300 font-medium'
                                                : 'bg-rose-100 text-rose-950 border-rose-300 font-bold'
                                            }`}
                                            title={cInfo.notes ? `${communeName}: ${cInfo.notes}` : communeName}
                                          >
                                            <span>{communeName}</span>
                                            <span className="font-mono text-[9px] opacity-80">
                                              ({isDone ? 'Xong' : isInProgress ? 'Đang làm' : 'Chưa'})
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </td>

                                <td className="py-2.5 px-2 text-center whitespace-nowrap">
                                  <span className={`inline-block px-2.5 py-0.5 text-[11px] rounded-full border shadow-2xs ${statusInfo.badgeClass}`}>
                                    {statusInfo.status}
                                  </span>
                                  {statusInfo.isOverdueNotUrged && (
                                    <div className="text-[10px] text-red-600 font-bold mt-0.5 flex items-center justify-center gap-0.5">
                                      <Lock className="w-2.5 h-2.5" /> (Quá hạn)
                                    </div>
                                  )}
                                </td>

                                <td className="py-2.5 px-2.5 text-slate-700">
                                  {sub?.notes ? (
                                    <p className="line-clamp-2 italic text-[11px]">{sub.notes}</p>
                                  ) : (
                                    <span className="text-slate-400 italic text-[11px]">Chưa có báo cáo</span>
                                  )}
                                  {sub?.attachmentName && (
                                    <div className="flex items-center gap-1 text-blue-700 font-mono text-[10px] mt-1">
                                      <Paperclip className="w-3 h-3 flex-shrink-0" />
                                      <span className="truncate max-w-[160px]">{sub.attachmentName}</span>
                                    </div>
                                  )}
                                </td>

                                <td className="py-2.5 px-2 text-center whitespace-nowrap">
                                  {statusInfo.isLocked && !isAdmin ? (
                                    <span className="text-[10px] text-slate-400 italic">Đã khóa</span>
                                  ) : (
                                    (isAdmin || isMe) && (
                                      <button
                                        type="button"
                                        onClick={() => onOpenSubmissionModal(task, officer.id)}
                                        className="px-2 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded text-xs font-semibold shadow-2xs transition-colors"
                                      >
                                        {sub?.urgingStatus ? 'Chỉnh sửa' : 'Cập nhật'}
                                      </button>
                                    )
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
