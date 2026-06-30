/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface BilingualTextProps {
  en: string;
  or: string;
  className?: string;
  layout?: 'stacked' | 'side-by-side' | 'inline' | 'clean-or-only' | 'clean-en-only';
  enClassName?: string;
  orClassName?: string;
  separator?: string;
}

export default function BilingualText({
  en,
  or,
  className = '',
  layout = 'stacked',
  enClassName = '',
  orClassName = '',
  separator = '•'
}: BilingualTextProps) {
  if (layout === 'clean-en-only') {
    return <span className={`${className} ${enClassName}`}>{en}</span>;
  }
  if (layout === 'clean-or-only') {
    return <span className={`${className} ${orClassName}`}>{or}</span>;
  }

  if (layout === 'inline') {
    return (
      <span className={`inline-flex items-center gap-1.5 ${className}`}>
        <span className={`${enClassName} text-zinc-100 font-medium`}>{en}</span>
        <span className="text-emerald-500/80 text-xs font-semibold px-1 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20">OR</span>
        <span className={`${orClassName} text-zinc-300 font-medium`}>{or}</span>
      </span>
    );
  }

  if (layout === 'side-by-side') {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        <span className={`${enClassName} text-zinc-100 font-medium`}>{en}</span>
        <span className="text-zinc-600 font-light select-none">{separator}</span>
        <span className={`${orClassName} text-zinc-400 font-normal italic`}>{or}</span>
      </div>
    );
  }

  // Default: stacked (English top, Afaan Oromo bottom in elegant muted styling)
  return (
    <div className={`flex flex-col gap-0.5 text-left ${className}`}>
      <span className={`text-zinc-100 font-medium tracking-tight leading-snug ${enClassName}`}>
        {en}
      </span>
      <span className={`text-xs text-emerald-400/90 font-medium tracking-wide italic flex items-center gap-1 mt-0.5 ${orClassName}`}>
        <span className="inline-block w-1 h-1 rounded-full bg-emerald-400/70" />
        {or}
      </span>
    </div>
  );
}
