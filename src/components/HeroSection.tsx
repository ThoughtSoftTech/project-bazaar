"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
    return (
        <section className="relative overflow-hidden py-12 md:py-20 lg:py-28">
            {/* Colorful background elements */}
            <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl"></div>
            <div className="absolute top-1/2 -right-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl"></div>
            <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-secondary/20 blur-3xl"></div>

            <div className="container relative z-10 mx-auto px-4">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    <div className="flex flex-col items-start">
                        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                            <span className="text-gradient bg-gradient-vibrant">Project Bazaar</span>
                            <span className="block mt-3">Your Project Marketplace</span>
                        </h1>
                        <p className="mb-8 max-w-lg text-lg text-muted-foreground md:text-xl">
                            Discover, buy, and sell amazing projects across various domains.
                            From web development to robotics, we have everything you need.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/shop" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto bg-gradient-vibrant hover:opacity-90 transition-opacity">
                                    Explore Projects
                                </Button>
                            </Link>
                            <Link href="/custom" className="w-full sm:w-auto">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto border-primary/50 hover:border-primary">
                                    Custom Request
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-2xl border border-border/50 shadow-2xl">
                            <Image
                                src="/project.png"
                                alt="Project Showcase"
                                fill
                                className="object-cover"
                                priority
                            />

                            {/* Animated highlight effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-accent/30 opacity-40"></div>
                        </div>

                        {/* Floating decorator elements */}
                        <div className="absolute -top-6 -right-6 h-24 w-24 rounded-xl bg-secondary/80 p-2 shadow-lg backdrop-blur-md float-animation">
                            <Image src="/file.svg" alt="File" width={60} height={60} />
                        </div>
                        <div className="absolute -bottom-8 -left-8 h-20 w-20 rounded-xl bg-primary/80 p-2 shadow-lg backdrop-blur-md float-animation animation-delay-500">
                            <Image src="/globe.svg" alt="Globe" width={50} height={50} />
                        </div>
                        <div className="absolute bottom-12 -right-10 h-16 w-16 rounded-xl bg-accent/80 p-2 shadow-lg backdrop-blur-md float-animation animation-delay-1000">
                            <Image src="/window.svg" alt="Window" width={40} height={40} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;