/**
 * Provenance & Data Quality Types for Career OS Knowledge Library
 * 
 * Distinguishes the origin and verification level of every entity:
 * Source: Official | User Added | Imported | AI Suggested | Curated | Community / External
 * Verification: Unverified | Partially Verified | Verified
 */

export type ProvenanceSource =
  | 'Official'
  | 'User Added'
  | 'Imported'
  | 'AI Suggested'
  | 'Curated'
  | 'Community / External';

export type ProvenanceVerification =
  | 'Unverified'
  | 'Partially Verified'
  | 'Verified';

export interface ProvenanceMetadata {
  source: ProvenanceSource;
  verification: ProvenanceVerification;
  sourceUrl?: string;
  sourceName?: string;
  importedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  verificationNotes?: string;
  isAiGenerated?: boolean;
}

export const PROVENANCE_SOURCE_CONFIG: Record<ProvenanceSource, { label: string; badgeColor: string; description: string }> = {
  'Official': {
    label: 'Official',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    description: 'Directly sourced from the official vendor, government authority, or standards body.'
  },
  'Curated': {
    label: 'Curated',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-300',
    description: 'Expertly vetted and structured by Career OS domain curators.'
  },
  'User Added': {
    label: 'User Added',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
    description: 'Custom entry authored and maintained by the user.'
  },
  'Imported': {
    label: 'Imported',
    badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-300',
    description: 'Extracted from external URL documentation or schema feed.'
  },
  'AI Suggested': {
    label: 'AI Suggested',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-300',
    description: 'Generated via AI analysis from product docs and subject matter blueprints.'
  },
  'Community / External': {
    label: 'Community / External',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-300',
    description: 'Contributed by external community registries or open datasets.'
  }
};

export const PROVENANCE_VERIFICATION_CONFIG: Record<ProvenanceVerification, { label: string; badgeColor: string; dotColor: string; description: string }> = {
  'Verified': {
    label: 'Verified',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    dotColor: 'bg-emerald-500',
    description: 'Facts, architecture, integrations, and capabilities cross-checked against primary sources.'
  },
  'Partially Verified': {
    label: 'Partially Verified',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-300',
    dotColor: 'bg-amber-500',
    description: 'Core metadata confirmed; specific deep-tier specifications awaiting secondary audit.'
  },
  'Unverified': {
    label: 'Unverified',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
    dotColor: 'bg-slate-400',
    description: 'Recently ingested or imported without full human-in-the-loop audit.'
  }
};

/**
 * Normalizes provenance from raw or legacy fields without creating fake verification states.
 */
export function resolveProvenance(raw: {
  provenance?: Partial<ProvenanceMetadata>;
  sourceState?: string;
  sourceType?: string;
  sourceUrl?: string;
  sourceName?: string;
  officialWebsite?: string;
  lastVerified?: string;
  observedDate?: string;
}): ProvenanceMetadata {
  if (raw.provenance && raw.provenance.source && raw.provenance.verification) {
    return {
      source: raw.provenance.source,
      verification: raw.provenance.verification,
      sourceUrl: raw.provenance.sourceUrl || raw.sourceUrl || raw.officialWebsite,
      sourceName: raw.provenance.sourceName || raw.sourceName,
      importedAt: raw.provenance.importedAt,
      verifiedAt: raw.provenance.verifiedAt || raw.lastVerified,
      verifiedBy: raw.provenance.verifiedBy,
      verificationNotes: raw.provenance.verificationNotes,
      isAiGenerated: raw.provenance.isAiGenerated
    };
  }

  // Derive honest provenance based on sourceState or URL presence
  let source: ProvenanceSource = 'Curated';
  let verification: ProvenanceVerification = 'Partially Verified';
  let isAi = false;

  if (raw.sourceState === 'AI Suggested') {
    source = 'AI Suggested';
    verification = 'Partially Verified';
    isAi = true;
  } else if (raw.sourceState === 'Imported') {
    source = 'Imported';
    verification = 'Unverified';
  } else if (raw.sourceState === 'Verified') {
    source = raw.officialWebsite ? 'Official' : 'Curated';
    verification = 'Verified';
  } else if (raw.sourceType === 'Official' || raw.officialWebsite) {
    source = 'Official';
    verification = 'Verified';
  } else if (raw.sourceType === 'User Added') {
    source = 'User Added';
    verification = 'Partially Verified';
  }

  return {
    source,
    verification,
    sourceUrl: raw.sourceUrl || raw.officialWebsite,
    sourceName: raw.sourceName || (source === 'Official' ? 'Official Documentation' : undefined),
    verifiedAt: raw.lastVerified,
    isAiGenerated: isAi
  };
}
