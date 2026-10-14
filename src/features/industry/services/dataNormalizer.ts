import { IndustryDataPoint, DataPointValueType } from '../types';

export interface NormalizedResult {
  value: number | string | boolean;
  valueType: DataPointValueType;
  unit: string;
  rawValue: string;
}

export class DataNormalizer {
  /**
   * Canonical geography mapping
   */
  private static GEOGRAPHY_MAP: Record<string, string> = {
    us: 'United States',
    usa: 'United States',
    'united states of america': 'United States',
    vn: 'Vietnam',
    'viet nam': 'Vietnam',
    uk: 'United Kingdom',
    gb: 'United Kingdom',
    'great britain': 'United Kingdom',
    apac: 'Asia-Pacific',
    sea: 'Southeast Asia',
    'southeast asia': 'Southeast Asia',
    na: 'North America',
    eu: 'Europe',
    cn: 'China',
    prc: 'China',
    jp: 'Japan',
    de: 'Germany',
    global: 'Global',
    worldwide: 'Global'
  };

  /**
   * Canonical metric slugs
   */
  public static toMetricSlug(metric: string): string {
    return metric
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Canonical geography resolution
   */
  public static normalizeGeography(geo?: string): string {
    if (!geo) return 'Global';
    const cleaned = geo.trim().toLowerCase();
    return this.GEOGRAPHY_MAP[cleaned] || geo.trim();
  }

  /**
   * Parse and normalize arbitrary text/numerical representations
   * Examples:
   *   "$420 billion" -> { value: 420000000000, valueType: 'CURRENCY', unit: 'USD' }
   *   "8.2%" -> { value: 8.2, valueType: 'PERCENTAGE', unit: '%' }
   *   "4.5M" -> { value: 4500000, valueType: 'COUNT', unit: 'units' }
   */
  public static normalizeValue(input: string | number | boolean, preferredUnit?: string): NormalizedResult {
    const rawValue = String(input).trim();

    if (typeof input === 'boolean') {
      return {
        value: input,
        valueType: 'BOOLEAN',
        unit: 'boolean',
        rawValue
      };
    }

    if (typeof input === 'number') {
      if (preferredUnit === '%' || preferredUnit === 'percent') {
        return {
          value: input <= 1 && input > 0 ? Number((input * 100).toFixed(2)) : input,
          valueType: 'PERCENTAGE',
          unit: '%',
          rawValue
        };
      }
      return {
        value: input,
        valueType: 'NUMBER',
        unit: preferredUnit || 'units',
        rawValue
      };
    }

    const text = rawValue;

    // 1. Percentage patterns: "8.2%", "8.2 percent", "0.082"
    const pctMatch = text.match(/^([\d.,]+)\s*(?:%|percent|pct)$/i);
    if (pctMatch) {
      const num = parseFloat(pctMatch[1].replace(/,/g, ''));
      return {
        value: num,
        valueType: 'PERCENTAGE',
        unit: '%',
        rawValue
      };
    }

    // 2. Currency patterns: "$420 billion", "420B USD", "USD 420bn", "€50M", "£12B"
    let currencyUnit = 'USD';
    if (text.includes('€') || /EUR/i.test(text)) currencyUnit = 'EUR';
    else if (text.includes('£') || /GBP/i.test(text)) currencyUnit = 'GBP';
    else if (text.includes('¥') || /JPY/i.test(text)) currencyUnit = 'JPY';
    else if (text.includes('VND') || text.includes('₫')) currencyUnit = 'VND';

    const isCurrency = text.includes('$') || text.includes('€') || text.includes('£') || text.includes('¥') || /USD|EUR|GBP|VND/i.test(text);

    // Multiplier detection: billion, million, trillion, B, M, T, k
    const multMatch = text.match(/([\d.,]+)\s*(trillion|billion|million|thousand|bn|b|tn|t|m|k)/i);
    if (multMatch) {
      const baseNum = parseFloat(multMatch[1].replace(/,/g, ''));
      const multStr = multMatch[2].toLowerCase();
      let multiplier = 1;

      if (['trillion', 'tn', 't'].includes(multStr)) multiplier = 1e12;
      else if (['billion', 'bn', 'b'].includes(multStr)) multiplier = 1e9;
      else if (['million', 'm'].includes(multStr)) multiplier = 1e6;
      else if (['thousand', 'k'].includes(multStr)) multiplier = 1e3;

      const normalizedNum = baseNum * multiplier;

      return {
        value: normalizedNum,
        valueType: isCurrency ? 'CURRENCY' : 'NUMBER',
        unit: isCurrency ? currencyUnit : (preferredUnit || 'units'),
        rawValue
      };
    }

    // Pure number with currency symbol
    const cleanNum = text.replace(/[$€£¥,]/g, '').trim();
    if (!isNaN(Number(cleanNum)) && cleanNum !== '') {
      const num = Number(cleanNum);
      return {
        value: num,
        valueType: isCurrency ? 'CURRENCY' : 'NUMBER',
        unit: isCurrency ? currencyUnit : (preferredUnit || 'units'),
        rawValue
      };
    }

    // Range patterns: "25% - 30%" or "400 to 500"
    if (text.includes('-') || text.includes('to')) {
      return {
        value: text,
        valueType: 'RANGE',
        unit: preferredUnit || 'range',
        rawValue
      };
    }

    // Fallback: Text
    return {
      value: text,
      valueType: 'TEXT',
      unit: preferredUnit || 'text',
      rawValue
    };
  }

  /**
   * Calculate Data Quality Score (0 - 100)
   * Formula:
   * Source Credibility (0-100) * 35%
   * Extraction Confidence (0-1) * 100 * 25%
   * Recency / Year factor * 20%
   * Definition & Methodology completeness * 20%
   */
  public static calculateDataQualityScore(
    credibilityScore: number = 85,
    confidenceScore: number = 0.95,
    periodLabel?: string,
    hasDefinition: boolean = true,
    hasMethodology: boolean = true
  ): number {
    let recencyFactor = 80;
    if (periodLabel) {
      const currentYear = new Date().getFullYear();
      const match = periodLabel.match(/\b(20\d\d)\b/);
      if (match) {
        const year = parseInt(match[1], 10);
        const diff = Math.max(0, currentYear - year);
        if (diff <= 1) recencyFactor = 100;
        else if (diff <= 3) recencyFactor = 85;
        else if (diff <= 5) recencyFactor = 70;
        else recencyFactor = 50;
      }
    }

    const clarityFactor = (hasDefinition ? 50 : 0) + (hasMethodology ? 50 : 0);

    const score = Math.round(
      credibilityScore * 0.35 +
      (confidenceScore * 100) * 0.25 +
      recencyFactor * 0.20 +
      clarityFactor * 0.20
    );

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Check for potential conflicting data points
   * If two data points share (industryId, metricSlug, geography, periodLabel) but have different values, flag conflict
   */
  public static detectConflicts(
    target: IndustryDataPoint,
    existingList: IndustryDataPoint[]
  ): string[] {
    const conflictingIds: string[] = [];

    for (const item of existingList) {
      if (item.id === target.id) continue;

      const sameIndustry = item.industryId === target.industryId;
      const sameMetric = item.metricSlug === target.metricSlug;
      const sameGeo = (item.geography || 'Global') === (target.geography || 'Global');
      const samePeriod = (item.periodLabel || '').toLowerCase() === (target.periodLabel || '').toLowerCase();

      if (sameIndustry && sameMetric && sameGeo && samePeriod) {
        // Values differ
        if (String(item.value) !== String(target.value)) {
          conflictingIds.push(item.id);
        }
      }
    }

    return conflictingIds;
  }
}
