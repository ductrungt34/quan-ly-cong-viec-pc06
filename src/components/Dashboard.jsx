import React, { useState, useMemo } from 'react';
import { 
  Award, FileText, Trophy, Star, Printer, ShieldCheck, Filter, Calendar
} from 'lucide-react';
import { OFFICERS } from '../constants/officersData';
import { computeDocumentStatus, computeTaskOfficerStatus, getGradeFromPercentage, formatDateVN } from '../utils/dateUtils';

export default function Dashboard({ documents, tasks, categories, onSelectTab }) {
  // Bộ lọc khoảng thời gian tùy chọn
  const [timePreset, setTimePreset] = useState('all'); // 'all', 'month', 'quarter', 'year', 'custom'
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  
  const [rankingTab, setRankingTab] = useState('all'); // 'all' | 'advisory' | 'urging'

  const areaOfficers = OFFICERS.filter(o => o.role === 'user');

  // Lọc văn bản theo khoảng thời gian được chọn
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const dDate = doc.docDate;
      if (customStartDate && dDate < customStartDate) return false;
      if (customEndDate && dDate > customEndDate) return false;
      return true;
    });
  }, [documents, customStartDate, customEndDate]);

  // Lọc nhiệm vụ theo khoảng thời gian được chọn
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const tDate = task.createdAt || task.deadline;
      if (customStartDate && tDate < customStartDate) return false;
      if (customEndDate && tDate > customEndDate) return false;
      return true;
    });
  }, [tasks, customStartDate, customEndDate]);

  // 1. Thống kê Văn bản tham mưu toàn đội trong kỳ lọc
  const docStats = useMemo(() => {
    let completed = 0;
    let dueSoon = 0;
    let overdue = 0;
    let processing = 0;
    let tracking = 0;

    filteredDocuments.forEach(doc => {
      const status = computeDocumentStatus(doc).status;
      if (status === 'Đã hoàn thành') completed++;
      else if (status === 'Sắp hết hạn') dueSoon++;
      else if (status === 'Đã hết hạn') overdue++;
      else if (status === 'Đang xử lý') processing++;
      else if (status === 'Đang theo dõi') tracking++;
    });

    const total = filteredDocuments.length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 100;

    return { total, completed, dueSoon, overdue, processing, tracking, rate };
  }, [filteredDocuments]);

  // 2. Thống kê Nhiệm vụ đôn đốc cấp xã toàn đội trong kỳ lọc
  const taskStats = useMemo(() => {
    let totalAssignments = 0;
    let completedAssignments = 0;
    let overdueAssignments = 0;
    let inProgressAssignments = 0;

    filteredTasks.forEach(task => {
      const assignedList = task.assignedToAll 
        ? areaOfficers 
        : areaOfficers.filter(o => task.assignedOfficers?.includes(o.id));

      assignedList.forEach(officer => {
        totalAssignments++;
        const sInfo = computeTaskOfficerStatus(task, officer);
        if (sInfo.status === 'Đã hoàn thành') completedAssignments++;
        else if (sInfo.isOverdueNotUrged) overdueAssignments++;
        else if (sInfo.status === 'Đang thực hiện') inProgressAssignments++;
      });
    });

    const completionRate = totalAssignments > 0 
      ? Math.round((completedAssignments / totalAssignments) * 100) 
      : 100;

    return {
      totalTasks: filteredTasks.length,
      totalAssignments,
      completedAssignments,
      overdueAssignments,
      inProgressAssignments,
      completionRate
    };
  }, [filteredTasks, areaOfficers]);

  // 3. TÍNH TOÁN ĐÁNH GIÁ VÀ XẾP HẠNG CÁ NHÂN THEO TỈ LỆ PHẦN TRĂM (%)
  const evaluatedOfficers = useMemo(() => {
    return areaOfficers.map(officer => {
      // 1) CÔNG TÁC THAM MƯU:
      const myDocs = filteredDocuments.filter(d => d.officerId === officer.id);
      let docsDone = 0;
      let docsOverdue = 0;

      myDocs.forEach(d => {
        const s = computeDocumentStatus(d).status;
        if (s === 'Đã hoàn thành') docsDone++;
        else if (s === 'Đã hết hạn') docsOverdue++;
      });

      // Tỉ lệ % hoàn thành tham mưu
      const advisoryPercentage = myDocs.length > 0 ? Math.round((docsDone / myDocs.length) * 100) : 100;
      const advisoryGradeObj = getGradeFromPercentage(advisoryPercentage);

      // 2) CÔNG TÁC ĐÔN ĐỐC CÔNG AN XÃ:
      let tasksAssignedCount = 0;
      let tasksDoneCount = 0;
      let totalCommunesAssignedCount = 0;
      let totalCommunesDoneCount = 0;

      filteredTasks.forEach(task => {
        const isAssigned = task.assignedToAll || task.assignedOfficers?.includes(officer.id);
        if (isAssigned) {
          tasksAssignedCount++;
          const statusInfo = computeTaskOfficerStatus(task, officer);
          if (statusInfo.status === 'Đã hoàn thành') tasksDoneCount++;

          totalCommunesDoneCount += statusInfo.completedCommunesCount || 0;
          totalCommunesAssignedCount += statusInfo.totalCommunesCount || 0;
        }
      });

      // Tỉ lệ % hoàn thành đôn đốc địa bàn
      let urgingPercentage = 100;
      if (totalCommunesAssignedCount > 0) {
        urgingPercentage = Math.round((totalCommunesDoneCount / totalCommunesAssignedCount) * 100);
      } else if (tasksAssignedCount > 0) {
        urgingPercentage = Math.round((tasksDoneCount / tasksAssignedCount) * 100);
      }
      const urgingGradeObj = getGradeFromPercentage(urgingPercentage);

      // 3) TỈ LỆ PHẦN TRĂM TỔNG HỢP CHUNG VÀ XẾP LOẠI:
      const overallPercentage = Math.round((advisoryPercentage + urgingPercentage) / 2);
      const overallGradeObj = getGradeFromPercentage(overallPercentage);

      return {
        ...officer,
        // Tham mưu
        myDocsCount: myDocs.length,
        docsDone,
        docsOverdue,
        advisoryPercentage,
        advisoryGrade: advisoryGradeObj.grade,
        advisoryShortGrade: advisoryGradeObj.shortGrade,
        advisoryBadge: advisoryGradeObj.badgeClass,
        // Đôn đốc
        tasksAssignedCount,
        tasksDoneCount,
        totalCommunesDoneCount,
        totalCommunesAssignedCount,
        urgingPercentage,
        urgingGrade: urgingGradeObj.grade,
        urgingShortGrade: urgingGradeObj.shortGrade,
        urgingBadge: urgingGradeObj.badgeClass,
        // Chung
        overallPercentage,
        overallGrade: overallGradeObj.grade,
        overallBadge: overallGradeObj.badgeClass
      };
    });
  }, [areaOfficers, filteredDocuments, filteredTasks]);

  // Sắp xếp thứ hạng theo % từ cao xuống thấp
  const advisoryRankings = useMemo(() => {
    return [...evaluatedOfficers].sort((a, b) => b.advisoryPercentage - a.advisoryPercentage || b.docsDone - a.docsDone);
  }, [evaluatedOfficers]);

  const urgingRankings = useMemo(() => {
    return [...evaluatedOfficers].sort((a, b) => b.urgingPercentage - a.urgingPercentage || b.totalCommunesDoneCount - a.totalCommunesDoneCount);
  }, [evaluatedOfficers]);

  const overallRankings = useMemo(() => {
    return [...evaluatedOfficers].sort((a, b) => b.overallPercentage - a.overallPercentage || (b.docsDone + b.totalCommunesDoneCount) - (a.docsDone + a.totalCommunesDoneCount));
  }, [evaluatedOfficers]);

  // Thiết lập khoảng ngày nhanh
  const handleSetPreset = (preset) => {
    setTimePreset(preset);
    if (preset === 'all') {
      setCustomStartDate('');
      setCustomEndDate('');
    } else if (preset === 'month') {
      setCustomStartDate('2026-09-01');
      setCustomEndDate('2026-09-30');
    } else if (preset === 'quarter') {
      setCustomStartDate('2026-07-01');
      setCustomEndDate('2026-09-30');
    } else if (preset === 'year') {
      setCustomStartDate('2026-01-01');
      setCustomEndDate('2026-12-31');
    }
  };

  return (
    <div className="space-y-4 w-full">
      {/* Top Banner - Xanh lá mạ */}
      <div className="bg-gradient-to-r from-[#143e21] via-[#1a552c] to-[#256c39] p-5 rounded-2xl text-white shadow-md border border-[#2b7e43] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-lime-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4 text-amber-300" /> Hệ Thống Báo Cáo Tổng Hợp & Đánh Giá Thi Đua
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Hiệu Quả Công Tác Đội 2 - PC06 Công An TP Hải Phòng
          </h2>
          <p className="text-xs text-lime-100 mt-1 max-w-3xl">
            Xếp loại thi đua tự động dựa trên <strong>Tỉ lệ phần trăm (%) đạt được</strong>: Từ 90% trở lên xếp loại A, từ 80% đến dưới 90% xếp loại B, từ 70% đến dưới 80% xếp loại C, dưới 70% xếp loại D.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="px-4 py-2 bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all self-start md:self-auto flex items-center gap-1.5"
        >
          <Printer className="w-4 h-4" />
          <span>In Báo Cáo Thi Đua</span>
        </button>
      </div>

      {/* BỘ LỌC THỜI GIAN TỰ CHỌN THEO YÊU CẦU */}
      <div className="bg-white p-3.5 md:p-4 rounded-2xl shadow-xs border border-emerald-200 space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100 pb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#143e21] uppercase tracking-wide">
            <Calendar className="w-4 h-4 text-emerald-700" /> Bộ Lọc Thời Gian Xếp Hạng (Tùy Chọn Theo Ngày/Tháng/Năm)
          </div>
          
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'month', label: 'Tháng 9/2026' },
              { id: 'quarter', label: 'Quý III/2026' },
              { id: 'year', label: 'Năm 2026' },
              { id: 'custom', label: 'Tùy chọn khoảng ngày' }
            ].map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSetPreset(p.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  timePreset === p.id
                    ? 'bg-[#143e21] text-amber-300 shadow-xs'
                    : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ô nhập ngày tùy chọn: từ ngày ... đến ngày ... */}
        <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
          <span className="font-semibold text-slate-700">Thời gian đánh giá:</span>
          <div className="flex items-center gap-1.5">
            <label className="text-slate-500 text-[11px]">Từ ngày:</label>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => {
                setCustomStartDate(e.target.value);
                setTimePreset('custom');
              }}
              className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-slate-500 text-[11px]">Đến ngày:</label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => {
                setCustomEndDate(e.target.value);
                setTimePreset('custom');
              }}
              className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white font-mono"
            />
          </div>

          {(customStartDate || customEndDate) && (
            <button
              type="button"
              onClick={() => handleSetPreset('all')}
              className="text-xs text-red-600 hover:underline font-semibold"
            >
              Xóa lọc thời gian
            </button>
          )}

          <div className="ml-auto text-[11px] text-slate-500 italic">
            * Dữ liệu trong kỳ: <strong>{filteredDocuments.length}</strong> văn bản • <strong>{filteredTasks.length}</strong> nhiệm vụ đôn đốc
          </div>
        </div>
      </div>

      {/* 1. ĐÁNH GIÁ CHUNG KẾT QUẢ THAM MƯU TOÀN ĐỘI */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-emerald-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#143e21] text-amber-300 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 uppercase">
                Đánh Giá Chung Kết Quả Công Tác Tham Mưu Toàn Đội
              </h3>
              <p className="text-xs text-slate-500">
                {customStartDate || customEndDate 
                  ? `Kết quả trong giai đoạn từ ${formatDateVN(customStartDate) || 'đầu kỳ'} đến ${formatDateVN(customEndDate) || 'hiện tại'}`
                  : 'Báo cáo tổng hợp kết quả công tác tham mưu của toàn Đội 2'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-100 text-emerald-950 font-bold px-3 py-1 rounded-full border border-emerald-300">
              Tỷ lệ giải quyết: {docStats.rate}%
            </span>
          </div>
        </div>

        {/* 4 Chỉ số cốt lõi tham mưu */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
            <div className="text-[11px] font-semibold text-emerald-900">Tổng VB tham mưu tiếp nhận</div>
            <div className="text-2xl font-bold font-mono text-emerald-950 mt-0.5">{docStats.total}</div>
            <div className="text-[10px] text-emerald-700">100% đã được phân công xử lý</div>
          </div>

          <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200">
            <div className="text-[11px] font-semibold text-blue-900">Đã tham mưu hoàn thành</div>
            <div className="text-2xl font-bold font-mono text-blue-950 mt-0.5">{docStats.completed}</div>
            <div className="text-[10px] text-blue-700">Đã ban hành văn bản/báo cáo kết quả</div>
          </div>

          <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200">
            <div className="text-[11px] font-semibold text-amber-900">Đang nghiên cứu / Sắp đến hạn</div>
            <div className="text-2xl font-bold font-mono text-amber-950 mt-0.5">{docStats.processing + docStats.dueSoon}</div>
            <div className="text-[10px] text-amber-800 font-semibold">{docStats.dueSoon} văn bản sắp hết hạn</div>
          </div>

          <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-200">
            <div className="text-[11px] font-semibold text-rose-900">Văn bản quá hạn / Tồn đọng</div>
            <div className="text-2xl font-bold font-mono text-rose-950 mt-0.5">{docStats.overdue}</div>
            <div className="text-[10px] text-rose-700">Yêu cầu đôn đốc giải quyết ngay</div>
          </div>
        </div>

        {/* Nhận xét đánh giá của Chỉ huy Đội */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
          <div className="font-bold text-[#143e21] flex items-center gap-1.5 uppercase text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-700" /> Nhận xét, đánh giá của Ban Chỉ huy Đội 2:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700 leading-relaxed text-[11px]">
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <strong className="text-emerald-800 block mb-1">✓ Ưu điểm:</strong>
              Cán bộ chủ động nghiên cứu quy định pháp luật và văn bản chỉ đạo của Giám đốc CATP; công tác lập hồ sơ và dự thảo báo cáo tham mưu bám sát chỉ tiêu Đề án 06 và quản lý cư trú.
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <strong className="text-amber-800 block mb-1">⚠️ Tồn tại, hạn chế:</strong>
              Còn {docStats.dueSoon} văn bản sắp đến hạn và {docStats.overdue} văn bản quá hạn do công tác phối hợp xác minh một số vụ việc tại cơ sở còn chậm; cần tăng cường bám sát địa bàn hơn nữa.
            </div>
          </div>
        </div>
      </div>

      {/* 2. BẢNG XẾP HẠNG CÁ NHÂN THEO TỈ LỆ PHẦN TRĂM (%) */}
      <div className="bg-white rounded-2xl shadow-xs border border-emerald-200 overflow-hidden">
        {/* Tab switcher giữa các bảng đánh giá */}
        <div className="p-4 bg-emerald-50/60 border-b border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" /> Bảng Xếp Hạng & Đánh Giá 21 Cán Bộ Địa Bàn
            </h3>
            <p className="text-xs text-slate-500">
              Thang xếp loại: <strong>Loại A (≥90%)</strong> • <strong>Loại B (80% - &lt;90%)</strong> • <strong>Loại C (70% - &lt;80%)</strong> • <strong>Loại D (&lt;70%)</strong>
            </p>
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-emerald-300">
            <button
              type="button"
              onClick={() => setRankingTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                rankingTab === 'all'
                  ? 'bg-[#143e21] text-amber-300 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Tổng Hợp Cả 2 Mặt
            </button>

            <button
              type="button"
              onClick={() => setRankingTab('advisory')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                rankingTab === 'advisory'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              1) Công Tác Tham Mưu (VB)
            </button>

            <button
              type="button"
              onClick={() => setRankingTab('urging')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                rankingTab === 'urging'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              2) Công Tác Đôn Đốc Xã
            </button>
          </div>
        </div>

        {/* ========== BẢNG 1: XẾP HẠNG CÔNG TÁC THAM MƯU ========== */}
        {rankingTab === 'advisory' && (
          <div className="overflow-x-auto">
            <div className="p-2.5 bg-blue-50/70 border-b border-blue-200 text-xs text-blue-900 font-semibold flex justify-between items-center">
              <span>BẢNG XẾP HẠNG 1: CÔNG TÁC THAM MƯU (THỰC HIỆN VĂN BẢN ĐƯỢC GIAO)</span>
              <span className="text-[11px] text-blue-700 font-normal">Đánh giá theo Tỉ lệ phần trăm (%) hoàn thành đúng hạn</span>
            </div>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#143e21] text-white font-semibold">
                  <th className="py-2.5 px-3 text-center w-12">Hạng</th>
                  <th className="py-2.5 px-3 min-w-[160px]">Họ Và Tên Cán Bộ</th>
                  <th className="py-2.5 px-3 min-w-[200px]">Địa Bàn Phụ Trách</th>
                  <th className="py-2.5 px-3 text-center min-w-[110px]">VB Được Giao</th>
                  <th className="py-2.5 px-3 text-center min-w-[130px]">Hoàn Thành Đúng Hạn</th>
                  <th className="py-2.5 px-3 text-center min-w-[90px]">Quá Hạn</th>
                  <th className="py-2.5 px-3 text-center min-w-[110px]">Tỉ Lệ Đạt (%)</th>
                  <th className="py-2.5 px-3 text-center min-w-[130px]">Xếp Loại Tham Mưu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {advisoryRankings.map((officer, idx) => (
                  <tr key={officer.id} className="hover:bg-blue-50/40">
                    <td className="py-2.5 px-3 text-center font-bold">
                      {idx === 0 ? '🥇 1' : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : idx + 1}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {officer.name}
                      <span className="block text-[10px] text-slate-500 font-normal">{officer.rank}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {officer.communes.slice(0, 3).join(', ')}...
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-semibold">{officer.myDocsCount} VB</td>
                    <td className="py-2.5 px-3 text-center font-mono text-emerald-700 font-bold">{officer.docsDone} VB</td>
                    <td className="py-2.5 px-3 text-center font-mono">
                      {officer.docsOverdue > 0 ? (
                        <span className="text-red-600 font-bold">{officer.docsOverdue}</span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-900 text-sm">
                      {officer.advisoryPercentage}%
                    </td>
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[11px] inline-block ${officer.advisoryBadge}`}>
                        {officer.advisoryGrade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ========== BẢNG 2: XẾP HẠNG CÔNG TÁC ĐÔN ĐỐC XÃ ========== */}
        {rankingTab === 'urging' && (
          <div className="overflow-x-auto">
            <div className="p-2.5 bg-emerald-50/70 border-b border-emerald-200 text-xs text-emerald-900 font-semibold flex justify-between items-center">
              <span>BẢNG XẾP HẠNG 2: CÔNG TÁC ĐÔN ĐỐC, THEO DÕI CÔNG AN CẤP XÃ</span>
              <span className="text-[11px] text-emerald-700 font-normal">Đánh giá theo Tỉ lệ phần trăm (%) các xã hoàn thành chỉ tiêu</span>
            </div>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#143e21] text-white font-semibold">
                  <th className="py-2.5 px-3 text-center w-12">Hạng</th>
                  <th className="py-2.5 px-3 min-w-[160px]">Họ Và Tên Cán Bộ</th>
                  <th className="py-2.5 px-3 min-w-[200px]">Địa Bàn Phụ Trách</th>
                  <th className="py-2.5 px-3 text-center min-w-[110px]">Nhiệm Vụ Giao</th>
                  <th className="py-2.5 px-3 text-center min-w-[140px]">Số Lượt Xã Đạt Chỉ Tiêu</th>
                  <th className="py-2.5 px-3 text-center min-w-[110px]">Tỉ Lệ Đạt (%)</th>
                  <th className="py-2.5 px-3 text-center min-w-[130px]">Xếp Loại Đôn Đốc</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {urgingRankings.map((officer, idx) => (
                  <tr key={officer.id} className="hover:bg-emerald-50/40">
                    <td className="py-2.5 px-3 text-center font-bold">
                      {idx === 0 ? '🥇 1' : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : idx + 1}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {officer.name}
                      <span className="block text-[10px] text-slate-500 font-normal">{officer.rank}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {officer.communes.slice(0, 3).join(', ')}... ({officer.communes.length} xã)
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-semibold">{officer.tasksAssignedCount} chuyên đề</td>
                    <td className="py-2.5 px-3 text-center font-mono text-emerald-700 font-bold">
                      {officer.totalCommunesDoneCount}/{officer.totalCommunesAssignedCount} lượt xã
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-900 text-sm">
                      {officer.urgingPercentage}%
                    </td>
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[11px] inline-block ${officer.urgingBadge}`}>
                        {officer.urgingGrade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ========== BẢNG TỔNG HỢP SONG SONG CẢ 2 MẶT CÔNG TÁC ========== */}
        {rankingTab === 'all' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#143e21] text-white font-semibold">
                  <th className="py-3 px-2.5 text-center w-12">Hạng</th>
                  <th className="py-3 px-2.5 min-w-[150px]">Cán Bộ Địa Bàn</th>
                  <th className="py-3 px-2.5 min-w-[180px]">Địa Bàn Phụ Trách</th>
                  <th className="py-3 px-2.5 text-center min-w-[150px] bg-[#1a4a27]">
                    1) Công Tác Tham Mưu (VB)
                  </th>
                  <th className="py-3 px-2.5 text-center min-w-[150px] bg-[#1e5830]">
                    2) Công Tác Đôn Đốc Xã
                  </th>
                  <th className="py-3 px-2.5 text-center min-w-[100px]">Tỉ Lệ Tổng (%)</th>
                  <th className="py-3 px-2.5 text-center min-w-[130px]">Xếp Loại Chung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {overallRankings.map((officer, index) => {
                  const rank = index + 1;
                  return (
                    <tr key={officer.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-2.5 text-center font-bold">
                        {rank === 1 ? '🥇 1' : rank === 2 ? '🥈 2' : rank === 3 ? '🥉 3' : rank}
                      </td>

                      <td className="py-2.5 px-2.5">
                        <div className="font-bold text-slate-900">{officer.name}</div>
                        <div className="text-[10px] text-slate-500">{officer.rank}</div>
                      </td>

                      <td className="py-2.5 px-2.5">
                        <div className="text-[11px] text-slate-700">
                          {officer.communes.slice(0, 3).join(', ')}...
                        </div>
                        <span className="text-[10px] text-emerald-800 font-semibold font-mono">({officer.communes.length} xã/phường)</span>
                      </td>

                      {/* Đánh giá riêng 1: Tham mưu */}
                      <td className="py-2.5 px-2.5 text-center bg-blue-50/40 font-mono">
                        <div className="font-bold text-blue-900">{officer.advisoryPercentage}% ({officer.docsDone}/{officer.myDocsCount} VB)</div>
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] border mt-0.5 ${officer.advisoryBadge}`}>
                          {officer.advisoryShortGrade}
                        </span>
                      </td>

                      {/* Đánh giá riêng 2: Đôn đốc xã */}
                      <td className="py-2.5 px-2.5 text-center bg-emerald-50/40 font-mono">
                        <div className="font-bold text-emerald-900">{officer.urgingPercentage}% ({officer.totalCommunesDoneCount}/{officer.totalCommunesAssignedCount} xã)</div>
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] border mt-0.5 ${officer.urgingBadge}`}>
                          {officer.urgingShortGrade}
                        </span>
                      </td>

                      {/* Tỉ lệ phần trăm tổng hợp */}
                      <td className="py-2.5 px-2.5 text-center font-mono font-bold text-slate-900 text-sm">
                        {officer.overallPercentage}%
                      </td>

                      {/* Xếp loại thi đua chung */}
                      <td className="py-2.5 px-2.5 text-center whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-1 text-xs rounded-full border shadow-2xs ${officer.overallBadge}`}>
                          {officer.overallGrade}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>
            Quy chuẩn xếp loại: <strong>Loại A (≥90%)</strong>; <strong>Loại B (80% đến dưới 90%)</strong>; <strong>Loại C (70% đến dưới 80%)</strong>; <strong>Loại D (dưới 70%)</strong>.
          </span>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold"
          >
            🖨️ In Bảng Xếp Hạng
          </button>
        </div>
      </div>
    </div>
  );
}
