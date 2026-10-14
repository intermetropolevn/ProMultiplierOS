import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { RoleBlueprint, UserCareerProfile, SectorDomain } from '../../../types';
import { ROLES_DATA } from '../../../data/rolesData';
import { CANONICAL_DOMAINS } from '../../../data/jobTaxonomies';

export interface PreferredRoleMappingContextType {
  preferredRoleId: string;
  preferredRole: RoleBlueprint;
  setPreferredRoleId: (roleId: string, syncToProfile?: boolean) => void;
  targetDomains: string[];
  activeDomain: string;
  setActiveDomain: (domain: string) => void;
  addTargetDomain: (domain: string) => void;
  removeTargetDomain: (domain: string) => void;
  isRolePickerOpen: boolean;
  setIsRolePickerOpen: (open: boolean) => void;
  profile?: UserCareerProfile;
  onUpdateProfile?: (updates: Partial<UserCareerProfile>) => void;
}

const PreferredRoleMappingContext = createContext<PreferredRoleMappingContextType | undefined>(undefined);

interface PreferredRoleMappingProviderProps {
  children: React.ReactNode;
  profile?: UserCareerProfile;
  onUpdateProfile?: (updates: Partial<UserCareerProfile>) => void;
}

export const PreferredRoleMappingProvider: React.FC<PreferredRoleMappingProviderProps> = ({
  children,
  profile,
  onUpdateProfile
}) => {
  // Initialize preferred role from profile targetRoleBlueprintId or targetRole title matching
  const initialRole = useMemo(() => {
    if (profile?.targetRoleBlueprintId) {
      const found = ROLES_DATA.find(r => r.id === profile.targetRoleBlueprintId);
      if (found) return found;
    }
    if (profile?.targetRole) {
      const foundByCategory = ROLES_DATA.find(r => r.category === profile.targetRole);
      if (foundByCategory) return foundByCategory;
    }
    // Default to Senior Platform PO or first role
    const platformPo = ROLES_DATA.find(r => r.id === 'role-platform-po');
    return platformPo || ROLES_DATA[0];
  }, [profile?.targetRoleBlueprintId, profile?.targetRole]);

  const [preferredRoleId, setPreferredRoleIdState] = useState<string>(initialRole.id);
  const [isRolePickerOpen, setIsRolePickerOpen] = useState<boolean>(false);

  // Sync if profile changes from external actions
  useEffect(() => {
    if (profile?.targetRoleBlueprintId) {
      const exists = ROLES_DATA.find(r => r.id === profile.targetRoleBlueprintId);
      if (exists) setPreferredRoleIdState(exists.id);
    }
  }, [profile?.targetRoleBlueprintId]);

  const preferredRole = useMemo(() => {
    return ROLES_DATA.find(r => r.id === preferredRoleId) || initialRole || ROLES_DATA[0];
  }, [preferredRoleId, initialRole]);

  // Target domains state: synchronized from profile.targetIndustryDomains
  const profileDomains = useMemo(() => {
    if (profile?.targetIndustryDomains && profile.targetIndustryDomains.length > 0) {
      return profile.targetIndustryDomains;
    }
    if (profile?.targetDomain) {
      return [profile.targetDomain];
    }
    return ['Enterprise SaaS', 'Fintech & Payments'];
  }, [profile?.targetIndustryDomains, profile?.targetDomain]);

  const [targetDomains, setTargetDomains] = useState<string[]>(profileDomains);
  const [activeDomain, setActiveDomain] = useState<string>(profileDomains[0] || 'Enterprise SaaS');

  useEffect(() => {
    setTargetDomains(profileDomains);
    if (!profileDomains.includes(activeDomain)) {
      setActiveDomain(profileDomains[0] || 'Enterprise SaaS');
    }
  }, [profileDomains]);

  const setPreferredRoleId = (newRoleId: string, syncToProfile: boolean = false) => {
    setPreferredRoleIdState(newRoleId);
    if (syncToProfile && onUpdateProfile) {
      const roleObj = ROLES_DATA.find(r => r.id === newRoleId);
      if (roleObj) {
        onUpdateProfile({
          targetRoleBlueprintId: roleObj.id,
          targetRole: roleObj.category,
          targetTitle: roleObj.title
        });
      }
    }
  };

  const addTargetDomain = (domain: string) => {
    if (!targetDomains.includes(domain)) {
      const updated = [...targetDomains, domain];
      setTargetDomains(updated);
      if (onUpdateProfile) {
        onUpdateProfile({
          targetIndustryDomains: updated as SectorDomain[],
          targetDomain: updated[0] as SectorDomain
        });
      }
    }
  };

  const removeTargetDomain = (domain: string) => {
    if (targetDomains.length <= 1) return; // Keep at least one target domain
    const updated = targetDomains.filter(d => d !== domain);
    setTargetDomains(updated);
    if (activeDomain === domain) {
      setActiveDomain(updated[0]);
    }
    if (onUpdateProfile) {
      onUpdateProfile({
        targetIndustryDomains: updated as SectorDomain[],
        targetDomain: updated[0] as SectorDomain
      });
    }
  };

  const value: PreferredRoleMappingContextType = {
    preferredRoleId,
    preferredRole,
    setPreferredRoleId,
    targetDomains,
    activeDomain,
    setActiveDomain,
    addTargetDomain,
    removeTargetDomain,
    isRolePickerOpen,
    setIsRolePickerOpen,
    profile,
    onUpdateProfile
  };

  return (
    <PreferredRoleMappingContext.Provider value={value}>
      {children}
    </PreferredRoleMappingContext.Provider>
  );
};

export const usePreferredRoleMappingContext = () => {
  const context = useContext(PreferredRoleMappingContext);
  if (!context) {
    throw new Error('usePreferredRoleMappingContext must be used within a PreferredRoleMappingProvider');
  }
  return context;
};
