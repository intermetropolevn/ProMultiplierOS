import React from 'react';
import { GetExpertFeedbackModal } from './GetExpertFeedbackModal';

interface FeedbackWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string | null;
  onNavigateToBuilderMatch?: () => void;
  onNavigateToKnowledge?: () => void;
  onAddToCareerEvidence?: (evidenceData: any) => void;
}

/**
 * Canonical Career Feedback Workspace adapter.
 * Delegates directly to the unified GetExpertFeedbackModal so CareerOS maintains
 * a single shared feedback implementation across the entire platform.
 */
export const FeedbackWorkspaceModal: React.FC<FeedbackWorkspaceModalProps> = ({
  isOpen,
  onClose,
  requestId,
  onNavigateToBuilderMatch,
  onNavigateToKnowledge,
  onAddToCareerEvidence
}) => {
  return (
    <GetExpertFeedbackModal
      isOpen={isOpen}
      onClose={onClose}
      initialSessionId={requestId}
      initialStep="feedback_result"
      onNavigateToBuilderMatch={onNavigateToBuilderMatch}
      onNavigateToKnowledge={onNavigateToKnowledge}
      onAddToCareerEvidence={onAddToCareerEvidence}
    />
  );
};
