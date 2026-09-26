// Danh sách cán bộ Đội 2, Phòng Cảnh sát QLHC về TTXH (PC06) - Công an TP Hải Phòng

export const OFFICERS = [
  // --- Ban Chỉ Huy Đội (Admin/Quản lý) ---
  {
    id: 'ch_1',
    name: 'Thượng tá Đỗ Thị Thu',
    rank: 'Thượng tá',
    position: 'Đội trưởng',
    role: 'admin',
    responsibility: 'Phụ trách chung & Chỉ đạo trực tiếp Đề án 06',
    communes: []
  },
  {
    id: 'ch_2',
    name: 'Trung tá Đoàn Vũ Thành',
    rank: 'Trung tá',
    position: 'Phó Đội trưởng',
    role: 'admin',
    responsibility: 'Phụ trách công tác Quản lý Cư trú',
    communes: []
  },
  {
    id: 'ch_3',
    name: 'Trung tá Nguyễn Thị Ngư',
    rank: 'Trung tá',
    position: 'Phó Đội trưởng',
    role: 'admin',
    responsibility: 'Phụ trách công tác Căn cước',
    communes: []
  },
  {
    id: 'ch_admin',
    name: 'Cán bộ Quản trị / Tổng hợp',
    rank: 'Đại úy',
    position: 'Cán bộ Tổng hợp Đội',
    role: 'admin',
    responsibility: 'Theo dõi tổng hợp, quản trị hệ thống văn bản & tiến độ',
    communes: []
  },

  // --- 21 Cán bộ địa bàn (User) ---
  {
    id: 'cb_1',
    name: 'Hoàng Thị Thuỳ Dung',
    rank: 'Đại úy',
    position: 'Cán bộ địa bàn',
    role: 'user',
    communes: ['Thủy Nguyên', 'Bạch Đằng', 'Lê Chân']
  },
  {
    id: 'cb_2',
    name: 'Đỗ Thị Thanh Huyền',
    rank: 'Thượng úy',
    position: 'Cán bộ địa bàn',
    role: 'user',
    communes: ['An Biên', 'Nam Triệu']
  },
  {
    id: 'cb_3',
    name: 'Nguyễn Thị Hồng Vân',
    rank: 'Đại úy',
    position: 'Cán bộ địa bàn',
    role: 'user',
    communes: ['Thành Đông', 'Nam Đồng', 'Tân Hưng']
  },
  {
    id: 'cb_4',
    name: 'Tạ Thị Quỳnh Anh',
    rank: 'Thượng úy',
    position: 'Cán bộ địa bàn',
    role: 'user',
    communes: ['Hải Dương', 'Lê Thanh Nghị', 'Ái Quốc']
  },
  {
    id: 'cb_5',
    name: 'Phạm Liên Hương',
    rank: 'Đại úy',
    position: 'Cán bộ địa bàn',
    role: 'user',
    communes: ['Thạch Khôi', 'Tứ Minh', 'Việt Hòa']
  },
  {
    id: 'cb_6',
    name: 'Đặng Hoàng Minh',
    rank: 'Đại úy',
    position: 'Cán bộ địa bàn',
    role: 'user',
    communes: ['Cẩm Giàng', 'Cẩm Giang', 'Tuệ Tĩnh', 'Mao Điền', 'Kim Thành', 'Lai Khê', 'Phú Thái', 'An Thành']
  },
  {
    id: 'cb_7',
    name: 'Vũ Thị Yến Dung',
    rank: 'Thượng úy',
    position: 'Cán bộ địa bàn',
    role: 'user',
    communes: ['Đồ Sơn', 'Nam Đồ Sơn', 'Kiến Hưng', 'Ngô Quyền', 'Gia Viên']
  },
  {
    id: 'cb_8',
    name: 'Lê Đức Anh',
    rank: 'Đại úy',
    position: 'Cán bộ địa bàn',
    role: 'user',
    communes: ['Kiến Thụy', 'Kiến Minh', 'Kiến Hải', 'Nghi Dương', 'Dương Kinh', 'Hưng Đạo', 'Nguyễn Bỉnh Khiêm']
  },
  {
    id: 'cb_9',
    name: 'Nguyễn Thế Anh',
    rank: 'Đại úy',
    position: 'Cán bộ địa bàn',
    role: 'user',
    communes: ['Tiên Lãng', 'Quyết Thắng', 'Tân Minh', 'Tiên Minh', 'Chấn Hưng', 'Hùng Thắng', 'Vĩnh Am']
  },
  {
    id: 'cb_10',
    name: 'Phạm Tú Anh',
    rank: 'Thượng úy',
    position: 'Cán bộ địa bàn',
    role: 'user',
    communes: ['Tứ Kỳ', 'Tân Kỳ', 'Đại Sơn', 'Chí Minh', 'Lạc Phượng', 'Nguyên Giáp']
  },
  {
    id: 'cb_11',
    name: 'Đào Thị Ngọc Minh',
    rank: 'Đại úy',
    position: 'Cán bộ địa bàn',
    role: 'user',
    communes: ['Hồng Bàng', 'Hồng An', 'Thiên Hương', 'Hòa Bình', 'Phù Liễn']
  },
  {
    id: 'cb_12',
    name: 'Phạm Thị Hải Yến',
    rank: 'Thượng úy',
    position: 'Cán bộ địa bàn',
    role: 'user',
    communes: ['An Quang', 'An Trường', 'Cát Hải', 'Lưu Kiếm']
  },
  {
    id: 'cb_13',
    name: 'Đặng Thuý Hằng',
    rank: 'Đại úy',
    position: 'Cán bộ địa bàn',
    role: 'user',
    communes: ['Kiến An', 'An Khánh', 'An Hưng', 'An Lão']
  },
  {
    id: 'cb_14',
    name: 'Lương Quốc Dũng',
    rank: 'Thượng úy',
    position: 'Cán bộ địa bàn',
    role: 'user',
    communes: ['Lê Ích Mộc', 'Việt Khê', 'An Phong']
  },
  {
    id: 'cb_15',
    name: 'Phạm Thị Phương Anh',
    rank: 'Đại úy',
    position: 'Cán bộ địa bàn',
    role: 'user',
    communes: ['Nguyễn Đại Năng', 'Trần Liễu', 'Bắc An Phụ', 'Nam An Phụ', 'Nhị Chiểu', 'Phạm Sư Mạnh', 'An Dương']
  },
  {
    id: 'cb_16',
    name: 'Nguyễn Xuân Bách',
    rank: 'Đại úy',
    position: 'Cán bộ địa bàn',
    role: 'user',
    communes: ['Vĩnh Thuận', 'Vĩnh Thịnh', 'Vĩnh Hòa', 'Bạch Long Vĩ', 'Gia Lộc', 'Yết Kiêu', 'Gia Phúc', 'Trường Tân']
  },
  {
    id: 'cb_17',
    name: 'Phạm Đức Trung',
    rank: 'Đại úy',
    position: 'Cán bộ địa bàn',
    role: 'user',
    communes: ['Bình Giang', 'Kẻ Sặt', 'Đường An', 'Thượng Hồng', 'Thanh Miện', 'Bắc Thanh Miện', 'Nam Thanh Miện', 'Hải Hưng', 'Nguyễn Lương Bằng']
  },
  {
    id: 'cb_18',
    name: 'Nguyễn Thị Nhạn',
    rank: 'Đại úy',
    position: 'Cán bộ địa bàn',
    role: 'user',
    communes: ['Đông Hải', 'Hà Nam', 'Hà Đông']
  },
  {
    id: 'cb_19',
    name: 'Vũ Thị Thu Phương',
    rank: 'Thượng úy',
    position: 'Cán bộ địa bàn',
    role: 'user',
    communes: ['Vĩnh Bảo', 'Vĩnh Hải', 'Hải An']
  },
  {
    id: 'cb_20',
    name: 'Nguyễn Văn Sơn',
    rank: 'Đại úy',
    position: 'Cán bộ địa bàn',
    role: 'user',
    communes: ['Chí Linh', 'Chu Văn An', 'Trần Hưng Đạo', 'Nguyễn Trãi', 'Trần Nhân Tông', 'Lê Đại Hành', 'Hà Bắc']
  },
  {
    id: 'cb_21',
    name: 'Nguyễn Văn Tuấn',
    rank: 'Thượng úy',
    position: 'Cán bộ địa bàn',
    role: 'user',
    communes: ['Nam Sách', 'Thái Tân', 'Hợp Tiến', 'Trần Phú', 'An Phú', 'Thanh Hà', 'Hà Tây']
  }
];

