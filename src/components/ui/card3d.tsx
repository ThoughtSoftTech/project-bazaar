"use client";

import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface Card3DProps {
    children: React.ReactNode;
    className?: string;
    intensity?: number;
    isRotated?: boolean;
    glassEffect?: boolean;
}

const Card3D = ({
    children,
    className,
    intensity = 10,
    isRotated = true,
    glassEffect = false,
}: Card3DProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current || !isRotated) return;

        const card = cardRef.current;
        const rect = card.getBoundingClientRect();

        // Calculate the position of the mouse relative to the card
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate the position as a percentage of the card dimensions
        const xPercent = (x / rect.width - 0.5) * 2; // -1 to 1
        const yPercent = (y / rect.height - 0.5) * 2; // -1 to 1

        setPosition({ x: xPercent, y: yPercent });
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setPosition({ x: 0, y: 0 });
    };

    // Calculate the rotation transform based on mouse position
    const rotateY = isRotated && isHovered ? position.x * intensity : 0;
    const rotateX = isRotated && isHovered ? -position.y * intensity : 0;

    const style: React.CSSProperties = {
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.02 : 1})`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
        willChange: 'transform',
        transformStyle: 'preserve-3d',
    };

    return (
        <div
            ref={cardRef}
            className={cn(
                "card-3d-container relative",
                { "shadow-card": isHovered },
                { "glass": glassEffect },
                className
            )}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={style}
        >
            {children}

            {/* Add subtle highlight effect when hovered */}
            {isHovered && (
                <div className="absolute inset-0 pointer-events-none rounded-xl bg-gradient-to-t from-primary/10 via-transparent to-accent/10 opacity-60" />
            )}
        </div>
    );
};

export default Card3D;