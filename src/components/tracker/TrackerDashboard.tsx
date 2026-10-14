import React, { useState, useEffect } from 'react';
import { 
  SavedJobApplication, 
  JobApplicationStatus, 
  MockInterviewSession, 
  UserCareerProfile, 
  InterviewQuestion 
} from '../../types';
import { ApplicationsDashboard } from '../applications/ApplicationsDashboard';
import { ApplicationDetailView } from '../applications/ApplicationDetailView';

interface TrackerDashboardProps {
  wishlist?: SavedJobApplication[];
  onUpdateJobStatus?: (id: string, status: JobApplicationStatus) => void;
  onUpdateJobNotes?: (id: string, notes: string) => void;
  onRemoveJob?: (id: string) => void;
  onStartPracticeForJob?: (job: SavedJobApplication['job']) => void;
  sessions?: MockInterviewSession[];
  onReviewSession?: (session: MockInterviewSession) => void;
  bookmarkedQuestionIds?: string[];
  onPracticeQuestion?: (question: InterviewQuestion) => void;
  profile?: UserCareerProfile;
  onUpdateProfile?: (updates: Partial<UserCareerProfile>) => void;
  initialSelectedApplicationId?: string | null;
  onClearSelectedApplication?: () => void;
}

export const TrackerDashboard: React.FC<TrackerDashboardProps> = ({
  initialSelectedApplicationId,
  onClearSelectedApplication,
}) => {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(
    initialSelectedApplicationId || null
  );

  useEffect(() => {
    if (initialSelectedApplicationId) {
      setSelectedAppId(initialSelectedApplicationId);
    }
  }, [initialSelectedApplicationId]);

  const handleBack = () => {
    setSelectedAppId(null);
    if (onClearSelectedApplication) {
      onClearSelectedApplication();
    }
  };

  if (selectedAppId) {
    return (
      <ApplicationDetailView
        applicationId={selectedAppId}
        onBack={handleBack}
      />
    );
  }

  return (
    <ApplicationsDashboard
      onSelectApplication={(appId) => {
        setSelectedAppId(appId);
      }}
    />
  );
};
