import Image from "next/image";
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Award, Download, Clock, ChevronDown } from 'lucide-react';
import ProjectGrid from '@/components/ProjectGrid';
import { getFeaturedProjects, categories } from '@/data/projects';
import Link from 'next/link';

export default function Home() {

  const featuredProjects = getFeaturedProjects();

  return (
    <div>

      {/* Hero Section */}
      <section className="py-10 md:py-24 sm:px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 fade-in">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Make My Project
                </span>{' '}
                <span className="text-muted-foreground">Your One-Stop Solution</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Browse our extensive collection of high-quality academic and professional projects to kickstart your next endeavor.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild className="hover-scale">
                  <Link href="/shop">Browse Projects <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/">Custom Project</Link>
                </Button>
              </div>
              <div className="flex items-center space-x-4 text-muted-foreground">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span>500+ Happy Customers</span>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/30 to-accent/30 rounded-2xl p-6 animate-float">
                <img
                  src="/project.png"
                  alt="Project Display"
                  className="rounded-lg shadow-lg w-full h-auto scale-in"
                />
              </div>
              <div className="absolute top-5 -right-4 bg-card rounded-lg p-3 shadow-lg border border-border animate-pulse-light">
                <Award className="h-8 w-8 text-primary" />
                <p className="text-xs font-medium mt-1">Top Quality</p>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-card rounded-lg p-3 shadow-lg border border-border animate-pulse-light">
                <Download className="h-8 w-8 text-accent" />
                <p className="text-xs font-medium mt-1">Easy Download</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our wide range of project categories to find exactly what you need for your next venture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.name}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-all duration-300 hover-lift fade-in"
              >
                <h3 className="text-xl font-semibold mb-4">{category.name}</h3>
                <ul className="space-y-2">
                  {category.subcategories.map((subcategory) => (
                    <li key={subcategory}>
                      <Link
                        href={`/shop?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(subcategory)}`}
                        className="text-muted-foreground hover:text-primary transition-colors flex items-center"
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        {subcategory}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Button
                  variant="ghost"
                  className="mt-4 w-full bg-primary"
                  asChild
                >
                  <Link href={`/shop?category=${encodeURIComponent(category.name)}`}>
                    View All {category.name} Projects
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold">Featured Projects</h2>
              <p className="text-muted-foreground mt-2">Our hand-picked selection of quality projects</p>
            </div>
            <Button asChild>
              <Link href="/shop">View All Projects</Link>
            </Button>
          </div>

          <ProjectGrid projects={featuredProjects} featured={true} />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started with Make My Project in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Browse & Select",
                description: "Explore our extensive collection and find the perfect project for your needs.",
                icon: "🔍"
              },
              {
                title: "Customize If Needed",
                description: "Request specific customizations to tailor the project to your requirements.",
                icon: "✏️"
              },
              {
                title: "Purchase & Download",
                description: "Complete your purchase and get instant access to download your projects.",
                icon: "💾"
              }
            ].map((step, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-md transition-all duration-300 hover-lift fade-in"
              >
                <div className="text-3xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from students and professionals who have used our projects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Satyam Kharwar",
                role: "Computer Science Student",
                quote: "The web development project I purchased saved me countless hours of work. The code was well-documented and easy to understand.",
                rating: 5
              },
              {
                name: "Nikhil Kumar",
                role: "Project Manager",
                quote: "I used the management dashboard for my team's project tracking. The customization option allowed me to tailor it perfectly to our needs.",
                rating: 4
              },
              {
                name: "Priya Sharma",
                role: "Engineering Professional",
                quote: "The engineering calculation tool was exactly what I needed for my work. The support team was also very helpful with my questions.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-all duration-300 fade-in"
              >
                <div className="flex mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/10 rounded-lg mx-6 my-8">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Browse our collection of projects and find the perfect one for your needs today.
          </p>
          <Button size="lg" asChild className="hover-scale">
            <Link href="/shop">Explore Projects <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16" id="faq">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our projects and services
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "Are the projects ready to use?",
                answer: "Yes, all our projects are fully functional and ready to use. Some may require minor setup or configuration based on your specific environment."
              },
              {
                question: "Can I request customizations?",
                answer: "Absolutely! During checkout, you can provide detailed customization requests in the provided text area for each item in your cart."
              },
              {
                question: "How do I download my purchased projects?",
                answer: "After successful payment, you'll receive immediate access to download your purchased projects from your account dashboard."
              },
              {
                question: "Do you offer refunds?",
                answer: "We offer refunds within 7 days of purchase if the project doesn't match the description or has significant technical issues that cannot be resolved."
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg overflow-hidden fade-in"
              >
                <details className="group">
                  <summary className="flex justify-between items-center p-4 cursor-pointer">
                    <h3 className="font-medium">{faq.question}</h3>
                    <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-4 pb-4 text-muted-foreground">
                    <p>{faq.answer}</p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
