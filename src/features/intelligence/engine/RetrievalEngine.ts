// =========================================================================
// CAREER INTELLIGENCE ENGINE - RETRIEVAL ENGINE
// =========================================================================

import { JOBS_DATA } from '../../../data/jobsData';
import { ROLES_DATA } from '../../../data/rolesData';
import { CASES_DATA } from '../../../data/casesData';
import { QUESTIONS_DATA } from '../../../data/questionsData';
import { KNOWLEDGE_UNITS_DATA } from '../../../data/knowledgeUnitsData';
import { RESEARCH_PAPERS_DATA } from '../../../data/researchPapersData';
import { BOOKS_DATA } from '../../../data/booksData';
import { DOMAINS_DATA } from '../../../data/domainsData';
import { WORKFLOWS_DATA } from '../../../data/workflowsData';
import { CanonicalOntology } from '../services/canonicalOntology';
import { VietnameseNormalizer } from '../services/vietnameseNormalizer';
import { StorageService } from '../../../services/storageService';

export interface RetrievedEntityItem {
  id: string;
  type: 'job' | 'role' | 'case' | 'question' | 'knowledge' | 'paper' | 'book' | 'source' | 'domain' | 'workflow';
  title: string;
  subtitle?: string;
  content: string;
  relevanceScore: number; // 0.0 - 1.0
  tags: string[];
  sourceUrl?: string;
}

