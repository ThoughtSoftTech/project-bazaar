
import React from 'react';
import ProjectCard from './ProjectCard';
import { Project } from '@/data/projects';

interface ProjectGridProps {
  projects: Project[];
  featured?: boolean;
  isLoading?: boolean;
}

const ProjectGrid = ({ projects, featured = false, isLoading = false }: ProjectGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div 
            key={index} 
            className="border border-border rounded-lg p-4 h-64 animate-pulse bg-muted"
          />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No projects found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} featured={featured && project.featured} />
      ))}
    </div>
  );
};

export default ProjectGrid;
