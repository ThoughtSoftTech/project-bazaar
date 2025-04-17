"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, Sliders } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectGrid from '@/components/ProjectGrid';
import CategoryFilter from '@/components/CategoryFilter';
import { projects as allProjects, Project } from '@/data/projects';
import { Badge } from '@/components/ui/badge';

const Shop = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('category')
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    searchParams.get('subcategory')
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedCategory) {
      params.set('category', selectedCategory);
    }

    if (selectedSubcategory) {
      params.set('subcategory', selectedSubcategory);
    }

    router.push(`?${params.toString()}`);
  }, [selectedCategory, selectedSubcategory, router]);

  // Filter and sort projects
  useEffect(() => {
    let filtered = [...allProjects];

    // Filter by category and subcategory
    if (selectedCategory) {
      filtered = filtered.filter(project => project.category === selectedCategory);

      if (selectedSubcategory) {
        filtered = filtered.filter(project => project.subcategory === selectedSubcategory);
      }
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        project =>
          project.title.toLowerCase().includes(term) ||
          project.description.toLowerCase().includes(term) ||
          project.category.toLowerCase().includes(term) ||
          project.subcategory.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'downloads':
        filtered.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    setFilteredProjects(filtered);
  }, [selectedCategory, selectedSubcategory, searchTerm, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already applied via the useEffect
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="mb-8 text-center">
          <motion.h1
            className="text-4xl font-bold mb-2 text-gradient bg-gradient-to-r from-primary to-accent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Browse Projects
          </motion.h1>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Find the perfect project for your needs from our curated collection of premium templates and code
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile filter toggle */}
          <div className="lg:hidden mb-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            >
              <Filter className="mr-2 h-4 w-4" />
              {mobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          {/* Sidebar with filters */}
          <AnimatePresence>
            {(mobileFiltersOpen || !mobileFiltersOpen) && (
              <motion.div
                className={`${mobileFiltersOpen || !mobileFiltersOpen ? 'block' : 'hidden'} lg:block w-full lg:w-1/4 space-y-6`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="glass-effect card-3d p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center">
                      <Sliders className="mr-2 h-5 w-5 text-primary" />
                      Filters
                    </h2>
                    {(selectedCategory || selectedSubcategory || searchTerm) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-sm hover:text-primary"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>
                  <div className="card-content-fix">
                    <CategoryFilter
                      selectedCategory={selectedCategory}
                      selectedSubcategory={selectedSubcategory}
                      onSelectCategory={setSelectedCategory}
                      onSelectSubcategory={setSelectedSubcategory}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main content */}
          <motion.div
            className="w-full lg:w-3/4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="glass-effect card-3d p-6 rounded-lg mb-6">
              <div className="card-content-fix space-y-4">
                {/* Search and sort controls */}
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search projects..."
                      className="pl-10 focus:ring-2 focus:ring-primary/30 transition-all"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-gradient-vibrant hover:opacity-90 transition-all"
                  >
                    Search
                  </Button>
                </form>

                <div className="flex flex-wrap justify-between items-center">
                  <div className="flex flex-wrap gap-2 items-center">
                    {selectedCategory && (
                      <Badge variant="outline" className="bg-primary/10 hover:bg-primary/15">
                        {selectedCategory}
                        <button
                          className="ml-2 text-xs"
                          onClick={() => setSelectedCategory(null)}
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                    {selectedSubcategory && (
                      <Badge variant="outline" className="bg-accent/10 hover:bg-accent/15">
                        {selectedSubcategory}
                        <button
                          className="ml-2 text-xs"
                          onClick={() => setSelectedSubcategory(null)}
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                    {!selectedCategory && !selectedSubcategory && (
                      <p className="text-muted-foreground text-sm">
                        Showing all projects
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                    <span className="text-sm">Sort by:</span>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[180px] focus:ring-2 focus:ring-primary/30">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="rating">Rating</SelectItem>
                        <SelectItem value="downloads">Popularity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border-t pt-2 text-sm text-muted-foreground">
                  <p>
                    Showing {filteredProjects.length} projects
                  </p>
                </div>
              </div>
            </div>

            {/* Project grid */}
            <ProjectGrid projects={filteredProjects} />

            {filteredProjects.length === 0 && (
              <motion.div
                className="text-center py-12 glass-effect rounded-lg p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No projects found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search term to find more projects
                </p>
                <Button
                  onClick={clearFilters}
                  className="bg-gradient-vibrant hover:opacity-90 transition-all"
                >
                  Reset Filters
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Shop;