export class RetrievalEngine {
  /**
   * Search across all internal Career OS structured data stores
   */
  public static retrieveRelevantEntities(
    query: string, 
    limit: number = 6, 
    entityTypeFilter?: string[]
  ): RetrievedEntityItem[] {
    const rawTrimmed = (query || '').trim();
    if (!rawTrimmed) return [];

    const normQuery = VietnameseNormalizer.normalizeText(rawTrimmed).toLowerCase();
    const queryTokens = normQuery.split(/\s+/).filter(t => t.length > 2);

    // Map concepts via canonical ontology
    const detectedCanonical = CanonicalOntology.findMatchingEntities(rawTrimmed);
    const conceptTerms = detectedCanonical.flatMap(e => [
      e.canonicalName.toLowerCase(),
      ...e.aliases.map(a => a.toLowerCase()),
      ...e.vietnameseAliases.map(va => VietnameseNormalizer.normalizeText(va).toLowerCase())
    ]);

    const results: RetrievedEntityItem[] = [];

    // Helper scorer
    const scoreText = (text: string, title: string, tags: string[] = []): number => {
      let score = 0;
      const normText = VietnameseNormalizer.normalizeText(text).toLowerCase();
      const normTitle = VietnameseNormalizer.normalizeText(title).toLowerCase();

      // Exact phrase match
      if (normTitle.includes(normQuery)) score += 0.55;
      if (normText.includes(normQuery)) score += 0.35;

      // Token matches
      queryTokens.forEach(token => {
        if (normTitle.includes(token)) score += 0.20;
        else if (normText.includes(token)) score += 0.08;
      });

      // Canonical concept match
      conceptTerms.forEach(concept => {
        if (normTitle.includes(concept)) score += 0.30;
        if (normText.includes(concept)) score += 0.15;
      });

      // Tag matches
      tags.forEach(t => {
        const normTag = VietnameseNormalizer.normalizeText(t).toLowerCase();
        if (queryTokens.some(tok => normTag.includes(tok))) score += 0.15;
      });

      return Math.min(1.0, score);
    };

    // 1. Jobs
    if (!entityTypeFilter || entityTypeFilter.includes('job')) {
      JOBS_DATA.forEach(job => {
        const score = scoreText(
          `${job.description} ${job.requiredSkills.join(' ')} ${job.company}`, 
          job.title, 
          job.requiredSkills
        );
        if (score > 0.2) {
          results.push({
            id: job.id,
            type: 'job',
            title: `${job.title} at ${job.company}`,
            subtitle: `${job.domain} • ${job.level} • ${job.salaryRange}`,
            content: `Description: ${job.description.slice(0, 200)}... Required Skills: ${job.requiredSkills.join(', ')}`,
            relevanceScore: score,
            tags: job.requiredSkills,
            sourceUrl: job.externalUrl,
          });
        }
      });
    }

    // 2. Roles
    if (!entityTypeFilter || entityTypeFilter.includes('role')) {
      ROLES_DATA.forEach(role => {
        const score = scoreText(`${role.overview} ${role.tagline}`, role.title, role.primaryTechStack);
        if (score > 0.2) {
          results.push({
            id: role.id,
            type: 'role',
            title: role.title,
            subtitle: `${role.category} • ${role.level}`,
            content: role.overview,
            relevanceScore: score,
            tags: role.primaryTechStack || [],
          });
        }
      });
    }

    // 3. Cases
    if (!entityTypeFilter || entityTypeFilter.includes('case')) {
      CASES_DATA.forEach(c => {
        const score = scoreText(
          `${c.backgroundScenario} ${c.theCoreConflict} ${c.recommendedResolution}`, 
          c.title, 
          [c.companyType, c.sector]
        );
        if (score > 0.2) {
          results.push({
            id: c.id,
            type: 'case',
            title: c.title,
            subtitle: `${c.companyType} • ${c.sector} • ${c.difficulty}`,
            content: `Core Conflict: ${c.theCoreConflict} Resolution: ${c.recommendedResolution.slice(0, 180)}...`,
            relevanceScore: score,
            tags: [c.companyType, c.sector, c.difficulty],
          });
        }
      });
    }

    // 4. Questions
    if (!entityTypeFilter || entityTypeFilter.includes('question')) {
      QUESTIONS_DATA.forEach(q => {
        const score = scoreText(
          `${q.context} ${q.exemplaryModelAnswer} ${q.keywordsToMention.join(' ')}`, 
          q.question, 
          q.keywordsToMention
        );
        if (score > 0.2) {
          results.push({
            id: q.id,
            type: 'question',
            title: q.question,
            subtitle: `${q.type} • ${q.roleCategory} • ${q.domain}`,
            content: `Model Answer excerpt: ${q.exemplaryModelAnswer.slice(0, 180)}... Keywords: ${q.keywordsToMention.join(', ')}`,
            relevanceScore: score,
            tags: q.keywordsToMention,
          });
        }
      });
    }

    // 5. Knowledge Units
    if (!entityTypeFilter || entityTypeFilter.includes('knowledge')) {
      KNOWLEDGE_UNITS_DATA.forEach(ku => {
        const textContent = `${ku.summary} ${ku.officialDefinition || ''} ${ku.careerosInterpretation || ''}`;
        const score = scoreText(textContent, ku.title, [ku.domain, ku.subdomain || '']);
        if (score > 0.2) {
          results.push({
            id: ku.id,
            type: 'knowledge',
            title: ku.title,
            subtitle: `${ku.domain} • ${ku.subdomain || 'Core Principle'}`,
            content: ku.summary,
            relevanceScore: score,
            tags: [ku.domain, ...(ku.skills || [])],
          });
        }
      });
    }

    // 6. User Verified Application Ledger
    try {
      const wishlist = StorageService.getWishlist();
      wishlist.forEach(app => {
        const score = scoreText(`${app.notes || ''} ${app.job?.description || ''}`, app.job?.title || 'Saved Job', app.job?.requiredSkills || []);
        if (score > 0.2) {
          results.push({
            id: app.id,
            type: 'job',
            title: `[Application Ledger] ${app.job?.title} at ${app.job?.company}`,
            subtitle: `Status: ${app.status} • Referral: ${app.referralContact || 'Direct'}`,
            content: app.notes || app.job?.description?.slice(0, 200) || '',
            relevanceScore: score + 0.1, // Slight boost for user's own evidence
            tags: app.job?.requiredSkills || [],
          });
        }
      });
    } catch {
      // Ignored if storage not populated
    }

    // 7. Research Papers & Books
    if (!entityTypeFilter || entityTypeFilter.includes('paper')) {
      RESEARCH_PAPERS_DATA.forEach(paper => {
        const textContent = `${paper.abstract} ${(paper.findings || []).join(' ')}`;
        const score = scoreText(textContent, paper.title, paper.topics || []);
        if (score > 0.25) {
          results.push({
            id: paper.id,
            type: 'paper',
            title: paper.title,
            subtitle: `Paper • ${(paper.authors || []).join(', ')} (${paper.year})`,
            content: paper.abstract.slice(0, 200),
            relevanceScore: score,
            tags: paper.topics || [],
          });
        }
      });
    }

    // Sort by relevance score descending & deduplicate by ID
    const seen = new Set<string>();
    const deduplicated = results
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .filter(item => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });

    return deduplicated.slice(0, limit);
  }
}
