import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GlassStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  iconClassName?: string;
}

export function GlassStatCard({
  title,
  value,
  icon: Icon,
  trend,
  className,
  iconClassName,
}: GlassStatCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm p-6 shadow-lg hover:bg-white/10 hover:shadow-xl transition-all duration-200 group",
        className
      )}
    >
      {/* Icon Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500" />
      
      <div className="relative flex items-center gap-4">
        {/* Icon */}
        <div className={cn(
          "w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200",
          iconClassName
        )}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Title and Value */}
        <div className="flex-1">
          {/* Title */}
          <p className="text-sm font-medium text-white/60 mb-1">{title}</p>

          {/* Value */}
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-white">{value}</p>
            
            {/* Trend */}
            {trend && (
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-green-400" : "text-red-400"
                )}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
