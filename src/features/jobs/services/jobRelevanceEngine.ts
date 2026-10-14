import { JobListing, UserCareerProfile, ExperienceLevel } from '../../../types';
import { SkillService } from '../../../services/skillService';
import { sourceStore } from '../../sources/services/sourceStore';
import { CanonicalSkillRegistry } from '../../intelligence/services/canonicalSkillRegistry';
import { getDeadlineInfo } from '../../../data/jobTaxonomies';

export interface JobRelevanceReport {
  jobId: string;
  relevanceScore: number; // 0 - 100
  ratingTier: 'Top Match' | 'Strong Fit' | 'Moderate Fit' | 'Emerging Fit';
  tierColor: string;
  matchReasons: string[];
  matchedSkills: string[];
  missingSkills: string[];
  skillsCoveragePercent: number;
  roleMatch: boolean;
  domainMatch: boolean;
  levelMatch: boolean;
  deadlineInfo: ReturnType<typeof getDeadlineInfo>;
}

// Seniority rungs for adjacent level distance calculation
const LEVEL_RUNGS: ExperienceLevel[] = [
  'Intern / Fresh Grad',
  'Junior',
  'Mid-Level',
  'Senior',
  'Lead / Staff',
  'Principal / Fellow',
  'Manager / Director',
  'Executive / C-Suite',
];

export class JobRelevanceEngine {
  /**
   * Evaluate a single job against user profile and verified evidence
   */
  public static evaluateJob(job: JobListing, profile: UserCareerProfile): JobRelevanceReport {
    let score = 0;
    const matchReasons: string[] = [];

    // 1. Role Alignment (Max 30 pts)
    const roleMatch = job.roleCategory === profile.targetRole;
    if (roleMatch) {
      score += 30;
      matchReasons.push(`Target Role: ${job.roleCategory}`);
    } else {
      // Related disciplines
      const isRelated = 
        (profile.targetRole === 'Software Engineering' && (job.roleCategory === 'DevOps & Cloud' || job.roleCategory === 'Data & Machine Learning')) ||
        (profile.targetRole === 'Product Management' && (job.roleCategory === 'Program & Project Management' || job.roleCategory === 'Business Analysis & Strategy')) ||
        (profile.targetRole === 'Data & Machine Learning' && job.roleCategory === 'Data Analytics & BI');

      if (isRelated) {
        score += 16;
        matchReasons.push(`Adjacent Discipline: ${job.roleCategory}`);
      } else {
        score += 6;
      }
    }

    // 2. Domain Alignment (Max 20 pts)
    const domainMatch = job.domain === profile.targetDomain;
    if (domainMatch) {
      score += 20;
      matchReasons.push(`Target Domain: ${job.domain}`);
    } else {
      score += 8;
    }

    // 3. Seniority Level Alignment (Max 15 pts)
    const targetIdx = LEVEL_RUNGS.indexOf(profile.targetLevel);
    const jobIdx = LEVEL_RUNGS.indexOf(job.level);
    const levelDistance = targetIdx >= 0 && jobIdx >= 0 ? Math.abs(targetIdx - jobIdx) : 1;
    const levelMatch = levelDistance === 0;

    if (levelMatch) {
      score += 15;
      matchReasons.push(`${job.level} Seniority`);
    } else if (levelDistance === 1) {
      score += 10;
      matchReasons.push(`Adjacent Level (${job.level})`);
    } else {
      score += 4;
    }

    // 4. Skills & Verified Evidence Alignment (Max 25 pts)
    const userSkills = SkillService.getSkills();
    const verifiedSources = sourceStore.getSkillEvidenceProfiles();
    const reqSkills = job.requiredSkills || [];
    const niceSkills = job.niceToHaveSkills || [];
    const allJobSkills = [...reqSkills, ...niceSkills];

    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    allJobSkills.forEach(jobSkill => {
      const canonical = CanonicalSkillRegistry.resolve(jobSkill);
      const isUserMatch = userSkills.some(us => 
        us.name.toLowerCase() === jobSkill.toLowerCase() ||
        us.name.toLowerCase().includes(jobSkill.toLowerCase()) ||
        jobSkill.toLowerCase().includes(us.name.toLowerCase()) ||
        CanonicalSkillRegistry.resolve(us.name).canonicalId === canonical.canonicalId
      );

      const hasEvidence = verifiedSources.some(vs =>
        vs.skillName.toLowerCase().includes(jobSkill.toLowerCase()) ||
        jobSkill.toLowerCase().includes(vs.skillName.toLowerCase()) ||
        vs.canonicalSkillId === canonical.canonicalId
      );

      if (isUserMatch || hasEvidence) {
        matchedSkills.push(jobSkill);
      } else {
        missingSkills.push(jobSkill);
      }
    });

    const totalExpected = allJobSkills.length || 1;
    const skillRatio = Math.min(1, matchedSkills.length / totalExpected);
    const skillPoints = Math.round(skillRatio * 25);
    score += skillPoints;

    const skillsCoveragePercent = Math.round(skillRatio * 100);
    if (matchedSkills.length > 0) {
      matchReasons.push(`${matchedSkills.length} Skills Verified`);
    }

    // 5. Work Mode & Location (Max 10 pts)
    if (job.workMode === 'Remote') {
      score += 10;
      matchReasons.push('Remote Flexibility');
    } else if (job.workMode === 'Hybrid') {
      score += 8;
    } else {
      score += 6;
    }

    // Cap score at 99
    const finalScore = Math.min(99, Math.max(25, score));

    // Determine Tier
    let ratingTier: 'Top Match' | 'Strong Fit' | 'Moderate Fit' | 'Emerging Fit';
    let tierColor: string;

    if (finalScore >= 85) {
      ratingTier = 'Top Match';
      tierColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    } else if (finalScore >= 72) {
      ratingTier = 'Strong Fit';
      tierColor = 'bg-blue-50 text-blue-700 border-blue-200';
    } else if (finalScore >= 55) {
      ratingTier = 'Moderate Fit';
      tierColor = 'bg-amber-50 text-amber-700 border-amber-200';
    } else {
      ratingTier = 'Emerging Fit';
      tierColor = 'bg-slate-50 text-slate-600 border-slate-200';
    }

    const deadlineInfo = getDeadlineInfo(job.applicationDeadline);

    return {
      jobId: job.id,
      relevanceScore: finalScore,
      ratingTier,
      tierColor,
      matchReasons: matchReasons.slice(0, 4),
      matchedSkills,
      missingSkills,
      skillsCoveragePercent,
      roleMatch,
      domainMatch,
      levelMatch,
      deadlineInfo,
    };
  }

  /**
   * Evaluate all jobs and rank top matches
   */
  public static rankTopMatches(
    jobs: JobListing[],
    profile: UserCareerProfile,
    limit: number = 3
  ): { job: JobListing; report: JobRelevanceReport }[] {
    const scored = jobs.map(job => ({
      job,
      report: this.evaluateJob(job, profile),
    }));

    // Sort by relevanceScore descending
    scored.sort((a, b) => b.report.relevanceScore - a.report.relevanceScore);

    return scored.slice(0, limit);
  }
}
