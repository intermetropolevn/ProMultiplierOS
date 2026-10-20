import { SavedJobApplication } from '../types';

export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskSource = 'readiness' | 'application' | 'interview' | 'manual' | 'converted_note';

export interface CareerTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TaskPriority;
  dueDate?: string;
  source: TaskSource;
  sourceLabel?: string; // e.g. "My Profile · Readiness Action Plan"
  isPinned: boolean;
  pinnedAt?: string;
  category?: 'practice' | 'evidence' | 'target' | 'general';
  tags?: string[];
  convertedFromNoteId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CareerNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  context?: string;
  isPinned: boolean;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export type PinCategory = 'all' | 'task' | 'note' | 'job' | 'knowledge';

export interface PinnedViewItem {
  id: string;
  originalId: string;
  type: 'task' | 'note' | 'job' | 'knowledge';
  title: string;
  excerpt?: string;
  tags: string[];
  date: string;
  isPinned: boolean;
  priority?: TaskPriority;
  dueDate?: string;
  sourceLabel?: string;
  completed?: boolean;
  convertedFromNote?: boolean;
  rawTask?: CareerTask;
  rawNote?: CareerNote;
}

const STORAGE_KEYS = {
  TASKS: 'career_os_shared_tasks_v2',
  NOTES: 'career_os_shared_notes_v2',
};

