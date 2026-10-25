/**
 * CareerOS / ProMultiplier OS — Beta Baseline Configuration
 * Centralized Access Level and Data Exposure matrix for Beta preparation.
 *
 * NOTE: This file establishes architectural preparation for beta-access tiers
 * without modifying current runtime behavior (defaults to FULL access).
 */

export enum ACCESS_LEVEL {
  PUBLIC = 'PUBLIC',       // Anonymous visitor / Unauthenticated exploration
  GUEST = 'GUEST',         // Temporary guest session / Preview sandbox
  DEMO = 'DEMO',           // Guided demonstration mode with sample telemetry
  FULL = 'FULL'            // Full authenticated practitioner & admin access
}

export type AccessLevel = keyof typeof ACCESS_LEVEL;

export enum DATA_EXPOSURE {
  PUBLIC = 'PUBLIC',             // Open schemas, public job feeds, high-level summaries
  CURATED = 'CURATED',           // Sanitized cases, selected role blueprints, standard templates
  INTELLIGENCE = 'INTELLIGENCE'  // Proprietary rubrics, live copilots, crawler pipelines, deep graphs
}

export type DataExposureTier = keyof typeof DATA_EXPOSURE;

/**
 * All recognized top-level and auxiliary modules in Career OS
 */
export type CareerOsParentModule = 
  | 'profile'
  | 'discover'
  | 'tracker'
  | 'builder_match'
  | 'knowledge'
  | 'practice'
  | 'business_english'
  | 'platform_admin';

/**
 * Access tier requirements per module for upcoming beta tiers
 */
export interface ModuleAccessRule {
  moduleId: CareerOsParentModule;
  label: string;
  minRequiredAccess: ACCESS_LEVEL;
  defaultDataExposure: DATA_EXPOSURE;
  description: string;
}

/**
 * Beta Baseline Module Access Matrix
 */
export const MODULE_ACCESS_MATRIX: Record<CareerOsParentModule, ModuleAccessRule> = {
  profile: {
    moduleId: 'profile',
    label: 'My Profile & Career OS Dashboard',
    minRequiredAccess: ACCESS_LEVEL.GUEST,
    defaultDataExposure: DATA_EXPOSURE.CURATED,
    description: 'Personal career records, work experience, storybank, and readiness checklist.'
  },
  discover: {
    moduleId: 'discover',
    label: 'Job Opportunity & Radar',
    minRequiredAccess: ACCESS_LEVEL.PUBLIC,
    defaultDataExposure: DATA_EXPOSURE.PUBLIC,
    description: 'Market job explorer, role taxonomy, company signals, and application saves.'
  },
  tracker: {
    moduleId: 'tracker',
    label: 'Participation Tracker',
    minRequiredAccess: ACCESS_LEVEL.GUEST,
    defaultDataExposure: DATA_EXPOSURE.CURATED,
    description: 'Application pipeline board, interview milestones, and take-home assignments.'
  },
  builder_match: {
    moduleId: 'builder_match',
    label: 'Builder Match Network',
    minRequiredAccess: ACCESS_LEVEL.GUEST,
    defaultDataExposure: DATA_EXPOSURE.CURATED,
    description: 'Collaborative product builders, project blueprints, and team invites.'
  },
  knowledge: {
    moduleId: 'knowledge',
    label: 'Knowledge System & Intelligence',
    minRequiredAccess: ACCESS_LEVEL.GUEST,
    defaultDataExposure: DATA_EXPOSURE.INTELLIGENCE,
    description: 'Role leveling, evidence graphs, preferred role mapping, and civic/innovation systems.'
  },
  practice: {
    moduleId: 'practice',
    label: 'Interview Practice & Live Copilot',
    minRequiredAccess: ACCESS_LEVEL.DEMO,
    defaultDataExposure: DATA_EXPOSURE.INTELLIGENCE,
    description: 'Live interview sparring, multimodal speech transcription, and evaluation rubrics.'
  },
  business_english: {
    moduleId: 'business_english',
    label: 'Business English & Workplace Studio',
    minRequiredAccess: ACCESS_LEVEL.GUEST,
    defaultDataExposure: DATA_EXPOSURE.CURATED,
    description: 'Role-play simulations, shadow speaking, domain glossaries, and mascot coach.'
  },
  platform_admin: {
    moduleId: 'platform_admin',
    label: 'Platform Administration & Crawlers',
    minRequiredAccess: ACCESS_LEVEL.FULL,
    defaultDataExposure: DATA_EXPOSURE.INTELLIGENCE,
    description: 'Crawler engine, import queues, sanitization rules, and core audit logs.'
  }
};

/**
 * Data Collections and their classified exposure tiers
 */
