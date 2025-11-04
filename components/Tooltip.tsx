import React from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top', className }) => {
    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-3',
    };

    const arrowClasses = {
        top: 'top-full left-1/2 -translate-x-1/2 border-t-surface',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-surface rotate-180',
        left: 'left-full top-1/2 -translate-y-1/2 -translate-x-px border-l-surface',
        right: 'right-full top-1/2 -translate-y-1/2 translate-x-px border-r-surface',
    }
    
    return (
        <div className={`relative group/tooltip ${className || 'inline-flex'}`}>
            {children}
            <div role="tooltip" className={`absolute ${positionClasses[position]} w-max px-3 py-1.5 bg-surface text-primary text-xs font-bold rounded-md shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 border border-border`}>
                {content}
                 <div className={`absolute w-0 h-0 border-x-4 border-x-transparent border-t-4 ${arrowClasses[position]}`}></div>
            </div>
        </div>
    );
};

export default Tooltip;
