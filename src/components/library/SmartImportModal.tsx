import React from 'react';
import { NormalizedSource } from '../../features/sources/types';
import { UniversalSourceIngestionModal } from './UniversalSourceIngestionModal';

interface SmartImportModalProps {
  onClose: () => void;
  onConfirmImport: (source: NormalizedSource) => void;
}

export const SmartImportModal: React.FC<SmartImportModalProps> = ({
  onClose,
  onConfirmImport
}) => {
  return (
    <UniversalSourceIngestionModal
      onClose={onClose}
      onSaveSource={onConfirmImport}
      initialMethod="text"
    />
  );
};