const INITIAL_TASKS: CareerTask[] = [
  {
    id: 'task-readiness-1',
    title: 'Review interview preparation video',
    description: 'Deconstruct executive communication nuances and opening hooks for senior leadership interviews.',
    completed: false,
    priority: 'high',
    dueDate: 'Today',
    source: 'readiness',
    sourceLabel: 'My Profile · Readiness Action Plan',
    isPinned: true,
    category: 'practice',
    tags: ['Interview Prep', 'Urgent'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-readiness-2',
    title: 'Practice speaking for 1 hour',
    description: 'Active voice drill: Explain distributed idempotency under network partition without hesitation.',
    completed: false,
    priority: 'high',
    dueDate: 'Tomorrow',
    source: 'readiness',
    sourceLabel: 'My Profile · Readiness Action Plan',
    isPinned: true,
    category: 'practice',
    tags: ['Speaking Drill', 'Fluency'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-readiness-3',
    title: 'Import relevant job postings',
    description: 'Add 3 target enterprise SaaS or Fintech tech lead roles to calibrate custom rubric expectations.',
    completed: false,
    priority: 'medium',
    dueDate: 'In 3 days',
    source: 'readiness',
    sourceLabel: 'My Profile · Readiness Action Plan',
    isPinned: false,
    category: 'target',
    tags: ['Market Intel', 'Pipeline'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-readiness-4',
    title: 'Prepare 30 core Product Manager questions',
    description: 'Structure answers using the 4-part Blueprint: Strategy Hook, Context, Execution, Metric Result.',
    completed: false,
    priority: 'high',
    dueDate: 'Due tomorrow',
    source: 'readiness',
    sourceLabel: 'My Profile · Readiness Action Plan',
    isPinned: true,
    category: 'evidence',
    tags: ['STAR Blueprint', 'Q&A'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-readiness-5',
    title: 'Rehearse STAR response on Cross-functional Conflict Resolution',
    description: 'Align product and platform engineering tradeoff metrics with executive stakeholders.',
    completed: true,
    priority: 'high',
    dueDate: 'Completed yesterday',
    source: 'readiness',
    sourceLabel: 'My Profile · Readiness Action Plan',
    isPinned: false,
    category: 'practice',
    tags: ['Behavioral', 'Leadership'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_NOTES: CareerNote[] = [
  {
    id: 'note-1',
    title: 'Little notes about design',
    content: "Talking about functionality today — how every element should have a reason to exist. 'If it doesn't help the user, it's just decoration.' That really stuck. Rethink layout hierarchies.",
    tags: ['Personal', 'Product Thinking'],
    context: 'Design Principles',
    isPinned: true,
    date: '29.07.2025',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'note-2',
    title: 'System Design: Kafka idempotency checklist',
    content: 'Always specify unique producerId + sequenceNumber, configure acks=all, enable transactional outbox pattern to guarantee zero duplicate payment events.',
    tags: ['Architecture', 'Fintech'],
    context: 'Technical Knowledge',
    isPinned: true,
    date: '14.10.2025',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const UnifiedTaskService = {
  // Broadcast update to all components listening
  notify() {
    window.dispatchEvent(new CustomEvent('career_tasks_updated'));
    window.dispatchEvent(new CustomEvent('career_pins_updated'));
  },

  // 1. TASKS API
  getTasks(): CareerTask[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load shared tasks', e);
    }
    return INITIAL_TASKS;
  },

  saveTasks(tasks: CareerTask[]): CareerTask[] {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to persist shared tasks', e);
    }
    this.notify();
    return tasks;
  },

  addTask(taskData: Omit<CareerTask, 'id' | 'createdAt' | 'updatedAt'>): CareerTask {
    const tasks = this.getTasks();
    const newTask: CareerTask = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newTask, ...tasks];
    this.saveTasks(updated);
    return newTask;
  },

  updateTask(taskId: string, updates: Partial<CareerTask>): CareerTask | null {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) return null;

    const updatedTask: CareerTask = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    tasks[index] = updatedTask;
    this.saveTasks([...tasks]);
    return updatedTask;
  },

  toggleTaskComplete(taskId: string): boolean {
    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return false;
    const newState = !task.completed;
    this.updateTask(taskId, { completed: newState });
    return newState;
  },

  toggleTaskPin(taskId: string): boolean {
    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return false;
    const newState = !task.isPinned;
    this.updateTask(taskId, {
      isPinned: newState,
      pinnedAt: newState ? new Date().toISOString() : undefined,
    });
    return newState;
  },

  deleteTask(taskId: string): boolean {
    const tasks = this.getTasks();
    const filtered = tasks.filter(t => t.id !== taskId);
    this.saveTasks(filtered);
    return true;
  },

  // 2. NOTES API
  getNotes(): CareerNote[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load shared notes', e);
    }
    return INITIAL_NOTES;
  },

  saveNotes(notes: CareerNote[]): CareerNote[] {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to persist shared notes', e);
    }
    this.notify();
    return notes;
  },

  addNote(noteData: Omit<CareerNote, 'id' | 'createdAt' | 'updatedAt' | 'date'>): CareerNote {
    const notes = this.getNotes();
    const newNote: CareerNote = {
      ...noteData,
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newNote, ...notes];
    this.saveNotes(updated);
    return newNote;
  },

  updateNote(noteId: string, updates: Partial<CareerNote>): CareerNote | null {
    const notes = this.getNotes();
    const index = notes.findIndex(n => n.id === noteId);
    if (index === -1) return null;

    const updatedNote: CareerNote = {
      ...notes[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    notes[index] = updatedNote;
    this.saveNotes([...notes]);
    return updatedNote;
  },

  toggleNotePin(noteId: string): boolean {
    const notes = this.getNotes();
    const note = notes.find(n => n.id === noteId);
    if (!note) return false;
    const newState = !note.isPinned;
    this.updateNote(noteId, { isPinned: newState });
    return newState;
  },

  deleteNote(noteId: string): boolean {
    const notes = this.getNotes();
    const filtered = notes.filter(n => n.id !== noteId);
    this.saveNotes(filtered);
    return true;
  },

  duplicateNote(noteId: string): CareerNote | null {
    const notes = this.getNotes();
    const note = notes.find(n => n.id === noteId);
    if (!note) return null;

    return this.addNote({
      title: `${note.title} (Copy)`,
      content: note.content,
      tags: [...note.tags],
      context: note.context,
      isPinned: note.isPinned,
    });
  },

  // 3. NOTE -> TASK CONVERSION
  // Converts a note into a shared task, removing the note to avoid duplicates,
  // and marking the new task as "Converted from Note"
  convertNoteToTask(
    noteId: string, 
    options: {
      title?: string;
      description?: string;
      priority: TaskPriority;
      dueDate?: string;
      tags?: string[];
    }
  ): CareerTask | null {
    const notes = this.getNotes();
    const note = notes.find(n => n.id === noteId);
    if (!note) return null;

    // 1. Create the new task from note data
    const newTask = this.addTask({
      title: options.title || note.title,
      description: options.description || note.content,
      completed: false,
      priority: options.priority,
      dueDate: options.dueDate || 'Next actions',
      source: 'converted_note',
      sourceLabel: 'Converted from Note',
      isPinned: true,
      category: 'general',
      tags: options.tags || (note.tags.length > 0 ? note.tags : ['Note Conversion']),
      convertedFromNoteId: note.id,
    });

    // 2. Remove the original note to avoid duplicate records
    this.deleteNote(noteId);

    return newTask;
  },

  // 4. COMBINED PINNED ITEMS VIEW
  // Aggregates pinned tasks, pinned notes, and static pins for Your Pins
  getAllPinnedItems(savedJobs: SavedJobApplication[] = []): PinnedViewItem[] {
    const tasks = this.getTasks().filter(t => t.isPinned);
    const notes = this.getNotes().filter(n => n.isPinned);

    const taskItems: PinnedViewItem[] = tasks.map(t => ({
      id: `pin-task-${t.id}`,
      originalId: t.id,
      type: 'task',
      title: t.title,
      excerpt: t.description,
      tags: t.tags || ['Task'],
      date: t.dueDate || 'Active',
      isPinned: true,
      priority: t.priority,
      dueDate: t.dueDate,
      sourceLabel: t.sourceLabel || (t.source === 'readiness' ? 'My Profile · Readiness Action Plan' : 'Your Pins'),
      completed: t.completed,
      convertedFromNote: t.source === 'converted_note',
      rawTask: t,
    }));

    const noteItems: PinnedViewItem[] = notes.map(n => ({
      id: `pin-note-${n.id}`,
      originalId: n.id,
      type: 'note',
      title: n.title,
      excerpt: n.content,
      tags: n.tags || ['Note'],
      date: n.date,
      isPinned: true,
      sourceLabel: n.context || 'Quick Note',
      rawNote: n,
    }));

    // Pinned Jobs from Saved Wishlist
    const jobItems: PinnedViewItem[] = savedJobs.slice(0, 3).map(j => ({
      id: `pin-job-${j.id || j.jobId}`,
      originalId: j.id || j.jobId,
      type: 'job',
      title: `${j.job?.company || 'Company'} — ${j.job?.title || 'Target Role'}`,
      excerpt: j.notes || 'Saved target pipeline application.',
      tags: [j.status || 'Active', 'Job Pipeline'],
      date: 'Active',
      isPinned: true,
      sourceLabel: 'Job Opportunity',
    }));

    // Standard Knowledge Pin
    const knowledgeItems: PinnedViewItem[] = [
      {
        id: 'pin-knowledge-1',
        originalId: 'k-1',
        type: 'knowledge',
        title: 'Local-First CRDT Deep Dive',
        excerpt: 'Contrast commutative replicated data types with 2-phase commit under split-brain states.',
        tags: ['Architecture', 'P1 Preparation'],
        date: '29.07.2026',
        isPinned: true,
        sourceLabel: 'Knowledge System',
      }
    ];

    // Tracked Opportunities from Career Radar
    let radarItems: PinnedViewItem[] = [];
    try {
      const storedRadar = localStorage.getItem('career_os_tracked_opportunities_v1');
      if (storedRadar) {
        const parsed = JSON.parse(storedRadar);
        radarItems = parsed.slice(0, 2).map((r: any) => ({
          id: `pin-opp-${r.opportunityId}`,
          originalId: r.opportunityId,
          type: 'job',
          title: `${r.opportunity?.organization || 'Host'} — ${r.opportunity?.title || 'Opportunity'}`,
          excerpt: r.opportunity?.shortDescription || r.notes || 'Tracked in Career Radar.',
          tags: [r.opportunity?.type ? r.opportunity.type.toUpperCase() : 'RADAR', 'Opportunity'],
          date: r.deadline || 'Active',
          isPinned: true,
          sourceLabel: 'Career Radar · Opportunity',
        }));
      }
    } catch {
      // fallback
    }

    return [...taskItems, ...noteItems, ...jobItems, ...radarItems, ...knowledgeItems];
  }
};
