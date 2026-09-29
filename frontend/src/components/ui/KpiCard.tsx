'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface KpiCardProps {
  label: string;
  value: string | number;
  subvalue?: string;
  icon: React.ReactNode;
  tint?: 'indigo' | 'cyan' | 'violet' | 'emerald' | 'amber' | 'pink' | 'hero';
  delta?: {
    value: string;
    isPositive?: boolean;
    period?: string;
  };
  sparklineData?: number[];
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  subvalue,
  icon,
  tint = 'indigo',
  delta,
  sparklineData,
}) => {
  const isHero = tint === 'hero';

  const getTintStyles = () => {
    switch (tint) {
      case 'hero':
        return {
          wrapper: 'bg-gradient-to-br from-brand-indigo via-brand-violet to-brand-pink text-white shadow-lg shadow-brand-indigo/20 border-transparent',
          iconWrapper: 'bg-white/20 text-white',
          labelText: 'text-white/80',
          valueText: 'text-white',
          subText: 'text-white/70',
          deltaBadge: 'bg-white/20 text-white',
        };
      case 'cyan':
        return {
          wrapper: 'bg-surface border-border hover:border-brand-cyan/40',
          iconWrapper: 'bg-brand-cyanTint text-brand-cyan',
          labelText: 'text-secondary',
          valueText: 'text-primary',
          subText: 'text-muted',
          deltaBadge: 'bg-semantic-successTint text-semantic-successText',
        };
      case 'violet':
        return {
          wrapper: 'bg-surface border-border hover:border-brand-violet/40',
          iconWrapper: 'bg-brand-violetTint text-brand-violet',
          labelText: 'text-secondary',
          valueText: 'text-primary',
          subText: 'text-muted',
          deltaBadge: 'bg-semantic-successTint text-semantic-successText',
        };
      case 'emerald':
        return {
          wrapper: 'bg-surface border-border hover:border-semantic-success/40',
          iconWrapper: 'bg-semantic-successTint text-semantic-success',
          labelText: 'text-secondary',
          valueText: 'text-primary',
          subText: 'text-muted',
          deltaBadge: 'bg-semantic-successTint text-semantic-successText',
        };
      case 'amber':
        return {
          wrapper: 'bg-surface border-border hover:border-semantic-warning/40',
          iconWrapper: 'bg-semantic-warningTint text-semantic-warning',
          labelText: 'text-secondary',
          valueText: 'text-primary',
          subText: 'text-muted',
          deltaBadge: 'bg-semantic-warningTint text-semantic-warningText',
        };
      case 'pink':
        return {
          wrapper: 'bg-surface border-border hover:border-brand-pink/40',
          iconWrapper: 'bg-brand-pinkTint text-brand-pink',
          labelText: 'text-secondary',
          valueText: 'text-primary',
          subText: 'text-muted',
          deltaBadge: 'bg-semantic-successTint text-semantic-successText',
        };
      case 'indigo':
      default:
        return {
          wrapper: 'bg-surface border-border hover:border-brand-indigo/40',
          iconWrapper: 'bg-brand-indigoTint text-brand-indigo',
          labelText: 'text-secondary',
          valueText: 'text-primary',
          subText: 'text-muted',
          deltaBadge: 'bg-semantic-successTint text-semantic-successText',
        };
    }
  };

  const style = getTintStyles();

  return (
    <div
      className={`p-5 rounded-2xl border shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${style.wrapper}`}
    >
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${style.iconWrapper}`}>
          {icon}
        </div>

        {delta && (
          <div
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
              isHero
                ? style.deltaBadge
                : delta.isPositive
                ? 'bg-semantic-successTint text-semantic-successText'
                : 'bg-semantic-dangerTint text-semantic-dangerText'
            }`}
          >
            {delta.isPositive ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            <span>{delta.value}</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className={`text-xs font-semibold uppercase tracking-wider ${style.labelText}`}>
          {label}
        </div>
        <div className={`text-2xl font-extrabold font-display tracking-tight mt-1 ${style.valueText}`}>
          {value}
        </div>
        {subvalue && (
          <div className={`text-xs mt-0.5 font-medium truncate ${style.subText}`}>
            {subvalue}
          </div>
        )}
      </div>

      {/* Mini Sparkline Bar / Wave */}
      {sparklineData && sparklineData.length > 0 && (
        <div className="mt-3 flex items-end gap-1 h-6 pt-1">
          {sparklineData.map((d, i) => {
            const max = Math.max(...sparklineData);
            const heightPct = Math.max(15, Math.round((d / max) * 100));
            return (
              <div
                key={i}
                className={`flex-1 rounded-xs transition-all duration-300 ${
                  isHero ? 'bg-white/40 hover:bg-white/80' : 'bg-brand-indigo/30 hover:bg-brand-indigo'
                }`}
                style={{ height: `${heightPct}%` }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
