"use client";
import React, { memo, useCallback } from 'react';
import Link from 'next/link';
import { Star, ShoppingCart, Eye, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { Project } from '@/data/projects';

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

const ProjectCard = memo(({ project, featured = false }: ProjectCardProps) => {
  const { addToCart } = useCart();

  // Memoize the handleAddToCart function
  const handleAddToCart = useCallback(() => {
    console.log(`Adding project to cart: ${project.id}`);
    addToCart({
      id: project.id,
      title: project.title,
      price: project.price,
      category: project.category,
      subcategory: project.subcategory,
      image: project.image,
    });
  }, [addToCart, project]);

  return (
    <div
      className={`bg-card rounded-lg overflow-hidden border border-border shadow-sm transition-all duration-300 hover:shadow-md ${featured ? 'scale-in' : 'fade-in'
        }`}
    >
      {/* Image Section */}
      <div className="relative">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-48 object-cover"
        />
        {featured && (
          <Badge className="absolute top-2 right-2 bg-primary">Featured</Badge>
        )}
      </div>
      {/* Content Section */}
      <div className="p-4">
        {/* Title and Subcategory */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">
            {project.title}
          </h3>
          <Badge variant="outline">{project.subcategory}</Badge>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Rating and Price */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">
              {project.rating} ({project.downloads} downloads)
            </span>
          </div>
          <span className="font-bold text-lg">
            Rs {project.price.toFixed(2)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/projectdetails/${project.id}`}>
              <span className="flex items-center">
                View Details <ArrowRight className="ml-2 h-4 w-4"/>
              </span>
            </Link>
          </Button>
          <Button size="sm" className="flex-1" onClick={handleAddToCart}>
            <ShoppingCart className="h-4 w-4 mr-2" /> Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
});

// Add display name to fix ESLint warning
ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;