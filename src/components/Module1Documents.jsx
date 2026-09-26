import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, Plus, FileDown, Printer, AlertTriangle, 
  CheckCircle, Clock, Calendar, Edit3, Trash2, CheckCircle2, 
  User, ArrowUpDown, Eye
} from 'lucide-react';
import { OFFICERS } from '../constants/officersData';
import { formatDateVN, computeDocumentStatus, getTodayDateString } from '../utils/dateUtils';

export default function Module1Documents({
  documents,
  categories,
  currentUser,
  onAddDocument,
  onEditDocument,
  onDeleteDocument,
  onOpenResultModal,
  onOpenCategoryModal
}) {
  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOfficer, setSelectedOfficer] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortField, setSortField] = useState('docDate');
  const [sortAsc, setSortAsc] = useState(false);

  const isAdmin = currentUser.role === 'admin';

  // Compute status for all documents with current date
  const processedDocs = useMemo(() => {
    return documents.map(doc => {
      const statusInfo = computeDocumentStatus(doc);
      const officer = OFFICERS.find(o => o.id === doc.officerId) || { name: 'Chưa phân công', communes: [] };
      const categoryObj = categories.find(c => c.name.toLowerCase() === doc.category.toLowerCase());
      const badgeStyle = categoryObj?.colorClass || 'bg-emerald-100 text-emerald-950 border-emerald-300 font-semibold';
      return {
        ...doc,
        computedStatus: statusInfo.status,
        statusBadgeClass: statusInfo.badgeClass,
        daysRemaining: statusInfo.daysRemaining,
        officerName: officer.name,
        officerCommunes: officer.communes,
        categoryBadgeClass: badgeStyle
      };
    });
  }, [documents, categories]);

  // Filtered documents
  const filteredDocs = useMemo(() => {
    return processedDocs.filter(doc => {
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchNumber = doc.docNumber.toLowerCase().includes(term);
        const matchExcerpt = doc.excerpt.toLowerCase().includes(term);
        const matchResult = (doc.resultDocNumber || '').toLowerCase().includes(term) || (doc.resultExcerpt || '').toLowerCase().includes(term);
        const matchOfficer = doc.officerName.toLowerCase().includes(term);
        if (!matchNumber && !matchExcerpt && !matchResult && !matchOfficer) return false;
      }

      if (selectedOfficer !== 'all' && doc.officerId !== selectedOfficer) return false;
      if (selectedCategory !== 'all' && doc.category !== selectedCategory) return false;
      if (selectedStatus !== 'all' && doc.computedStatus !== selectedStatus) return false;
      if (startDate && doc.docDate < startDate) return false;
      if (endDate && doc.docDate > endDate) return false;

      return true;
    }).sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';
      return sortAsc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });
  }, [processedDocs, searchTerm, selectedOfficer, selectedCategory, selectedStatus, startDate, endDate, sortField, sortAsc]);

  // Stats Counters
  const counts = useMemo(() => {
    const res = { total: processedDocs.length, processing: 0, dueSoon: 0, overdue: 0, completed: 0, trackingOnly: 0 };
    processedDocs.forEach(d => {
      if (d.computedStatus === 'Đang xử lý') res.processing++;
      else if (d.computedStatus === 'Sắp hết hạn') res.dueSoon++;
      else if (d.computedStatus === 'Đã hết hạn') res.overdue++;
      else if (d.computedStatus === 'Đã hoàn thành') res.completed++;
      else if (d.computedStatus === 'Đang theo dõi') res.trackingOnly++;
    });
    return res;
  }, [processedDocs]);

  const handleExportCSV = () => {
    const headers = [
      'STT', 'Số / Ký hiệu VB', 'Ngày VB', 'Trích yếu nội dung', 'Lĩnh vực',
      'Cán bộ thực hiện', 'Ngày nhận', 'Thời hạn xử lý', 'Trạng thái',
      'Số VB kết quả', 'Ngày VB kết quả', 'Trích yếu kết quả'
    ];

    const rows = filteredDocs.map((d, index) => [
      index + 1,
      `"${d.docNumber.replace(/"/g, '""')}"`,
      d.docDate,
      `"${d.excerpt.replace(/"/g, '""')}"`,
      d.category,
      `"${d.officerName}"`,
      d.receivedDate,
      d.isTrackingOnly ? 'Văn bản theo dõi' : d.deadlineDate,
      d.computedStatus,
      `"${(d.resultDocNumber || '').replace(/"/g, '""')}"`,
      d.resultDocDate || '',
      `"${(d.resultExcerpt || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Bang_Theo_Doi_Van_Ban_PC06_${getTodayDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (field) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(true); }
  };

  return (
    <div className="space-y-4 w-full">
      {/* Top Banner & Quick Metrics */}
      <div className="bg-white p-4 md:p-5 rounded-2xl shadow-xs border border-emerald-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-emerald-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#194c29] text-amber-300 font-bold px-2 py-0.5 rounded text-xs">
                Module 1
              </span>
              <h2 className="text-lg md:text-xl font-bold text-slate-900">Bảng Theo Dõi Văn Bản Hàng Ngày (Mở Rộng Toàn Màn Hình)</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tự động tính toán hạn xử lý, cảnh báo sắp hết hạn, mở rộng bao quát 2 bên không phải cuộn ngang.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold rounded-xl border border-emerald-300 flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <FileDown className="w-3.5 h-3.5 text-emerald-700" />
              <span>Xuất CSV / Excel</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold rounded-xl border border-emerald-300 flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-700" />
              <span>In Bảng</span>
            </button>
            <button
              type="button"
              onClick={onAddDocument}
              className="px-4 py-1.5 bg-[#194c29] hover:bg-[#205e33] text-amber-300 text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Tiếp Nhận VB Mới</span>
            </button>
          </div>
        </div>

        {/* Status Count Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-3">
          <button
            type="button"
            onClick={() => setSelectedStatus('all')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              selectedStatus === 'all'
                ? 'bg-[#143e21] text-white border-[#143e21] shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <div className="text-[11px] font-semibold opacity-90">Tổng số văn bản</div>
            <div className="text-xl font-bold font-mono mt-0.5">{counts.total}</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus('Đang xử lý')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              selectedStatus === 'Đang xử lý'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-blue-50/70 hover:bg-blue-100 text-blue-900 border-blue-200'
            }`}
          >
            <div className="text-[11px] font-semibold flex items-center justify-between">
              <span>Đang xử lý (&gt;3 ngày)</span>
              <Clock className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="text-xl font-bold font-mono mt-0.5 text-blue-900">{counts.processing}</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus('Sắp hết hạn')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              selectedStatus === 'Sắp hết hạn'
                ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm font-bold'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-400'
            }`}
          >
            <div className="text-[11px] font-semibold flex items-center justify-between">
              <span>Sắp hết hạn (≤3 ngày)</span>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
            </div>
            <div className="text-xl font-bold font-mono mt-0.5 text-amber-900">{counts.dueSoon}</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus('Đã hết hạn')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              selectedStatus === 'Đã hết hạn'
                ? 'bg-rose-700 text-white border-rose-700 shadow-sm'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-950 border-rose-300'
            }`}
          >
            <div className="text-[11px] font-semibold flex items-center justify-between">
              <span>Đã hết hạn</span>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            </div>
            <div className="text-xl font-bold font-mono mt-0.5 text-rose-900">{counts.overdue}</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus('Đã hoàn thành')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              selectedStatus === 'Đã hoàn thành'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border-emerald-200'
            }`}
          >
            <div className="text-[11px] font-semibold flex items-center justify-between">
              <span>Đã hoàn thành</span>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-xl font-bold font-mono mt-0.5 text-emerald-900">{counts.completed}</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus('Đang theo dõi')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              selectedStatus === 'Đang theo dõi'
                ? 'bg-slate-700 text-white border-slate-700 shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
            }`}
          >
            <div className="text-[11px] font-semibold flex items-center justify-between">
              <span>Đang theo dõi</span>
              <Eye className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="text-xl font-bold font-mono mt-0.5 text-slate-800">{counts.trackingOnly}</div>
          </button>
        </div>
      </div>

      {/* FILTER BAR - Trực quan, gọn gàng */}
      <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-emerald-200 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#143e21] uppercase tracking-wider">
            <Filter className="w-4 h-4 text-emerald-700" /> Bộ Lọc Tìm Kiếm Trực Quan
          </div>
          {(searchTerm || selectedOfficer !== 'all' || selectedCategory !== 'all' || selectedStatus !== 'all' || startDate || endDate) && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedOfficer('all');
                setSelectedCategory('all');
                setSelectedStatus('all');
                setStartDate('');
                setEndDate('');
              }}
              className="text-xs text-red-600 hover:text-red-700 font-semibold underline"
            >
              Xóa tất cả bộ lọc
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm số hiệu, trích yếu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          </div>

          <div>
            <select
              value={selectedOfficer}
              onChange={(e) => setSelectedOfficer(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value="all">-- Tất cả cán bộ ({OFFICERS.length}) --</option>
              <optgroup label="21 Cán bộ địa bàn">
                {OFFICERS.filter(o => o.role === 'user').map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </optgroup>
              <optgroup label="Ban Chỉ huy Đội">
                {OFFICERS.filter(o => o.role === 'admin').map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value="all">-- Tất cả lĩnh vực ({categories.length}) --</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value="all">-- Tất cả trạng thái --</option>
              <option value="Đang xử lý">Đang xử lý (còn &gt; 3 ngày)</option>
              <option value="Sắp hết hạn">Sắp hết hạn (≤ 3 ngày)</option>
              <option value="Đã hết hạn">Đã hết hạn (quá hạn)</option>
              <option value="Đã hoàn thành">Đã hoàn thành (có kết quả)</option>
              <option value="Đang theo dõi">Đang theo dõi (không hạn)</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-1/2 px-1.5 py-1 text-[11px] border border-slate-300 rounded-lg"
              title="Từ ngày"
            />
            <span className="text-slate-400">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-1/2 px-1.5 py-1 text-[11px] border border-slate-300 rounded-lg"
              title="Đến ngày"
            />
          </div>
        </div>
      </div>

      {/* BẢNG DỮ LIỆU TOÀN MÀN HÌNH - KHÔNG CẦN CUỘN NGANG */}
      <div className="bg-white rounded-2xl shadow-xs border border-emerald-200 overflow-hidden w-full">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse table-auto">
            <thead>
              <tr className="bg-[#143e21] text-white font-semibold border-b border-[#286f3b]">
                <th className="py-2.5 px-2 text-center w-10">STT</th>
                <th 
                  className="py-2.5 px-2 cursor-pointer hover:bg-[#1b512b] transition-colors whitespace-nowrap w-[130px]"
                  onClick={() => handleSort('docNumber')}
                >
                  <div className="flex items-center gap-1">
                    <span>Số / Ký hiệu VB</span>
                    <ArrowUpDown className="w-3 h-3 text-lime-300" />
                  </div>
                </th>
                <th 
                  className="py-2.5 px-2 cursor-pointer hover:bg-[#1b512b] transition-colors whitespace-nowrap w-[85px]"
                  onClick={() => handleSort('docDate')}
                >
                  <div className="flex items-center gap-1">
                    <span>Ngày VB</span>
                    <ArrowUpDown className="w-3 h-3 text-lime-300" />
                  </div>
                </th>
                <th className="py-2.5 px-2.5 min-w-[200px]">Trích Yếu Nội Dung</th>
                <th className="py-2.5 px-2 whitespace-nowrap w-[100px]">Lĩnh Vực</th>
                <th className="py-2.5 px-2 whitespace-nowrap w-[130px]">Cán Bộ Thực Hiện</th>
                <th className="py-2.5 px-2 whitespace-nowrap w-[85px]">Ngày Nhận</th>
                <th 
                  className="py-2.5 px-2 cursor-pointer hover:bg-[#1b512b] transition-colors whitespace-nowrap w-[115px]"
                  onClick={() => handleSort('deadlineDate')}
                >
                  <div className="flex items-center gap-1">
                    <span>Thời Hạn Xử Lý</span>
                    <ArrowUpDown className="w-3 h-3 text-lime-300" />
                  </div>
                </th>
                <th className="py-2.5 px-2 text-center whitespace-nowrap w-[115px]">Trạng Thái</th>
                <th className="py-2.5 px-2.5 min-w-[170px]">Kết Quả Thực Hiện</th>
                <th className="py-2.5 px-1.5 text-center whitespace-nowrap w-20">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    Không tìm thấy văn bản phù hợp.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc, index) => {
                  const isAssignedToCurrentUser = doc.officerId === currentUser.id;
                  const canEdit = isAdmin || isAssignedToCurrentUser;

                  return (
                    <tr 
                      key={doc.id} 
                      className={`hover:bg-lime-50/40 transition-colors ${
                        doc.computedStatus === 'Sắp hết hạn' ? 'bg-amber-50/40' : ''
                      } ${
                        doc.computedStatus === 'Đã hết hạn' ? 'bg-rose-50/40' : ''
                      }`}
                    >
                      {/* STT */}
                      <td className="py-2.5 px-2 text-center font-mono text-slate-400 font-semibold">
                        {index + 1}
                      </td>

                      {/* Số / Ký hiệu VB */}
                      <td className="py-2.5 px-2 font-bold text-slate-900 font-mono text-[11px]">
                        {doc.docNumber}
                      </td>

                      {/* Ngày VB */}
                      <td className="py-2.5 px-2 text-slate-600 whitespace-nowrap font-mono text-[11px]">
                        {formatDateVN(doc.docDate)}
                      </td>

                      {/* Trích yếu */}
                      <td className="py-2.5 px-2.5 text-slate-800 leading-snug">
                        <p className="line-clamp-2" title={doc.excerpt}>{doc.excerpt}</p>
                      </td>

                      {/* Lĩnh vực */}
                      <td className="py-2.5 px-2 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 text-[11px] rounded-md border tracking-tight shadow-2xs ${doc.categoryBadgeClass}`}>
                          {doc.category}
                        </span>
                      </td>

                      {/* Cán bộ thực hiện */}
                      <td className="py-2.5 px-2">
                        <div className="font-semibold text-slate-900 text-xs">
                          {doc.officerName}
                        </div>
                        {doc.officerCommunes && doc.officerCommunes.length > 0 && (
                          <div className="text-[10px] text-emerald-800 font-medium truncate max-w-[130px]" title={doc.officerCommunes.join(', ')}>
                            {doc.officerCommunes.slice(0, 2).join(', ')}...
                          </div>
                        )}
                      </td>

                      {/* Ngày nhận */}
                      <td className="py-2.5 px-2 text-slate-600 whitespace-nowrap font-mono text-[11px]">
                        {formatDateVN(doc.receivedDate)}
                      </td>

                      {/* Thời hạn xử lý */}
                      <td className="py-2.5 px-2 whitespace-nowrap">
                        {doc.isTrackingOnly ? (
                          <span className="text-[10px] text-slate-600 italic bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            Theo dõi
                          </span>
                        ) : (
                          <div>
                            <div className="font-mono text-slate-900 font-medium text-[11px]">
                              {formatDateVN(doc.deadlineDate)}
                            </div>
                            {doc.computedStatus !== 'Đã hoàn thành' && doc.daysRemaining !== null && (
                              <div className="text-[10px] mt-0.5">
                                {doc.daysRemaining < 0 ? (
                                  <span className="text-red-700 font-bold">
                                    Quá {Math.abs(doc.daysRemaining)} ngày
                                  </span>
                                ) : doc.daysRemaining === 0 ? (
                                  <span className="text-amber-800 font-bold animate-pulse">
                                    Hôm nay đến hạn!
                                  </span>
                                ) : doc.daysRemaining <= 3 ? (
                                  <span className="text-amber-800 font-bold">
                                    Còn {doc.daysRemaining} ngày
                                  </span>
                                ) : (
                                  <span className="text-slate-500">
                                    Còn {doc.daysRemaining} ngày
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Trạng thái */}
                      <td className="py-2.5 px-2 text-center whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 text-[11px] rounded-full border shadow-2xs ${doc.statusBadgeClass}`}>
                          {doc.computedStatus}
                        </span>
                      </td>

                      {/* Kết quả thực hiện */}
                      <td className="py-2.5 px-2.5">
                        {doc.resultDocNumber || doc.resultExcerpt ? (
                          <div className="space-y-0.5 bg-emerald-50/80 p-1.5 rounded-lg border border-emerald-300">
                            {doc.resultDocNumber && (
                              <div className="font-bold text-emerald-950 font-mono text-[11px]">
                                Số: {doc.resultDocNumber} {doc.resultDocDate ? `(${formatDateVN(doc.resultDocDate)})` : ''}
                              </div>
                            )}
                            {doc.resultExcerpt && (
                              <p className="text-emerald-900 text-[11px] line-clamp-1 italic" title={doc.resultExcerpt}>
                                {doc.resultExcerpt}
                              </p>
                            )}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onOpenResultModal(doc)}
                            className="text-[11px] text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <Plus className="w-3 h-3" /> Nhập kết quả
                          </button>
                        )}
                      </td>

                      {/* Thao tác */}
                      <td className="py-2.5 px-1.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => onOpenResultModal(doc)}
                            className="p-1 text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                            title="Cập nhật kết quả hoàn thành"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => onEditDocument(doc)}
                              className="p-1 text-blue-700 hover:bg-blue-50 rounded transition-colors"
                              title="Sửa thông tin văn bản"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => onDeleteDocument(doc.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Xóa văn bản"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Hiển thị <strong>{filteredDocs.length}</strong> / <strong>{processedDocs.length}</strong> văn bản
          </div>
          <div className="text-[11px] text-slate-400">
            * Bảng được tối ưu hóa toàn màn hình giúp theo dõi thuận tiện, không cần thanh cuộn ngang.
          </div>
        </div>
      </div>
    </div>
  );
}
