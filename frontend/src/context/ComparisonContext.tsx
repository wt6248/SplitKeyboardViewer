import React, { createContext, useContext, useState } from 'react';
import type {  ReactNode } from 'react';
import type { Keyboard } from '../types/keyboard';

interface ComparisonContextType {
  selectedIds: number[];
  selectedKeyboards: Keyboard[];
  isModalOpen: boolean;
  toggleSelection: (keyboard: Keyboard) => void;
  clearSelection: () => void;
  openModal: () => void;
  closeModal: () => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const ComparisonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedKeyboards, setSelectedKeyboards] = useState<Keyboard[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedIds = selectedKeyboards.map(kb => kb.id);

  const toggleSelection = (keyboard: Keyboard) => {
    setSelectedKeyboards(prev => {
      const isSelected = prev.some(kb => kb.id === keyboard.id);

      if (isSelected) {
        // Remove from selection
        return prev.filter(kb => kb.id !== keyboard.id);
      } else {
        // Add to selection (max 2)
        if (prev.length >= 2) {
          alert('최대 2개까지 선택 가능합니다');
          return prev;
        }
        return [...prev, keyboard];
      }
    });
  };

  const clearSelection = () => {
    setSelectedKeyboards([]);
    setIsModalOpen(false);
  };

  const openModal = () => {
    if (selectedKeyboards.length === 2) {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <ComparisonContext.Provider
      value={{
        selectedIds,
        selectedKeyboards,
        isModalOpen,
        toggleSelection,
        clearSelection,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};