export const DEFAULT_CATEGORIES = [
  { id: 'cat_1', name: 'Cư trú', colorClass: 'bg-emerald-100 text-emerald-950 border-emerald-300 font-semibold' },
  { id: 'cat_2', name: 'Căn cước', colorClass: 'bg-teal-100 text-teal-950 border-teal-300 font-semibold' },
  { id: 'cat_3', name: 'Đề án 06', colorClass: 'bg-lime-100 text-lime-950 border-lime-400 font-semibold' },
  { id: 'cat_4', name: 'Đất đai', colorClass: 'bg-amber-100 text-amber-950 border-amber-400 font-semibold' },
  { id: 'cat_5', name: 'Giao thông', colorClass: 'bg-cyan-100 text-cyan-950 border-cyan-300 font-semibold' }
];

export const INITIAL_DOCUMENTS = [
  {
    id: 'doc_1',
    stt: 1,
    docNumber: '1428/CATP-PC06',
    docDate: '2026-09-20',
    excerpt: 'Tham mưu kiểm tra, rà soát công tác quản lý cư trú và kiểm tra lưu trú đối với người nước ngoài trên địa bàn',
    category: 'Cư trú',
    officerId: 'cb_1', // Hoàng Thị Thuỳ Dung
    receivedDate: '2026-09-21',
    deadlineDate: '2026-09-30',
    isTrackingOnly: false,
    resultDocNumber: '',
    resultDocDate: '',
    resultExcerpt: ''
  },
  {
    id: 'doc_2',
    stt: 2,
    docNumber: '589/C06-TTDL',
    docDate: '2026-09-18',
    excerpt: 'Tham mưu chỉ đạo làm sạch dữ liệu công dân không có thông tin nơi cư trú và sai lệch năm sinh trên hệ thống CSDLQG về DC',
    category: 'Đề án 06',
    officerId: 'cb_6', // Đặng Hoàng Minh
    receivedDate: '2026-09-19',
    deadlineDate: '2026-09-27', // Sắp hết hạn (<= 3 ngày)
    isTrackingOnly: false,
    resultDocNumber: '',
    resultDocDate: '',
    resultExcerpt: ''
  },
  {
    id: 'doc_3',
    stt: 3,
    docNumber: '892/Đ2-CC',
    docDate: '2026-09-10',
    excerpt: 'Kế hoạch tham mưu triển khai thu nhận hồ sơ cấp Căn cước lưu động cho học sinh các trường THCS và công dân dưới 14 tuổi',
    category: 'Căn cước',
    officerId: 'cb_7', // Vũ Thị Yến Dung
    receivedDate: '2026-09-11',
    deadlineDate: '2026-09-24', // Đã hết hạn (< 0 ngày)
    isTrackingOnly: false,
    resultDocNumber: '',
    resultDocDate: '',
    resultExcerpt: ''
  },
  {
    id: 'doc_4',
    stt: 4,
    docNumber: '315/VP-CATP',
    docDate: '2026-09-12',
    excerpt: 'Báo cáo tham mưu phối hợp xác minh diện tích đất quốc phòng, an ninh trên địa bàn quản lý',
    category: 'Đất đai',
    officerId: 'cb_8', // Lê Đức Anh
    receivedDate: '2026-09-13',
    deadlineDate: '2026-09-25',
    isTrackingOnly: false,
    resultDocNumber: '412/BC-PC06',
    resultDocDate: '2026-09-24',
    resultExcerpt: 'Đã hoàn thành tham mưu xác minh và tổng hợp báo cáo gửi Văn phòng CATP'
  },
  {
    id: 'doc_5',
    stt: 5,
    docNumber: '102/CT-BCA',
    docDate: '2026-09-15',
    excerpt: 'Chỉ thị theo dõi nắm tình hình vi phạm trật tự an toàn giao thông đường bộ trên các tuyến đê xung yếu và bến bãi vật liệu',
    category: 'Giao thông',
    officerId: 'cb_9', // Nguyễn Thế Anh
    receivedDate: '2026-09-16',
    deadlineDate: '',
    isTrackingOnly: true, // Văn bản theo dõi
    resultDocNumber: '',
    resultDocDate: '',
    resultExcerpt: ''
  },
  {
    id: 'doc_6',
    stt: 6,
    docNumber: '612/PC06-Đ2',
    docDate: '2026-09-22',
    excerpt: 'Văn bản tham mưu hướng dẫn Công an các xã thực hiện quy trình hủy, xác lập lại số định danh cá nhân bị sai lệch',
    category: 'Đề án 06',
    officerId: 'cb_11', // Đào Thị Ngọc Minh
    receivedDate: '2026-09-23',
    deadlineDate: '2026-10-05',
    isTrackingOnly: false,
    resultDocNumber: '',
    resultDocDate: '',
    resultExcerpt: ''
  },
  {
    id: 'doc_7',
    stt: 7,
    docNumber: '750/CATP-PC06',
    docDate: '2026-09-14',
    excerpt: 'Tham mưu kế hoạch kiểm tra liên ngành công tác PCCC và đăng ký quản lý ngành nghề đầu tư kinh doanh có điều kiện về ANTT',
    category: 'Cư trú',
    officerId: 'cb_17', // Phạm Đức Trung
    receivedDate: '2026-09-15',
    deadlineDate: '2026-09-28',
    isTrackingOnly: false,
    resultDocNumber: '533/BC-Đ2',
    resultDocDate: '2026-09-25',
    resultExcerpt: 'Đã hoàn thành dự thảo văn bản tham mưu báo cáo lãnh đạo Phòng ký ban hành'
  }
];

