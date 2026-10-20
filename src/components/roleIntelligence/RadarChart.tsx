import React, { useState } from 'react';
import { CareerOSDimensionScore } from '../../features/roleIntelligence/types';

export type RadarLayer = 'current' | 'system' | 'human' | 'target';

interface RadarChartProps {
  dimensions: CareerOSDimensionScore[];
  size?: number;
  highlightKey?: string;
  onSelectDimension?: (key: string) => void;
  activeLayers?: RadarLayer[];
  onToggleLayer?: (layer: RadarLayer) => void;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  dimensions,
  size = 320,
  highlightKey,
  onSelectDimension,
  activeLayers: externalActiveLayers,
  onToggleLayer: externalOnToggleLayer
}) => {
  // Internal state if uncontrolled
  const [internalActiveLayers, setInternalActiveLayers] = useState<RadarLayer[]>([
    'current',
    'system',
    'human',
    'target'
  ]);

  const activeLayers = externalActiveLayers || internalActiveLayers;

  const handleToggle = (layer: RadarLayer) => {
    if (externalOnToggleLayer) {
      externalOnToggleLayer(layer);
    } else {
      setInternalActiveLayers(prev => {
        if (prev.includes(layer)) {
          // Keep at least one layer visible
          if (prev.length === 1) return prev;
          return prev.filter(l => l !== layer);
        } else {
          return [...prev, layer];
        }
      });
    }
  };

  const center = size / 2;
  const radius = size * 0.36;
  const total = dimensions.length;
  const levels = [1, 2, 3, 4, 5];

  // Helper to calculate coordinates
  const getCoordinates = (index: number, score: number) => {
    const angle = (Math.PI * 2 / total) * index - Math.PI / 2;
    const clampedScore = Math.max(0.5, Math.min(5, score));
    const r = (clampedScore / 5) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, angle };
  };

  // Generate polygon points for various layers
  const currentPoints = dimensions
    .map((dim, i) => {
      const score = dim.score || 3;
      const { x, y } = getCoordinates(i, score);
      return `${x},${y}`;
    })
    .join(' ');

  const systemPoints = dimensions
    .map((dim, i) => {
      const score = dim.systemEvidenceScore || Math.max(1, Math.min(5, (dim.score || 3) + (i % 2 === 0 ? 0.2 : -0.3)));
      const { x, y } = getCoordinates(i, score);
      return `${x},${y}`;
    })
    .join(' ');

  const humanPoints = dimensions
    .map((dim, i) => {
      const score = dim.humanSignalScore || Math.max(1, Math.min(5, (dim.score || 3) + (i % 3 === 0 ? -0.4 : 0.3)));
      const { x, y } = getCoordinates(i, score);
      return `${x},${y}`;
    })
    .join(' ');

  const targetPoints = dimensions
    .map((dim, i) => {
      const score = dim.targetRoleScore || Math.min(5, (dim.score || 3) + 1);
      const { x, y } = getCoordinates(i, score);
      return `${x},${y}`;
    })
    .join(' ');

  const layerConfigs: { id: RadarLayer; label: string; color: string; bgClass: string; activeBorderClass: string; stroke: string; fill: string; strokeDash?: string }[] = [
    {
      id: 'current',
      label: 'Current Assessment',
      color: 'text-blue-600',
      bgClass: 'bg-blue-50 text-blue-700 border-blue-200',
      activeBorderClass: 'ring-2 ring-blue-500/20 bg-blue-600 text-white',
      stroke: '#2563eb',
      fill: 'rgba(37, 99, 235, 0.15)'
    },
    {
      id: 'system',
      label: 'System Evidence',
      color: 'text-emerald-600',
      bgClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      activeBorderClass: 'ring-2 ring-emerald-500/20 bg-emerald-600 text-white',
      stroke: '#059669',
      fill: 'rgba(5, 150, 105, 0.08)',
      strokeDash: '4 3'
    },
    {
      id: 'human',
      label: 'Human Signal',
      color: 'text-amber-600',
      bgClass: 'bg-amber-50 text-amber-700 border-amber-200',
      activeBorderClass: 'ring-2 ring-amber-500/20 bg-amber-600 text-white',
      stroke: '#d97706',
      fill: 'rgba(217, 119, 6, 0.08)',
      strokeDash: '2 2'
    },
    {
      id: 'target',
      label: 'Target Role',
      color: 'text-purple-600',
      bgClass: 'bg-purple-50 text-purple-700 border-purple-200',
      activeBorderClass: 'ring-2 ring-purple-500/20 bg-purple-600 text-white',
      stroke: '#7c3aed',
      fill: 'rgba(124, 58, 237, 0.06)',
      strokeDash: '5 3'
    }
  ];

  return (
    <div className="relative flex flex-col items-center justify-center select-none w-full">
      {/* 4-Way Multi-Signal Toggle Controls */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3 w-full max-w-md">
        {layerConfigs.map((cfg) => {
          const isActive = activeLayers.includes(cfg.id);
          return (
            <button
              key={cfg.id}
              type="button"
              onClick={() => handleToggle(cfg.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? cfg.activeBorderClass
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: isActive ? '#ffffff' : cfg.stroke }}
              />
              <span>{cfg.label}</span>
            </button>
          );
        })}
      </div>

      <svg width={size} height={size} className="overflow-visible">
        {/* Background Concentric Circles / Webs */}
        {levels.map((level) => {
          const levelRadius = (level / 5) * radius;
          return (
            <g key={level}>
              <circle
                cx={center}
                cy={center}
                r={levelRadius}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="1"
                strokeDasharray={level === 5 ? 'none' : '3 3'}
              />
              <text
                x={center + 4}
                y={center - levelRadius + 10}
                className="text-[9px] fill-slate-400 font-mono select-none"
              >
                {level}
              </text>
            </g>
          );
        })}

        {/* Radial Axis Lines */}
        {dimensions.map((dim, i) => {
          const { x, y } = getCoordinates(i, 5);
          const isSelected = highlightKey === dim.key;
          return (
            <line
              key={dim.key}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke={isSelected ? '#3b82f6' : '#e2e8f0'}
              strokeWidth={isSelected ? '1.5' : '1'}
            />
          );
        })}

        {/* Target Role Polygon (if active) */}
        {activeLayers.includes('target') && (
          <polygon
            points={targetPoints}
            fill="rgba(124, 58, 237, 0.08)"
            stroke="#7c3aed"
            strokeWidth="2"
            strokeDasharray="4 3"
            className="transition-all duration-300 pointer-events-none"
          />
        )}

        {/* System Evidence Polygon (if active) */}
        {activeLayers.includes('system') && (
          <polygon
            points={systemPoints}
            fill="rgba(5, 150, 105, 0.10)"
            stroke="#059669"
            strokeWidth="2"
            strokeDasharray="3 2"
            className="transition-all duration-300 pointer-events-none"
          />
        )}

        {/* Human Signal Polygon (if active) */}
        {activeLayers.includes('human') && (
          <polygon
            points={humanPoints}
            fill="rgba(217, 119, 6, 0.08)"
            stroke="#d97706"
            strokeWidth="1.8"
            strokeDasharray="2 2"
            className="transition-all duration-300 pointer-events-none"
          />
        )}

        {/* Current Assessment Polygon (Synthesized) */}
        {activeLayers.includes('current') && (
          <polygon
            points={currentPoints}
            fill="rgba(37, 99, 235, 0.18)"
            stroke="#2563eb"
            strokeWidth="2.5"
            className="transition-all duration-300"
          />
        )}

        {/* Data Points on Current Assessment */}
        {dimensions.map((dim, i) => {
          const { x, y } = getCoordinates(i, dim.score || 3);
          const isSelected = highlightKey === dim.key;
          return (
            <g 
              key={dim.key} 
              className="cursor-pointer group"
              onClick={() => onSelectDimension && onSelectDimension(dim.key)}
            >
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 6 : 4}
                fill={isSelected ? '#1d4ed8' : '#2563eb'}
                stroke="#ffffff"
                strokeWidth="2"
                className="transition-all duration-200 group-hover:scale-125"
              />
            </g>
          );
        })}

        {/* Axis Labels Around Radar */}
        {dimensions.map((dim, i) => {
          const { angle } = getCoordinates(i, 5);
          const labelDist = radius + 22;
          const lx = center + labelDist * Math.cos(angle);
          const ly = center + labelDist * Math.sin(angle);
          const isSelected = highlightKey === dim.key;

          // Short label formatting
          const words = dim.label.split(' ');
          const line1 = words.slice(0, 2).join(' ');
          const line2 = words.slice(2).join(' ');

          return (
            <text
              key={`label-${dim.key}`}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              onClick={() => onSelectDimension && onSelectDimension(dim.key)}
              className={`text-[9.5px] cursor-pointer transition-colors ${
                isSelected 
                  ? 'fill-blue-700 font-bold' 
                  : 'fill-slate-600 hover:fill-slate-900 font-medium'
              }`}
            >
              <tspan x={lx} dy="-0.4em">{line1}</tspan>
              {line2 && <tspan x={lx} dy="1em">{line2}</tspan>}
            </text>
          );
        })}
      </svg>
    </div>
  );
};
