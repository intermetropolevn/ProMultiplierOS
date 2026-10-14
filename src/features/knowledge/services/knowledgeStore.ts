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

class KnowledgeStore {
  private units: KnowledgeUnit[] = [...KNOWLEDGE_UNITS_DATA];
  private books: Book[] = [...BOOKS_DATA];
  private research: ResearchPaper[] = [...RESEARCH_PAPERS_DATA];
  private articles: ArticleSource[] = [...ARTICLES_DATA];
  private syntheses: CrossSourceSynthesis[] = [...SYNTHESES_DATA];

  // Knowledge Units
  getKnowledgeUnits(): KnowledgeUnit[] {
    return [...this.units];
  }

  getKnowledgeUnitById(id: string): KnowledgeUnit | undefined {
    return this.units.find(u => u.id === id);
  }

  addKnowledgeUnit(unit: KnowledgeUnit): void {
    const existingIdx = this.units.findIndex(u => u.id === unit.id);
    if (existingIdx >= 0) {
      this.units[existingIdx] = unit;
    } else {
      this.units.unshift(unit);
    }
  }

  // Books
  getBooks(): Book[] {
    return [...this.books];
  }

  getBookById(id: string): Book | undefined {
    return this.books.find(b => b.id === id);
  }

  addBook(book: Book): void {
    const existingIdx = this.books.findIndex(b => b.id === book.id);
    if (existingIdx >= 0) {
      this.books[existingIdx] = book;
    } else {
      this.books.unshift(book);
    }
  }

  // Research Papers
  getResearchPapers(): ResearchPaper[] {
    return [...this.research];
  }

  getResearchPaperById(id: string): ResearchPaper | undefined {
    return this.research.find(r => r.id === id);
  }

  // Articles
  getArticles(): ArticleSource[] {
    return [...this.articles];
  }

  getArticleById(id: string): ArticleSource | undefined {
    return this.articles.find(a => a.id === id);
  }

  // Syntheses
  getSyntheses(): CrossSourceSynthesis[] {
    return [...this.syntheses];
  }

  // Knowledge Graph Generator
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

    // 1. Add Knowledge Units as Nodes
    for (const unit of this.units) {
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

      // Related concepts
      if (unit.relatedConcepts) {
        for (const relatedId of unit.relatedConcepts) {
          links.push({
            source: unit.id,
            target: relatedId,
            relation: 'RELATED_TO',
            label: 'related to'
          });
        }
      }
    }

    return { nodes, links };
  }
}

export const knowledgeStore = new KnowledgeStore();
