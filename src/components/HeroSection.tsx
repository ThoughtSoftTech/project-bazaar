"use client";
import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Handle mouse movement effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;

            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            // Calculate mouse position as a percentage of the window
            const x = clientX / innerWidth;
            const y = clientY / innerHeight;

            // Apply a subtle parallax effect to different elements
            const elements = containerRef.current.querySelectorAll('.parallax-element');
            elements.forEach((el: Element) => {
                const htmlEl = el as HTMLElement;
                const speedX = parseFloat(htmlEl.dataset.speedX || '0');
                const speedY = parseFloat(htmlEl.dataset.speedY || '0');

                const moveX = (x - 0.5) * speedX;
                const moveY = (y - 0.5) * speedY;

                htmlEl.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative bg-gradient-to-b from-background to-secondary/20 pt-16 pb-24 overflow-hidden"
        >
            {/* Floating geometric shapes */}
            <div
                className="absolute inset-0 pointer-events-none overflow-hidden"
                style={{ opacity: 0.5 }}
            >
                {/* Circle */}
                <motion.div
                    className="absolute top-[10%] left-[15%] w-64 h-64 rounded-full bg-primary/5 parallax-element"
                    animate={{
                        y: [0, -15, 0],
                        rotate: [0, 5, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    data-speed-x="20"
                    data-speed-y="10"
                />

                {/* Rectangle */}
                <motion.div
                    className="absolute bottom-[15%] right-[10%] w-48 h-32 rounded-lg bg-accent/5 parallax-element"
                    animate={{
                        y: [0, 20, 0],
                        rotate: [0, -5, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                    }}
                    data-speed-x="-15"
                    data-speed-y="-20"
                />

                {/* Triangle */}
                <div
                    className="absolute top-[30%] right-[20%] parallax-element"
                    data-speed-x="-30"
                    data-speed-y="30"
                >
                    <motion.div
                        animate={{
                            rotate: [0, 360],
                        }}
                        transition={{
                            duration: 40,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        <div
                            className="w-0 h-0 border-l-[75px] border-l-transparent border-b-[130px] border-b-primary/5 border-r-[75px] border-r-transparent"
                        />
                    </motion.div>
                </div>

                {/* Small floating dots */}
                {[...Array(15)].map((_, i) => {
                    const size = Math.random() * 10 + 5;
                    const left = `${Math.random() * 100}%`;
                    const top = `${Math.random() * 100}%`;
                    const duration = Math.random() * 10 + 15;
                    const delay = Math.random() * 5;

                    return (
                        <motion.div
                            key={i}
                            className="absolute rounded-full bg-primary/10 parallax-element"
                            style={{
                                width: size,
                                height: size,
                                left,
                                top,
                            }}
                            animate={{
                                y: [0, -30, 0],
                                opacity: [0.3, 0.8, 0.3]
                            }}
                            transition={{
                                duration,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay
                            }}
                            data-speed-x={(Math.random() * 40 - 20).toString()}
                            data-speed-y={(Math.random() * 40 - 20).toString()}
                        />
                    );
                })}
            </div>

            <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center">
                {/* Text content */}
                <motion.div
                    className="lg:w-1/2 text-center lg:text-left mb-16 lg:mb-0"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    <div className="inline-block px-3 py-1 mb-6 text-sm font-medium bg-primary/10 text-primary rounded-full">
                        Elevate your tech portfolio with quality projects
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                        Find the Perfect Tech Projects For Your Portfolio
                    </h1>

                    <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto lg:mx-0">
                        Browse our curated collection of high-quality tech projects designed to enhance your portfolio and showcase your skills to potential employers.
                    </p>

                    <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button size="lg" className="font-medium">
                                <Link href="/shop" className="flex items-center">
                                    Browse Projects
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button size="lg" variant="outline" className="font-medium">
                                <Link href="/custom">Request Custom Project</Link>
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>

                {/* 3D Illustration/Card */}
                <motion.div
                    className="lg:w-1/2"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                >
                    <div className="relative w-full max-w-lg mx-auto">
                        {/* Main card with perspective effect */}
                        <div className="relative w-full aspect-square max-w-md mx-auto">
                            <motion.div
                                className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 p-1 shadow-xl"
                                style={{
                                    transformStyle: 'preserve-3d',
                                    perspective: '1000px'
                                }}
                                animate={{
                                    rotateY: [0, 10, 0, -10, 0],
                                    rotateX: [0, -10, 0, 10, 0],
                                }}
                                transition={{
                                    duration: 20,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <div className="bg-card dark:bg-card/90 h-full w-full rounded-lg flex items-center justify-center p-8 overflow-hidden">
                                    {/* Project showcase mockup */}
                                    <div className="relative w-full">
                                        <div className="rounded-lg overflow-hidden shadow-lg border border-border">
                                            <img
                                                src="/project.png"
                                                alt="Project"
                                                className="w-full h-auto object-cover"
                                            />
                                            <div className="p-4 bg-background/80 backdrop-blur-sm">
                                                <h3 className="font-medium">Web Application Project</h3>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-sm text-muted-foreground">Web Development</span>
                                                    <span className="font-semibold">Rs 2,499</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Floating tech icons */}
                                        <motion.div
                                            className="absolute -top-5 -right-5 bg-primary/90 w-12 h-12 rounded-full flex items-center justify-center text-white parallax-element"
                                            animate={{
                                                y: [0, -10, 0],
                                                rotate: [0, 10, 0]
                                            }}
                                            transition={{
                                                duration: 5,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                            data-speed-x="40"
                                            data-speed-y="20"
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                                                <path d="M12 18.1387L4.4812 13.5557V4.38965L12 9.00242L19.5188 4.38965V13.5557L12 18.1387Z" stroke="currentColor" strokeWidth="2" />
                                            </svg>
                                        </motion.div>

                                        <motion.div
                                            className="absolute -bottom-5 -left-5 bg-accent/90 w-14 h-14 rounded-full flex items-center justify-center parallax-element"
                                            animate={{
                                                y: [0, 10, 0],
                                                rotate: [0, -10, 0]
                                            }}
                                            transition={{
                                                duration: 7,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                                delay: 1
                                            }}
                                            data-speed-x="-30"
                                            data-speed-y="-25"
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                                                <path d="M20 4L13.5 6.5M20 4L14.5 11M20 4L3 16M3 16L9.5 8.5M3 16L9.5 19.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default HeroSection;