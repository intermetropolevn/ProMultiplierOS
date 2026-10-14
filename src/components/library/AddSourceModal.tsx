import React from 'react';
import { NormalizedSource, SourceFamily } from '../../features/sources/types';
import { UniversalSourceIngestionModal } from './UniversalSourceIngestionModal';

interface AddSourceModalProps {
  onClose: () => void;
  onSave: (source: NormalizedSource) => void;
  initialFamily?: SourceFamily;
}

export const AddSourceModal: React.FC<AddSourceModalProps> = ({
  onClose,
  onSave,
  initialFamily
}) => {
  return (
    <UniversalSourceIngestionModal
      onClose={onClose}
      onSaveSource={onSave}
      initialMethod="manual"
      initialFamily={initialFamily || 'learn'}
    />
  );
};