export const DATA_COLLECTION_EXPOSURE: Record<string, {
  entityName: string;
  exposureTier: DATA_EXPOSURE;
  containsProprietaryRubric: boolean;
  notes: string;
}> = {
  jobsData: {
    entityName: 'Job Listings',
    exposureTier: DATA_EXPOSURE.PUBLIC,
    containsProprietaryRubric: false,
    notes: 'Aggregated public job descriptions, taxonomies, and basic requirements'
  },
  rolesData: {
    entityName: 'Role Blueprints',
    exposureTier: DATA_EXPOSURE.CURATED,
    containsProprietaryRubric: false,
    notes: 'Standardized industry roles, leveling ladders, and competency profiles'
  },
  questionsData: {
    entityName: 'Interview Questions & Model Answers',
    exposureTier: DATA_EXPOSURE.INTELLIGENCE,
    containsProprietaryRubric: true,
    notes: 'Proprietary grading rubrics, red flag triggers, and exemplary model answers'
  },
  evidenceIntelligence: {
    entityName: 'Career Evidence Graph',
    exposureTier: DATA_EXPOSURE.INTELLIGENCE,
    containsProprietaryRubric: true,
    notes: 'Cryptographic proof, verification edges, and capability activation weights'
  },
  builderMatchData: {
    entityName: 'Builder Profiles & Teams',
    exposureTier: DATA_EXPOSURE.CURATED,
    containsProprietaryRubric: false,
    notes: 'Peer builder directory and collaborative project blueprints'
  },
  crawlerPipeline: {
    entityName: 'Crawler & Source Ingestion Engine',
    exposureTier: DATA_EXPOSURE.INTELLIGENCE,
    containsProprietaryRubric: true,
    notes: 'SSRF validation, internal source configs, crawl jobs, and unapproved queue items'
  },
  expertFeedback: {
    entityName: 'Expert Review Network',
    exposureTier: DATA_EXPOSURE.CURATED,
    containsProprietaryRubric: false,
    notes: 'Practitioner profiles, feedback request dispatch, and review threads'
  },
  businessEnglishData: {
    entityName: 'Business Communication Patterns',
    exposureTier: DATA_EXPOSURE.CURATED,
    containsProprietaryRubric: false,
    notes: 'Domain vocabularies, role-play scripts, and pronunciation guides'
  }
};

import { AccessControlService, BetaAccessLevel } from '../services/accessControlService';

/**
 * Baseline Configuration Singleton (Delegates to centralized AccessControlService)
 */
class CareerOsBaselineManager {
  private readonly baselineVersion = '1.0.0-beta-baseline';

  /**
   * Get the active access level for the current session
   */
  public getAccessLevel(): ACCESS_LEVEL {
    return AccessControlService.getAccessLevel() as ACCESS_LEVEL;
  }

  /**
   * Set access level (used for testing beta access switches)
   */
  public setAccessLevel(level: ACCESS_LEVEL): void {
    AccessControlService.setAccessLevel(level as BetaAccessLevel);
  }

  /**
   * Check if a given module is accessible under the current access level
   */
  public canAccessModule(moduleId: CareerOsParentModule): boolean {
    const currentAccess = this.getAccessLevel();
    const rule = MODULE_ACCESS_MATRIX[moduleId];
    if (!rule) return true;

    // Full access always grants access
    if (currentAccess === ACCESS_LEVEL.FULL) return true;

    const accessRank: Record<ACCESS_LEVEL, number> = {
      [ACCESS_LEVEL.PUBLIC]: 0,
      [ACCESS_LEVEL.GUEST]: 1,
      [ACCESS_LEVEL.DEMO]: 2,
      [ACCESS_LEVEL.FULL]: 3
    };

    return accessRank[currentAccess] >= accessRank[rule.minRequiredAccess];
  }

  /**
   * Determine if a given data exposure tier is accessible
   */
  public canViewDataTier(tier: DATA_EXPOSURE): boolean {
    const currentAccess = this.getAccessLevel();
    if (currentAccess === ACCESS_LEVEL.FULL) return true;

    if (tier === DATA_EXPOSURE.PUBLIC) return true;
    if (tier === DATA_EXPOSURE.CURATED) {
      return currentAccess === ACCESS_LEVEL.GUEST || 
             currentAccess === ACCESS_LEVEL.DEMO;
    }
    if (tier === DATA_EXPOSURE.INTELLIGENCE) {
      return currentAccess === ACCESS_LEVEL.DEMO;
    }

    return false;
  }

  /**
   * Helper to query baseline version
   */
  public getBaselineVersion(): string {
    return this.baselineVersion;
  }
}

export const CareerOsBaseline = new CareerOsBaselineManager();

