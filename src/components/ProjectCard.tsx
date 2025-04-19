"use client";
import React, { memo, useCallback, useState } from 'react';
import Link from 'next/link';
import { Star, ShoppingCart, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { Project } from '@/data/projects';
import Card3D from '@/components/ui/card3d';

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
  index?: number; // For staggered animations
}

const ProjectCard = memo(({ project, featured = false, index = 0 }: ProjectCardProps) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  // Memoize the handleAddToCart function
  const handleAddToCart = useCallback(() => {
    console.log(`Adding project to cart: ${project.id}`);
    addToCart({
      id: project.id,
      title: project.title,
      price: project.price,
      category: project.category,
      image: project.image
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000); // Reset after 2 seconds
  }, [addToCart, project]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Card3D className="h-full bg-gradient-to-br from-background via-background to-secondary/5 border border-border group">
        <div className="flex flex-col h-full">
          {/* Image Section */}
          <div className="relative overflow-hidden rounded-t-lg">
            <motion.img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            {/* Glass overlay with subcategory */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm p-2 flex justify-between items-center">
              <Badge variant="outline" className="bg-background/50 backdrop-blur-sm border-primary/20 border">
                {project.subcategory}
              </Badge>
              {project.rating && (
                <div className="flex items-center text-white">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-xs font-medium">{project.rating}</span>
                </div>
              )}
            </div>
            {featured && (
              <Badge className="absolute top-2 right-2 bg-primary/90 backdrop-blur-sm shadow-lg neon-border">
                Featured
              </Badge>
            )}

            {/* Cyberpunk overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Content Section */}
          <div className="p-4 flex flex-col flex-grow">
            {/* Title */}
            <h3 className="font-semibold text-lg line-clamp-1 mb-2 group-hover:text-primary transition-colors">
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {project.description}
            </p>

            {/* Price and Downloads */}
            <div className="flex justify-between items-center mb-4 mt-auto">
              <div className="text-sm text-muted-foreground">
                {project.downloads} downloads
              </div>
              <motion.span
                className="font-bold text-lg cyber-gradient"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                ₹{project.price.toFixed(2)}
              </motion.span>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 group glass-effect backdrop-blur-sm"
                asChild
              >
                <Link href={`/projectdetails/${project.id}`}>
                  <span className="flex items-center">
                    View Details
                    <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:text-primary transition-colors" />
                    </motion.span>
                  </span>
                </Link>
              </Button>
              <motion.button
                type="button"
                className={`flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-9 px-4 py-2 whitespace-nowrap overflow-hidden ${isAdded ? 'bg-blue-900 text-white border-blue-900' : 'cyber-button'}`}
                onClick={handleAddToCart}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                disabled={isAdded}
              >
                <AnimatePresence mode="wait">
                  {isAdded ? (
                    <motion.span
                      key="added"
                      className="flex items-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Check className="h-4 w-4 mr-1" /> Added
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      className="flex items-center"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" /> Add to cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </Card3D>
    </motion.div>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;