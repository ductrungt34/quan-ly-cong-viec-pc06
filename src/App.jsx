import React, { useState } from 'react';
import Header from './components/Header';
import Module1Documents from './components/Module1Documents';
import Module2Tasks from './components/Module2Tasks';
import Dashboard from './components/Dashboard';
import CategoryManagerModal from './components/CategoryManagerModal';
import DocumentModal from './components/DocumentModal';
import DocumentResultModal from './components/DocumentResultModal';
import TaskModal from './components/TaskModal';
import TaskSubmissionModal from './components/TaskSubmissionModal';

import { OFFICERS } from './constants/officersData';
import { StorageService } from './services/storage';

export default function App() {
  const [currentUserId, setCurrentUserId] = useState(() => StorageService.getCurrentUserId());
  const currentUser = OFFICERS.find(o => o.id === currentUserId) || OFFICERS[0];

  const [activeTab, setActiveTab] = useState('documents');

  const [categories, setCategories] = useState(() => StorageService.getCategories());
  const [documents, setDocuments] = useState(() => StorageService.getDocuments());
  const [tasks, setTasks] = useState(() => StorageService.getTasks());

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);

  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [selectedDocForResult, setSelectedDocForResult] = useState(null);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [selectedTaskForSubmission, setSelectedTaskForSubmission] = useState(null);
  const [selectedOfficerIdForSubmission, setSelectedOfficerIdForSubmission] = useState(null);

  const handleSwitchUser = (officerId) => {
    setCurrentUserId(officerId);
    StorageService.saveCurrentUserId(officerId);
  };

  const handleSaveCategories = (newCategories) => {
    setCategories(newCategories);
    StorageService.saveCategories(newCategories);
  };

  const handleOpenAddDoc = () => {
    setEditingDoc(null);
    setIsDocModalOpen(true);
  };

  const handleOpenEditDoc = (doc) => {
    setEditingDoc(doc);
    setIsDocModalOpen(true);
  };

  const handleSaveDoc = (docData) => {
    let updated;
    const exists = documents.some(d => d.id === docData.id);
    if (exists) {
      updated = documents.map(d => d.id === docData.id ? { ...d, ...docData } : d);
    } else {
      const nextStt = documents.length + 1;
      updated = [{ ...docData, stt: nextStt }, ...documents];
    }
    setDocuments(updated);
    StorageService.saveDocuments(updated);
  };

  const handleDeleteDoc = (docId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa văn bản này khỏi bảng theo dõi?')) {
      const updated = documents.filter(d => d.id !== docId);
      setDocuments(updated);
      StorageService.saveDocuments(updated);
    }
  };

  const handleOpenResultModal = (doc) => {
    setSelectedDocForResult(doc);
    setIsResultModalOpen(true);
  };

  const handleSaveDocResult = (docId, resultData) => {
    const updated = documents.map(d => {
      if (d.id === docId) {
        return { ...d, ...resultData };
      }
      return d;
    });
    setDocuments(updated);
    StorageService.saveDocuments(updated);
  };

  const handleOpenAddTask = () => {
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskData) => {
    const updated = [taskData, ...tasks];
    setTasks(updated);
    StorageService.saveTasks(updated);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhiệm vụ đôn đốc này?')) {
      const updated = tasks.filter(t => t.id !== taskId);
      setTasks(updated);
      StorageService.saveTasks(updated);
    }
  };

  const handleOpenSubmissionModal = (task, officerId) => {
    setSelectedTaskForSubmission(task);
    setSelectedOfficerIdForSubmission(officerId);
    setIsSubmissionModalOpen(true);
  };

  const handleSaveSubmission = (taskId, officerId, submissionData) => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          submissions: {
            ...(t.submissions || {}),
            [officerId]: submissionData
          }
        };
      }
      return t;
    });
    setTasks(updated);
    StorageService.saveTasks(updated);
  };

  return (
    <div className="min-h-screen bg-[#f3f7f4] flex flex-col font-sans antialiased text-slate-800 w-full">
      {/* Header */}
      <Header
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
      />

      {/* Main Container - MỞ RỘNG TOÀN CHIỀU RỘNG MÀN HÌNH */}
      <main className="w-full px-2 sm:px-4 md:px-6 py-4 flex-1">
        {activeTab === 'dashboard' && (
          <Dashboard
            documents={documents}
            tasks={tasks}
            categories={categories}
            onSelectTab={setActiveTab}
          />
        )}

        {activeTab === 'documents' && (
          <Module1Documents
            documents={documents}
            categories={categories}
            currentUser={currentUser}
            onAddDocument={handleOpenAddDoc}
            onEditDocument={handleOpenEditDoc}
            onDeleteDocument={handleDeleteDoc}
            onOpenResultModal={handleOpenResultModal}
            onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
          />
        )}

        {activeTab === 'tasks' && (
          <Module2Tasks
            tasks={tasks}
            currentUser={currentUser}
            categories={categories}
            onAddTask={handleOpenAddTask}
            onOpenSubmissionModal={handleOpenSubmissionModal}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </main>

      {/* Footer - Ghi nhận Bản quyền: Đại úy Phạm Đức Trung */}
      <footer className="bg-white border-t border-emerald-200 py-3 text-center text-xs text-slate-600">
        <div className="w-full px-4 flex flex-col sm:flex-row items-center justify-between gap-1.5">
          <div className="text-[#143e21] font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Bản quyền: <strong>Đại úy Phạm Đức Trung - Cán bộ Đội 2 phòng PC06</strong></span>
          </div>
          <div className="text-slate-400 text-[11px]">
            Hệ thống Quản lý Văn bản & Đánh giá Đôn đốc Công an cấp xã • PC06 Công an TP Hải Phòng
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onSaveCategories={handleSaveCategories}
      />

      <DocumentModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        onSave={handleSaveDoc}
        editingDoc={editingDoc}
        categories={categories}
        currentUser={currentUser}
      />

      <DocumentResultModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        onSaveResult={handleSaveDocResult}
        document={selectedDocForResult}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        categories={categories}
        currentUser={currentUser}
      />

      <TaskSubmissionModal
        isOpen={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
        onSaveSubmission={handleSaveSubmission}
        task={selectedTaskForSubmission}
        officerId={selectedOfficerIdForSubmission}
      />
    </div>
  );
}
