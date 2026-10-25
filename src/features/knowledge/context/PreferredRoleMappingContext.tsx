import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { RoleBlueprint, UserCareerProfile, SectorDomain } from '../../../types';
import { RoleBlueprintService } from '../../../services/roleBlueprintService';
import { StorageService } from '../../../services/storageService';
import { CANONICAL_DOMAINS } from '../../../data/jobTaxonomies';
import { curatedBetaData } from '../../../services/curatedBetaData';

export interface PreferredRoleMappingContextType {
  preferredRoleBlueprintId: string;
  preferredRoleId: string;
  preferredRole: RoleBlueprint;
  availableRoleBlueprints: RoleBlueprint[];
  setPreferredRoleId: (roleId: string, syncToProfile?: boolean) => void;
  targetDomains: string[];
  activeTargetDomainIds: string[];
  activeDomain: string;
  setActiveDomain: (domain: string) => void;
  addTargetDomain: (domain: string) => void;
  removeTargetDomain: (domain: string) => void;
  setTargetDomains: (domains: string[]) => void;
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
  // 1. Available Role Blueprints dynamically loaded from RoleBlueprintService
  const [availableRoleBlueprints, setAvailableRoleBlueprints] = useState<RoleBlueprint[]>(() => {
    return RoleBlueprintService.getAllBlueprints(true);
  });

  // Keep blueprints reactive to any creations/deletions elsewhere in the app
  useEffect(() => {
    const handleRolesUpdated = () => {
      setAvailableRoleBlueprints(RoleBlueprintService.getAllBlueprints(true));
    };
    window.addEventListener('career_roles_updated', handleRolesUpdated);
    return () => window.removeEventListener('career_roles_updated', handleRolesUpdated);
  }, []);

  // 2. Initialize preferred role from profile targetRoleBlueprintId or targetTitle or targetRole
  const initialRole = useMemo(() => {
    if (profile?.targetRoleBlueprintId) {
      const found = availableRoleBlueprints.find(r => r.id === profile.targetRoleBlueprintId);
      if (found) return found;
    }
    if (profile?.targetTitle) {
      const foundByTitle = availableRoleBlueprints.find(r => 
        r.title.toLowerCase().trim() === profile.targetTitle?.toLowerCase().trim()
      );
      if (foundByTitle) return foundByTitle;
    }
    if (profile?.targetRole) {
      const foundByCategory = availableRoleBlueprints.find(r => r.category === profile.targetRole);
      if (foundByCategory) return foundByCategory;
    }
    // Default to Technical Product Manager or first role
    const tpm = availableRoleBlueprints.find(r => r.id === 'role-product-mgr');
    return tpm || availableRoleBlueprints[0];
  }, [profile?.targetRoleBlueprintId, profile?.targetTitle, profile?.targetRole, availableRoleBlueprints]);

  const [preferredRoleId, setPreferredRoleIdState] = useState<string>(initialRole?.id || 'role-product-mgr');
  const [isRolePickerOpen, setIsRolePickerOpen] = useState<boolean>(false);

  // Sync if profile.targetRoleBlueprintId changes from external actions
  useEffect(() => {
    if (profile?.targetRoleBlueprintId) {
      const exists = availableRoleBlueprints.find(r => r.id === profile.targetRoleBlueprintId);
      if (exists) {
        setPreferredRoleIdState(exists.id);
      }
    }
  }, [profile?.targetRoleBlueprintId, availableRoleBlueprints]);

  const preferredRole = useMemo(() => {
    return availableRoleBlueprints.find(r => r.id === preferredRoleId) || initialRole || availableRoleBlueprints[0];
  }, [preferredRoleId, initialRole, availableRoleBlueprints]);

