import { Search, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
  dark?: boolean;
}

export default function SearchField({ value, onChange, placeholder, ariaLabel, className, inputClassName, autoFocus, dark = false }: SearchFieldProps) {
  return <div className={cn('group relative', className)}>
    <Search className={cn('pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors', dark ? 'text-white/60 group-focus-within:text-secondary-container' : 'text-on-surface-variant group-focus-within:text-primary')} aria-hidden="true" />
    <input type="text" inputMode="search" value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} aria-label={ariaLabel} autoFocus={autoFocus} className={cn('w-full rounded-2xl border py-4 pl-12 pr-12 text-sm font-semibold outline-none transition-all placeholder:font-medium', dark ? 'border-white/15 bg-white/10 text-white placeholder:text-white/55 focus:border-secondary-container/70 focus:bg-white/15 focus:ring-4 focus:ring-secondary-container/10' : 'border-outline-variant bg-white text-primary placeholder:text-on-surface-variant/65 focus:border-primary/50 focus:ring-4 focus:ring-primary/10', inputClassName)} />
    {value && <button type="button" onClick={() => onChange('')} aria-label={`Clear ${ariaLabel.toLowerCase()}`} className={cn('absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl transition-colors', dark ? 'text-white/65 hover:bg-white/15 hover:text-white' : 'text-on-surface-variant hover:bg-surface-container hover:text-primary')}><X className="h-4 w-4" /></button>}
  </div>;
}
