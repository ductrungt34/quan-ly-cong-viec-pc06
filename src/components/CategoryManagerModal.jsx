import React, { useState } from 'react';
import { X, Plus, Trash2, Edit2, Check, Tag } from 'lucide-react';

const PRESET_STYLES = [
  { label: 'Xanh lam (Blue)', colorClass: 'bg-blue-100 text-blue-950 border-blue-300 font-semibold' },
  { label: 'Xanh lục (Emerald)', colorClass: 'bg-emerald-100 text-emerald-950 border-emerald-300 font-semibold' },
  { label: 'Tím nhạt (Purple)', colorClass: 'bg-purple-100 text-purple-950 border-purple-300 font-semibold' },
  { label: 'Vàng cam (Amber)', colorClass: 'bg-amber-100 text-amber-950 border-amber-400 font-semibold' },
  { label: 'Xanh ngọc (Cyan)', colorClass: 'bg-cyan-100 text-cyan-950 border-cyan-300 font-semibold' },
  { label: 'Hồng trầm (Rose)', colorClass: 'bg-rose-100 text-rose-950 border-rose-300 font-semibold' },
  { label: 'Xanh chàm (Indigo)', colorClass: 'bg-indigo-100 text-indigo-950 border-indigo-300 font-semibold' },
  { label: 'Xanh mòng két (Teal)', colorClass: 'bg-teal-100 text-teal-950 border-teal-300 font-semibold' },
];

export default function CategoryManagerModal({ isOpen, onClose, categories, onSaveCategories }) {
  const [cats, setCats] = useState(categories);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState(PRESET_STYLES[0].colorClass);

  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(PRESET_STYLES[0].colorClass);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      setErrorMsg('Vui lòng nhập tên lĩnh vực');
      return;
    }
    if (cats.some(c => c.name.toLowerCase() === newName.trim().toLowerCase())) {
      setErrorMsg('Lĩnh vực này đã tồn tại trong danh sách');
      return;
    }

    const newCategory = {
      id: `cat_${Date.now()}`,
      name: newName.trim(),
      colorClass: newColor
    };

    const updated = [...cats, newCategory];
    setCats(updated);
    onSaveCategories(updated);
    setNewName('');
    setErrorMsg('');
  };

  const handleStartEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditColor(cat.colorClass || PRESET_STYLES[0].colorClass);
  };

  const handleSaveEdit = (id) => {
    if (!editName.trim()) return;
    const updated = cats.map(c => c.id === id ? { ...c, name: editName.trim(), colorClass: editColor } : c);
    setCats(updated);
    onSaveCategories(updated);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (cats.length <= 1) {
      alert('Hệ thống cần có ít nhất 1 lĩnh vực hoạt động!');
      return;
    }
    if (window.confirm('Bạn có chắc chắn muốn xóa lĩnh vực này? Các văn bản liên quan có thể cần phân loại lại.')) {
      const updated = cats.filter(c => c.id !== id);
      setCats(updated);
      onSaveCategories(updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#143e21] text-white px-6 py-4 flex items-center justify-between border-b border-[#286f3b]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-lime-500/20 rounded-lg text-lime-300">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Quản Lý Danh Mục Lĩnh Vực</h2>
              <p className="text-xs text-slate-400">Thêm, sửa, xóa các lĩnh vực quản lý chuyên đề</p>
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

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Add Category Form */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-600" /> Thêm Lĩnh Vực Mới
            </h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên lĩnh vực <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: An ninh mạng, Vũ khí - VLN..."
                  value={newName}
                  onChange={(e) => { setNewName(e.target.value); setErrorMsg(''); }}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {errorMsg && <p className="text-xs text-red-500 mt-1">{errorMsg}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Màu sắc Thẻ (Badge tương phản cao, nền dịu text nét)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_STYLES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewColor(preset.colorClass)}
                      className={`text-[11px] px-2 py-1.5 rounded-md border text-center transition-all ${preset.colorClass} ${
                        newColor === preset.colorClass ? 'ring-2 ring-slate-900 shadow-xs' : 'opacity-80 hover:opacity-100'
                      }`}
                    >
                      {preset.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Thêm Lĩnh Vực
                </button>
              </div>
            </form>
          </div>

          {/* Current Categories List */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Danh sách lĩnh vực hiện tại ({cats.length})
            </h3>
            <div className="space-y-2">
              {cats.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors"
                >
                  {editingId === cat.id ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-2.5 py-1 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 flex-1"
                      />
                      <select
                        value={editColor}
                        onChange={(e) => setEditColor(e.target.value)}
                        className="text-xs border rounded-lg p-1.5"
                      >
                        {PRESET_STYLES.map((p, i) => (
                          <option key={i} value={p.colorClass}>{p.label}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(cat.id)}
                        className="p-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                        title="Lưu"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="p-1.5 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300"
                        title="Hủy"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2.5 py-1 text-xs rounded-md border ${cat.colorClass || 'bg-blue-100 text-blue-900 border-blue-300 font-semibold'}`}>
                          {cat.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(cat)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Sửa tên hoặc màu"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Xóa lĩnh vực"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-sm"
          >
            Đóng lại
          </button>
        </div>
      </div>
    </div>
  );
}
