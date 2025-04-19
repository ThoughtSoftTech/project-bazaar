import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Cpu, Code, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-secondary/10 py-12 mt-16 relative overflow-hidden">
      {/* Cyberpunk grid overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(to right, oklch(0.7 0.28 265 / 0.03) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.7 0.28 265 / 0.03) 1px, transparent 1px)`,
        backgroundSize: '30px 30px',
        opacity: 0.4
      }}></div>

      {/* Diagonal lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `linear-gradient(45deg, oklch(0.7 0.28 265 / 0.05) 25%, transparent 25%),
                            linear-gradient(-45deg, oklch(0.7 0.28 265 / 0.05) 25%, transparent 25%)`,
            backgroundSize: '160px 160px',
            opacity: 0.2
          }}
        ></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 cyber-gradient neon-text">
              Project Bazaar
            </h3>
            <p className="text-muted-foreground mb-4">
              Your marketplace for high-quality academic and professional projects.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-foreground hover:text-primary transition-colors">
                <Facebook size={20} className="hover:neon-text" />
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors">
                <Twitter size={20} className="hover:neon-text" />
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors">
                <Instagram size={20} className="hover:neon-text" />
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors">
                <Linkedin size={20} className="hover:neon-text" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <Cpu size={16} className="mr-2 text-primary" />
              <span>Categories</span>
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shop?category=Computer Science" className="text-muted-foreground hover:text-primary transition-colors">
                  Computer Science
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Engineering" className="text-muted-foreground hover:text-primary transition-colors">
                  Engineering
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Management" className="text-muted-foreground hover:text-primary transition-colors">
                  Management
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <Code size={16} className="mr-2 text-primary" />
              <span>Customer Service</span>
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <Globe size={16} className="mr-2 text-primary" />
              <span>Newsletter</span>
            </h4>
            <p className="text-muted-foreground mb-4">
              Subscribe to our newsletter for the latest updates.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-l-md border border-r-0 border-border bg-background/50 w-full glass-effect"
              />
              <Button type="submit" className="rounded-l-none cyber-button">
                <Mail className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-border/30 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Project Bazaar. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
