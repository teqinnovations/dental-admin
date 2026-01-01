import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: ReactNode;
  gradient: 'primary' | 'accent' | 'success' | 'info';
}

const gradientClasses = {
  primary: 'from-primary/20 to-primary/5',
  accent: 'from-accent/20 to-accent/5',
  success: 'from-success/20 to-success/5',
  info: 'from-info/20 to-info/5',
};

const iconBgClasses = {
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-accent/10 text-accent',
  success: 'bg-success/10 text-success',
  info: 'bg-info/10 text-info',
};

export function StatCard({ title, value, change, changeType = 'neutral', icon, gradient }: StatCardProps) {
  return (
    <div className="stat-card group">
      <div className={cn("stat-card-gradient bg-gradient-to-br", gradientClasses[gradient])} />
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", iconBgClasses[gradient])}>
            {icon}
          </div>
          {change && (
            <span className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              changeType === 'positive' && "bg-success/10 text-success",
              changeType === 'negative' && "bg-destructive/10 text-destructive",
              changeType === 'neutral' && "bg-muted text-muted-foreground"
            )}>
              {change}
            </span>
          )}
        </div>
        <p className="text-muted-foreground text-sm mb-1">{title}</p>
        <p className="text-2xl lg:text-3xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}
