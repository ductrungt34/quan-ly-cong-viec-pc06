-- BẢNG DỮ LIỆU CƠ SỞ DỮ LIỆU SUPABASE CHO ĐỘI 2 - PHÒNG PC06 CÔNG AN TP HẢI PHÒNG
-- Bạn có thể copy toàn bộ đoạn mã này và dán vào mục SQL Editor trên Supabase Dashboard để khởi tạo Database

-- 1. Bảng Danh mục Lĩnh vực (Categories)
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color_code TEXT DEFAULT 'blue',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Khởi tạo danh mục mặc định
INSERT INTO categories (id, name, color_code) VALUES
  ('cat_1', 'Cư trú', 'blue'),
  ('cat_2', 'Căn cước', 'emerald'),
  ('cat_3', 'Đề án 06', 'purple'),
  ('cat_4', 'Đất đai', 'amber'),
  ('cat_5', 'Giao thông', 'cyan')
ON CONFLICT (name) DO NOTHING;

-- 2. Bảng Cán bộ (Officers)
CREATE TABLE IF NOT EXISTS officers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  rank_title TEXT, -- Thượng tá, Trung tá, Đại úy, Thượng úy...
  role TEXT NOT NULL CHECK (role IN ('admin', 'officer')),
  position TEXT, -- Đội trưởng, Phó Đội trưởng, Cán bộ địa bàn
  assigned_communes TEXT[], -- Mảng các xã, phường phụ trách
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Bảng Văn bản hàng ngày (Module 1 - Documents)
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  doc_number TEXT NOT NULL,          -- Số/Ký hiệu VB
  doc_date DATE NOT NULL,            -- Ngày VB
  excerpt TEXT NOT NULL,             -- Trích yếu
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL, -- Lĩnh vực
  officer_id TEXT REFERENCES officers(id) ON DELETE SET NULL,     -- Cán bộ thực hiện
  received_date DATE NOT NULL,       -- Ngày nhận
  deadline_date DATE,                -- Thời hạn xử lý (NULL nếu là văn bản theo dõi)
  is_tracking_only BOOLEAN DEFAULT FALSE, -- Văn bản theo dõi (không hạn)
  status TEXT NOT NULL,              -- 'Đang theo dõi' | 'Đang xử lý' | 'Sắp hết hạn' | 'Đã hết hạn' | 'Đã hoàn thành'
  
  -- Kết quả thực hiện
  result_doc_number TEXT,            -- Số/Ký hiệu VB kết quả
  result_doc_date DATE,              -- Ngày VB kết quả
  result_excerpt TEXT,               -- Trích yếu kết quả
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Bảng Nhiệm vụ đôn đốc Công an cấp xã (Module 2 - Tasks)
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,               -- Tiêu đề nhiệm vụ đôn đốc
  content TEXT NOT NULL,             -- Nội dung chi tiết
  category TEXT,                     -- Lĩnh vực
  assigned_officer_ids TEXT[],       -- Danh sách ID cán bộ được giao (hoặc 'all')
  deadline DATE NOT NULL,            -- Hạn chót
  created_by TEXT REFERENCES officers(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Bảng Cập nhật tiến độ đôn đốc của cán bộ (Module 2 - Task Submissions)
CREATE TABLE IF NOT EXISTS task_submissions (
  id TEXT PRIMARY KEY,
  task_id TEXT REFERENCES tasks(id) ON DELETE CASCADE,
  officer_id TEXT REFERENCES officers(id) ON DELETE CASCADE,
  urging_status TEXT NOT NULL CHECK (urging_status IN ('Chưa đôn đốc', 'Đang thực hiện', 'Đã đôn đốc / Hoàn thành', 'Không hoàn thành')),
  notes TEXT,                        -- Ghi chú tình hình địa bàn, khó khăn
  attachment_name TEXT,              -- Tên tài liệu đính kèm
  attachment_url TEXT,               -- Link tài liệu đính kèm
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(task_id, officer_id)
);

-- Enable Row Level Security (RLS) & Policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_submissions ENABLE ROW LEVEL SECURITY;

-- Cho phép đọc công khai nội bộ (có thể tùy chỉnh theo Auth Supabase)
CREATE POLICY "Public Read All" ON categories FOR ALL USING (true);
CREATE POLICY "Public Read Officers" ON officers FOR ALL USING (true);
CREATE POLICY "Public Manage Documents" ON documents FOR ALL USING (true);
CREATE POLICY "Public Manage Tasks" ON tasks FOR ALL USING (true);
CREATE POLICY "Public Manage Submissions" ON task_submissions FOR ALL USING (true);
