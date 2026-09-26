// Logic tính toán ngày tháng và trạng thái tự động

export function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateVN(dateString) {
  if (!dateString) return '—';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? dateString : d.toLocaleDateString('vi-VN');
  } catch (e) {
    return dateString;
  }
}

/**
 * Tính số ngày còn lại đến hạn chót (tính theo ngày tròn)
 */
export function calculateDaysRemaining(deadlineDateStr, currentDateStr = getTodayDateString()) {
  if (!deadlineDateStr) return null;
  const deadline = new Date(deadlineDateStr);
  deadline.setHours(23, 59, 59, 999);
  
  const current = new Date(currentDateStr);
  current.setHours(0, 0, 0, 0);

  const diffTime = deadline.getTime() - current.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Xếp loại thi đua chuẩn theo tỷ lệ phần trăm (%):
 * - Từ 90% trở lên: Loại A
 * - Từ 80% đến dưới 90%: Loại B
 * - Từ 70% đến dưới 80%: Loại C
 * - Dưới 70%: Loại D
 */
export function getGradeFromPercentage(percentage) {
  const p = Math.round(percentage);
  if (p >= 90) {
    return {
      grade: 'Loại A (Xuất sắc)',
      shortGrade: 'Loại A',
      badgeClass: 'bg-emerald-100 text-emerald-950 border-emerald-300 font-bold'
    };
  } else if (p >= 80) {
    return {
      grade: 'Loại B (Tốt)',
      shortGrade: 'Loại B',
      badgeClass: 'bg-blue-100 text-blue-950 border-blue-300 font-semibold'
    };
  } else if (p >= 70) {
    return {
      grade: 'Loại C (Hoàn thành)',
      shortGrade: 'Loại C',
      badgeClass: 'bg-amber-100 text-amber-950 border-amber-300 font-medium'
    };
  } else {
    return {
      grade: 'Loại D (Cần đôn đốc)',
      shortGrade: 'Loại D',
      badgeClass: 'bg-rose-100 text-rose-950 border-rose-300 font-bold'
    };
  }
}

/**
 * Logic tự động tính toán Trạng thái Văn bản (Module 1):
 */
export function computeDocumentStatus(doc, currentDateStr = getTodayDateString()) {
  if (doc.isTrackingOnly || !doc.deadlineDate) {
    return {
      status: 'Đang theo dõi',
      badgeClass: 'bg-slate-100 text-slate-800 border-slate-300 font-medium',
      daysRemaining: null,
      isOverdue: false
    };
  }

  // Đã có kết quả thực hiện
  const hasResult = Boolean(
    (doc.resultDocNumber && doc.resultDocNumber.trim()) ||
    (doc.resultDocDate && doc.resultDocDate.trim()) ||
    (doc.resultExcerpt && doc.resultExcerpt.trim())
  );

  if (hasResult) {
    return {
      status: 'Đã hoàn thành',
      badgeClass: 'bg-emerald-100 text-emerald-950 border-emerald-300 font-semibold',
      daysRemaining: null,
      isOverdue: false
    };
  }

  const days = calculateDaysRemaining(doc.deadlineDate, currentDateStr);

  if (days < 0) {
    return {
      status: 'Đã hết hạn',
      badgeClass: 'bg-rose-100 text-rose-950 border-rose-300 font-bold',
      daysRemaining: days,
      isOverdue: true
    };
  } else if (days <= 3) {
    return {
      status: 'Sắp hết hạn',
      badgeClass: 'bg-amber-100 text-amber-950 border-amber-400 font-bold',
      daysRemaining: days,
      isOverdue: false
    };
  } else {
    return {
      status: 'Đang xử lý',
      badgeClass: 'bg-blue-100 text-blue-950 border-blue-300 font-medium',
      daysRemaining: days,
      isOverdue: false
    };
  }
}

/**
 * Logic tự động tính toán Trạng thái Đôn đốc Cấp Xã (Module 2):
 * - Nếu quá thời hạn được giao mà không đôn đốc (hoặc chưa xong):
 *   + Khóa quyền cập nhật, chỉnh sửa của cán bộ
 *   + Trạng thái hiển thị: "Chưa đôn đốc" (với cảnh báo Quá hạn)
 * - Hỗ trợ phân công địa bàn: có thể giao tất cả địa bàn hoặc 1 số địa bàn cụ thể
 */
export function computeTaskOfficerStatus(task, officer, currentDateStr = getTodayDateString()) {
  const officerId = typeof officer === 'string' ? officer : officer?.id;
  
  // Xác định chính xác danh sách xã/phường được giao trong nhiệm vụ này (có thể là tất cả hoặc một số xã)
  let assignedCommunes = [];
  if (task.assignedCommunes && task.assignedCommunes[officerId]) {
    assignedCommunes = task.assignedCommunes[officerId];
  } else if (typeof officer === 'object') {
    assignedCommunes = officer.communes || [];
  }

  const submission = task.submissions?.[officerId];
  const isPastDeadline = calculateDaysRemaining(task.deadline, currentDateStr) < 0;

  // Breakdown per commune
  let communeBreakdown = {};
  let completedCommunesCount = 0;
  let inProgressCommunesCount = 0;
  let notStartedCommunesCount = 0;

  if (assignedCommunes.length > 0) {
    assignedCommunes.forEach(cName => {
      const cData = submission?.communeResults?.[cName];
      let cStatus = cData?.status;
      
      if (!cStatus) {
        cStatus = submission?.urgingStatus || 'Chưa đôn đốc';
        if (cStatus === 'Đã đôn đốc / Hoàn thành') cStatus = 'Đã hoàn thành';
      }

      if (cStatus === 'Đã hoàn thành' || cStatus === 'Đã đôn đốc / Hoàn thành') {
        completedCommunesCount++;
        communeBreakdown[cName] = { status: 'Đã hoàn thành', notes: cData?.notes || '' };
      } else if (cStatus === 'Đang thực hiện') {
        if (isPastDeadline) {
          // Quá hạn mà chưa xong -> tính là chưa đôn đốc đạt yêu cầu
          communeBreakdown[cName] = { status: 'Chưa đôn đốc', notes: cData?.notes || 'Quá hạn chưa hoàn thành' };
        } else {
          inProgressCommunesCount++;
          communeBreakdown[cName] = { status: 'Đang thực hiện', notes: cData?.notes || '' };
        }
      } else {
        notStartedCommunesCount++;
        communeBreakdown[cName] = { status: 'Chưa đôn đốc', notes: '' };
      }
    });
  }

  const isAllCommunesDone = assignedCommunes.length > 0 && completedCommunesCount === assignedCommunes.length;

  // 1. Nếu đã hoàn thành đầy đủ
  if (isAllCommunesDone || (submission && (submission.urgingStatus === 'Đã đôn đốc / Hoàn thành' || submission.urgingStatus === 'Đã hoàn thành'))) {
    return {
      status: 'Đã hoàn thành',
      badgeClass: 'bg-emerald-100 text-emerald-950 border-emerald-300 font-semibold',
      submission,
      communeBreakdown,
      completedCommunesCount: assignedCommunes.length,
      totalCommunesCount: assignedCommunes.length,
      isLocked: false,
      isOverdueNotUrged: false
    };
  }

  // 2. Nếu QUÁ HẠN mà không đôn đốc hoặc chưa hoàn thành:
  // Theo yêu cầu: Khóa quyền cập nhật và hiển thị trạng thái "Chưa đôn đốc"!
  if (isPastDeadline) {
    return {
      status: 'Chưa đôn đốc',
      badgeClass: 'bg-rose-100 text-rose-950 border-rose-300 font-bold',
      submission,
      isLocked: true, // Không thể cập nhật, chỉnh sửa
      isOverdueNotUrged: true,
      communeBreakdown,
      completedCommunesCount,
      totalCommunesCount: assignedCommunes.length
    };
  }

  // 3. Trong hạn và đang thực hiện
  if (submission && (submission.urgingStatus === 'Đang thực hiện' || inProgressCommunesCount > 0 || completedCommunesCount > 0)) {
    return {
      status: 'Đang thực hiện',
      badgeClass: 'bg-blue-100 text-blue-950 border-blue-300 font-medium',
      submission,
      isLocked: false,
      isOverdueNotUrged: false,
      communeBreakdown,
      completedCommunesCount,
      totalCommunesCount: assignedCommunes.length
    };
  }

  // 4. Trong hạn nhưng chưa đôn đốc
  return {
    status: 'Chưa đôn đốc',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-300 font-medium',
    submission,
    isLocked: false,
    isOverdueNotUrged: false,
    communeBreakdown,
    completedCommunesCount: 0,
    totalCommunesCount: assignedCommunes.length
  };
}
