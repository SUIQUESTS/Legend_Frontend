import React, { useState, useEffect, useRef } from 'react';

const CustomCursor: React.FC = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (!isVisible) setIsVisible(true);
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

                const target = e.target as HTMLElement;
                if (target.closest('a, button, [role="button"], .group, input, textarea, [data-hover]')) {
                    setIsHovering(true);
                } else {
                    setIsHovering(false);
                }
            }
        };
        
        const onMouseLeave = () => {
            setIsVisible(false);
        }

        document.body.addEventListener('mousemove', onMouseMove);
        document.body.addEventListener('mouseleave', onMouseLeave);
        return () => {
            document.body.removeEventListener('mousemove', onMouseMove);
            document.body.removeEventListener('mouseleave', onMouseLeave);
        };
    }, [isVisible]);

    return (
        <div ref={cursorRef} className={`custom-cursor ${isHovering ? 'hovering' : ''} ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="dot"></div>
        </div>
    );
};

export default CustomCursor;
