"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Card3D from "@/components/ui/card3d";

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
      <Card3D className="group h-full" intensity={5} isRotated={true} glassEffect={true}>
        <div className="relative h-full overflow-hidden rounded-xl border border-border/50 bg-card text-card-foreground shadow-sm">
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              priority
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
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">
                  ₹{price.toLocaleString()}
                </span>
                <button className="rounded-md bg-primary px-3 py-1 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                  View Details
                </button>
              </div>
            )}
          </div>
        </div>
      </Card3D>
    </Link>
  );
};

export default ProjectCard;