  // 3. Multi-Select Target Domains state: synchronized with profile.targetIndustryDomains
  const profileDomains = useMemo(() => {
    if (curatedBetaData.isCuratedBetaActive()) {
      return curatedBetaData.getFeaturedDomains();
    }
    if (profile?.targetIndustryDomains && profile.targetIndustryDomains.length > 0) {
      return profile.targetIndustryDomains;
    }
    if (profile?.targetDomain) {
      return [profile.targetDomain];
    }
    return ['Enterprise SaaS', 'Fintech & Payments', 'AI & Machine Learning'];
  }, [profile?.targetIndustryDomains, profile?.targetDomain]);

  const [targetDomains, setTargetDomainsState] = useState<string[]>(profileDomains);
  const [activeDomain, setActiveDomain] = useState<string>(profileDomains[0] || 'Enterprise SaaS');

  useEffect(() => {
    setTargetDomainsState(profileDomains);
    if (!profileDomains.includes(activeDomain) && profileDomains.length > 0) {
      setActiveDomain(profileDomains[0]);
    }
  }, [profileDomains]);

  // 4. Update Preferred Role Blueprint (One active role)
  const setPreferredRoleId = useCallback((newRoleId: string, syncToProfile: boolean = true) => {
    setPreferredRoleIdState(newRoleId);
    const roleObj = availableRoleBlueprints.find(r => r.id === newRoleId);
    if (roleObj) {
      const profileUpdates: Partial<UserCareerProfile> = {
        targetRoleBlueprintId: roleObj.id,
        targetRole: roleObj.category,
        targetTitle: roleObj.title
      };
      if (syncToProfile) {
        StorageService.updateProfile(profileUpdates);
        if (onUpdateProfile) {
          onUpdateProfile(profileUpdates);
        }
      }
    }
  }, [availableRoleBlueprints, onUpdateProfile]);

  // 5. Add Domain (Immediately active, prevents duplicates)
  const addTargetDomain = useCallback((domain: string) => {
    setTargetDomainsState(prev => {
      if (prev.includes(domain)) return prev;
      const updated = [...prev, domain];
      const updates: Partial<UserCareerProfile> = {
        targetIndustryDomains: updated as SectorDomain[],
        targetDomain: updated[0] as SectorDomain
      };
      StorageService.updateProfile(updates);
      if (onUpdateProfile) {
        onUpdateProfile(updates);
      }
      return updated;
    });
  }, [onUpdateProfile]);

  // 6. Remove Domain (Click × icon removes from active context)
  const removeTargetDomain = useCallback((domain: string) => {
    setTargetDomainsState(prev => {
      const updated = prev.filter(d => d !== domain);
      const finalDomains = updated.length > 0 ? updated : ['Enterprise SaaS'];
      const updates: Partial<UserCareerProfile> = {
        targetIndustryDomains: finalDomains as SectorDomain[],
        targetDomain: finalDomains[0] as SectorDomain
      };
      StorageService.updateProfile(updates);
      if (onUpdateProfile) {
        onUpdateProfile(updates);
      }
      if (activeDomain === domain) {
        setActiveDomain(finalDomains[0]);
      }
      return finalDomains;
    });
  }, [onUpdateProfile, activeDomain]);

  // 7. Bulk set target domains
  const setTargetDomains = useCallback((domains: string[]) => {
    setTargetDomainsState(domains);
    const updates: Partial<UserCareerProfile> = {
      targetIndustryDomains: domains as SectorDomain[],
      targetDomain: domains[0] as SectorDomain
    };
    StorageService.updateProfile(updates);
    if (onUpdateProfile) {
      onUpdateProfile(updates);
    }
  }, [onUpdateProfile]);

  const value: PreferredRoleMappingContextType = {
    preferredRoleBlueprintId: preferredRoleId,
    preferredRoleId,
    preferredRole,
    availableRoleBlueprints,
    setPreferredRoleId,
    targetDomains,
    activeTargetDomainIds: targetDomains,
    activeDomain,
    setActiveDomain,
    addTargetDomain,
    removeTargetDomain,
    setTargetDomains,
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
