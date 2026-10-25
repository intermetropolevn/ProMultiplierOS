import { 
  KnowledgeUnit, 
  Book, 
  ResearchPaper, 
  ArticleSource, 
  CrossSourceSynthesis,
  KnowledgeGraphNode,
  KnowledgeGraphLink
} from '../types';
import { BOOKS_DATA } from '../../../data/booksData';
import { KNOWLEDGE_UNITS_DATA } from '../../../data/knowledgeUnitsData';
import { RESEARCH_PAPERS_DATA, ARTICLES_DATA, SYNTHESES_DATA } from '../../../data/researchPapersData';
import { AccessControlService } from '../../../services/accessControlService';
import { dataExposureGuard } from '../../../services/dataExposureGuardService';

class KnowledgeStore {
  private units: KnowledgeUnit[] = [...KNOWLEDGE_UNITS_DATA];
  private books: Book[] = [...BOOKS_DATA];
  private research: ResearchPaper[] = [...RESEARCH_PAPERS_DATA];
  private articles: ArticleSource[] = [...ARTICLES_DATA];
  private syntheses: CrossSourceSynthesis[] = [...SYNTHESES_DATA];

  private sliceByTier<T>(resource: string, list: T[]): T[] {
    const tier = AccessControlService.getAccessLevel();
    if (tier === 'PUBLIC') {
      return dataExposureGuard.paginateAndProject(resource, list.slice(0, 1), undefined, 'PUBLIC').items;
    }
    if (tier === 'GUEST') {
      return dataExposureGuard.paginateAndProject(resource, list.slice(0, 3), undefined, 'GUEST').items;
    }
    if (tier === 'DEMO') {
      return dataExposureGuard.paginateAndProject(resource, list.slice(0, 5), undefined, 'DEMO').items;
    }
    return [...list];
  }

  // Knowledge Units
  getKnowledgeUnits(): KnowledgeUnit[] {
    return this.sliceByTier('knowledge_units', this.units);
  }

  getKnowledgeUnitById(id: string): KnowledgeUnit | undefined {
    return dataExposureGuard.authorizeSingleRecordLookup('knowledge_units', id, this.getKnowledgeUnits());
  }

  addKnowledgeUnit(unit: KnowledgeUnit): void {
    const auth = dataExposureGuard.assertWriteAuthorized('knowledge_units', 'create');
    if (!auth.allowed) {
      throw new Error(auth.reason || 'Knowledge unit creation restricted by access tier.');
    }
    const existingIdx = this.units.findIndex(u => u.id === unit.id);
    if (existingIdx >= 0) {
      this.units[existingIdx] = unit;
    } else {
      this.units.unshift(unit);
    }
  }

  // Books
  getBooks(): Book[] {
    return this.sliceByTier('books', this.books);
  }

  getBookById(id: string): Book | undefined {
    return dataExposureGuard.authorizeSingleRecordLookup('books', id, this.getBooks());
  }

  addBook(book: Book): void {
    const auth = dataExposureGuard.assertWriteAuthorized('books', 'create');
    if (!auth.allowed) {
      throw new Error(auth.reason || 'Book creation restricted by access tier.');
    }
    const existingIdx = this.books.findIndex(b => b.id === book.id);
    if (existingIdx >= 0) {
      this.books[existingIdx] = book;
    } else {
      this.books.unshift(book);
    }
  }

  // Research Papers
  getResearchPapers(): ResearchPaper[] {
    return this.sliceByTier('research_papers', this.research);
  }

  getResearchPaperById(id: string): ResearchPaper | undefined {
    return dataExposureGuard.authorizeSingleRecordLookup('research_papers', id, this.getResearchPapers());
  }

  // Articles
  getArticles(): ArticleSource[] {
    return this.sliceByTier('articles', this.articles);
  }

  getArticleById(id: string): ArticleSource | undefined {
    return dataExposureGuard.authorizeSingleRecordLookup('articles', id, this.getArticles());
  }

  // Syntheses
  getSyntheses(): CrossSourceSynthesis[] {
    return this.sliceByTier('syntheses', this.syntheses);
  }

  // Knowledge Graph Generator (Scoped strictly to tier-authorized Knowledge Units)
  getKnowledgeGraph(): { nodes: KnowledgeGraphNode[]; links: KnowledgeGraphLink[] } {
    const nodes: KnowledgeGraphNode[] = [];
    const links: KnowledgeGraphLink[] = [];
    const nodeIds = new Set<string>();

    const addNode = (node: KnowledgeGraphNode) => {
      if (!nodeIds.has(node.id)) {
        nodeIds.add(node.id);
        nodes.push(node);
      }
    };

    const authorizedUnits = this.getKnowledgeUnits();
    const authorizedUnitIds = new Set(authorizedUnits.map(u => u.id));

    // 1. Add Authorized Knowledge Units as Nodes
    for (const unit of authorizedUnits) {
      addNode({
        id: unit.id,
        label: unit.title,
        type: 'concept',
        category: unit.type,
        confidence: unit.confidence,
        authority: unit.sourceAuthority,
        origin: unit.knowledgeOrigin,
        domain: unit.domain
      });

      // Unit to Skills
      for (const skill of unit.skills) {
        const skillId = `skill-${skill.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        addNode({
          id: skillId,
          label: skill,
          type: 'skill',
          domain: unit.domain
        });
        links.push({
          source: unit.id,
          target: skillId,
          relation: 'REQUIRES',
          label: 'requires skill'
        });
      }

      // Unit to Roles
      for (const role of unit.roles) {
        const roleId = `role-${role.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        addNode({
          id: roleId,
          label: role,
          type: 'role'
        });
        links.push({
          source: unit.id,
          target: roleId,
          relation: 'USED_BY',
          label: 'used by role'
        });
      }

      // Unit to Domain
      const domainId = `domain-${unit.domain.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      addNode({
        id: domainId,
        label: unit.domain,
        type: 'domain'
      });
      links.push({
        source: unit.id,
        target: domainId,
        relation: 'PART_OF',
        label: 'part of domain'
      });

      // Unit to Sources
      for (const source of unit.sources) {
        const sourceNodeId = `src-${source.sourceId}`;
        addNode({
          id: sourceNodeId,
          label: source.title,
          type: 'source',
          authority: unit.sourceAuthority
        });
        links.push({
          source: unit.id,
          target: sourceNodeId,
          relation: 'SOURCE',
          label: source.author
        });
      }

      // Related concepts (only link if target is also within authorized graph slice)
      if (unit.relatedConcepts) {
        for (const relatedId of unit.relatedConcepts) {
          if (authorizedUnitIds.has(relatedId)) {
            links.push({
              source: unit.id,
              target: relatedId,
              relation: 'RELATED_TO',
              label: 'related to'
            });
          }
        }
      }
    }

    return { nodes, links };
  }
}

export const knowledgeStore = new KnowledgeStore();
