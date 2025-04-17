"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import  Card  from "@/components/ui/card3d";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  category?: string;
  price?: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  image,
  category,
  price,
}) => {
  return (
    <Link href={`/projectdetails/${id}`} className="block">
      <Card className="group h-full transition-all duration-300 hover:scale-[1.02]">
        <div className="relative h-full overflow-hidden rounded-xl bg-gradient-to-br from-secondary/20 to-background border border-border/50 backdrop-blur-sm">
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {category && (
              <div className="absolute right-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground backdrop-blur-sm">
                {category}
              </div>
            )}
          </div>

          <div className="p-4 md:p-5">
            <h3 className="mb-1 text-lg font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
              {description}
            </p>

            {price !== undefined && (
              <div className="flex items-center justify-between mt-auto">
                <span className="text-base font-medium text-foreground">
                  ₹{price.toLocaleString("en-IN")}
                </span>
                <span className="inline-flex items-center justify-center rounded-full bg-secondary/30 px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  View Details
                </span>
              </div>
            )}
          </div>

          {/* Subtle gradient overlay for depth */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none dark:from-white/10"></div>

          {/* Highlight effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"></div>
        </div>
      </Card>
    </Link>
  );
};

export default ProjectCard;