export const INITIAL_TASKS = [
  {
    id: 'task_1',
    title: 'Đôn đốc Công an cấp xã làm sạch 100% dữ liệu dân cư trùng lặp và sai cấu trúc',
    content: 'Đôn đốc các xã, phường phụ trách rà soát, đối chiếu hồ sơ tàng thư và cập nhật phần mềm DC01, hoàn thành chỉ tiêu Bộ Công an giao trước ngày 30/09/2026.',
    category: 'Đề án 06',
    assignedToAll: true,
    assignedOfficers: [], // empty = all
    deadline: '2026-09-30',
    createdAt: '2026-09-15',
    createdByName: 'Thượng tá Đỗ Thị Thu - Đội trưởng',
    submissions: {
      'cb_1': {
        mode: 'per_commune',
        urgingStatus: 'Đã đôn đốc / Hoàn thành',
        communeResults: {
          'Thủy Nguyên': { status: 'Đã hoàn thành', notes: 'Đã xử lý xong 100% dữ liệu sai lệch' },
          'Bạch Đằng': { status: 'Đã hoàn thành', notes: 'Hoàn thành hồ sơ đối chiếu' },
          'Lê Chân': { status: 'Đang thực hiện', notes: 'Còn 12 trường hợp đang xác minh tàng thư' }
        },
        notes: 'Đã trực tiếp làm việc với CA các xã, phường. Đã xử lý xong 98% dữ liệu toàn địa bàn.',
        attachmentName: 'BaoCao_ThuyNguyen_BachDang.pdf',
        submittedAt: '2026-09-25T10:30:00'
      },
      'cb_6': {
        mode: 'per_commune',
        urgingStatus: 'Đang thực hiện',
        communeResults: {
          'Cẩm Giàng': { status: 'Đã hoàn thành', notes: 'Xong 100%' },
          'Cẩm Giang': { status: 'Đã hoàn thành', notes: 'Xong 100%' },
          'Tuệ Tĩnh': { status: 'Đang thực hiện', notes: 'Đang tiếp tục đối chiếu' },
          'Mao Điền': { status: 'Đang thực hiện', notes: 'Còn 25 trường hợp' },
          'Kim Thành': { status: 'Đã hoàn thành', notes: 'Hoàn thành tốt' },
          'Lai Khê': { status: 'Đang thực hiện', notes: 'Đang rà soát' },
          'Phú Thái': { status: 'Chưa đôn đốc', notes: 'Chưa sắp xếp lịch' },
          'An Thành': { status: 'Đang thực hiện', notes: 'Đang kiểm tra' }
        },
        notes: 'Đã kiểm tra 4/8 xã (Cẩm Giàng, Cẩm Giang, Kim Thành...). Còn 4 xã đang tiếp tục cập nhật.',
        attachmentName: 'TienDo_CamGiang_KimThanh.xlsx',
        submittedAt: '2026-09-24T15:20:00'
      },
      'cb_17': {
        mode: 'per_commune',
        urgingStatus: 'Đã đôn đốc / Hoàn thành',
        communeResults: {
          'Bình Giang': { status: 'Đã hoàn thành', notes: 'Đạt 100% chỉ tiêu' },
          'Kẻ Sặt': { status: 'Đã hoàn thành', notes: 'Đạt 100% chỉ tiêu' },
          'Đường An': { status: 'Đã hoàn thành', notes: 'Đạt 100% chỉ tiêu' },
          'Thượng Hồng': { status: 'Đã hoàn thành', notes: 'Đã rà soát xong' },
          'Thanh Miện': { status: 'Đã hoàn thành', notes: 'Hoàn thành xuất sắc' },
          'Bắc Thanh Miện': { status: 'Đã hoàn thành', notes: 'Hoàn thành' },
          'Nam Thanh Miện': { status: 'Đã hoàn thành', notes: 'Hoàn thành' },
          'Hải Hưng': { status: 'Đã hoàn thành', notes: 'Hoàn thành' },
          'Nguyễn Lương Bằng': { status: 'Đã hoàn thành', notes: 'Hoàn thành' }
        },
        notes: 'Đã hoàn thành đôn đốc toàn diện 9/9 xã, thị trấn phụ trách, thu thập đầy đủ biên bản.',
        attachmentName: 'BienBan_TongHop_BinhGiang_ThanhMien.pdf',
        submittedAt: '2026-09-25T16:00:00'
      }
    }
  },
  {
    id: 'task_2',
    title: 'Kiểm tra, đôn đốc thu nhận hồ sơ Căn cước cho công dân dưới 14 tuổi đợt cao điểm',
    content: 'Tập trung phối hợp các trường mầm non, tiểu học rà soát trẻ từ 0 - 6 tuổi và 6 - 14 tuổi để thu nhận hồ sơ căn cước lưu động.',
    category: 'Căn cước',
    assignedToAll: false,
    assignedOfficers: ['cb_1', 'cb_2', 'cb_3', 'cb_7', 'cb_8', 'cb_13', 'cb_17'],
    deadline: '2026-09-28',
    createdAt: '2026-09-18',
    createdByName: 'Trung tá Nguyễn Thị Ngư - Phó Đội trưởng',
    submissions: {
      'cb_7': {
        mode: 'per_commune',
        urgingStatus: 'Đang thực hiện',
        communeResults: {
          'Đồ Sơn': { status: 'Đã hoàn thành', notes: 'Hoàn thành 300 hồ sơ' },
          'Nam Đồ Sơn': { status: 'Đã hoàn thành', notes: 'Hoàn thành 150 hồ sơ' },
          'Kiến Hưng': { status: 'Đang thực hiện', notes: 'Đang lưu động tại trường Tiểu học' },
          'Ngô Quyền': { status: 'Đang thực hiện', notes: 'Đang thống kê' },
          'Gia Viên': { status: 'Chưa đôn đốc', notes: 'Chưa thực hiện' }
        },
        notes: 'Địa bàn Đồ Sơn, Nam Đồ Sơn đã hoàn thành 450 hồ sơ lưu động trong tuần.',
        attachmentName: 'DanhSach_ThuNhan_DoSon.pdf',
        submittedAt: '2026-09-23T14:10:00'
      }
    }
  },
  {
    id: 'task_3',
    title: 'Tổng kiểm tra công tác khai báo lưu trú trên cổng Dịch vụ công Quốc gia quý III',
    content: 'Đôn đốc các xã kiểm tra các cơ sở kinh doanh dịch vụ lưu trú, nhà trọ, khách sạn thực hiện nghiêm thông báo lưu trú qua ứng dụng VNeID.',
    category: 'Cư trú',
    assignedToAll: true,
    assignedOfficers: [],
    deadline: '2026-09-22', // Đã qua hạn
    createdAt: '2026-09-01',
    createdByName: 'Trung tá Đoàn Vũ Thành - Phó Đội trưởng',
    submissions: {
      'cb_8': {
        mode: 'per_commune',
        urgingStatus: 'Đã đôn đốc / Hoàn thành',
        communeResults: {
          'Kiến Thụy': { status: 'Đã hoàn thành', notes: 'Đã kiểm tra 12 khách sạn' },
          'Kiến Minh': { status: 'Đã hoàn thành', notes: 'Hoàn thành' },
          'Kiến Hải': { status: 'Đã hoàn thành', notes: 'Hoàn thành' },
          'Nghi Dương': { status: 'Đã hoàn thành', notes: 'Hoàn thành' },
          'Dương Kinh': { status: 'Đã hoàn thành', notes: 'Kiểm tra 45 nhà nghỉ' },
          'Hưng Đạo': { status: 'Đã hoàn thành', notes: 'Hoàn thành' },
          'Nguyễn Bỉnh Khiêm': { status: 'Đã hoàn thành', notes: 'Hoàn thành' }
        },
        notes: 'Đã gửi biên bản kiểm tra 12 khách sạn, 45 nhà nghỉ trên địa bàn Kiến Thụy, Dương Kinh.',
        attachmentName: 'KiemTra_LuuTru_KienThuy.pdf',
        submittedAt: '2026-09-21T09:00:00'
      }
    }
  }
];
