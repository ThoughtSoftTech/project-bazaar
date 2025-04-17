"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingCart, Sun, Moon, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation variants
  const navbarVariants = {
    top: {
      backgroundColor: "rgba(var(--background-rgb), 0.5)",
      backdropFilter: "blur(5px)",
      borderBottom: "1px solid rgba(var(--border-rgb), 0.1)",
      boxShadow: "0 0 0 rgba(0, 0, 0, 0)"
    },
    scrolled: {
      backgroundColor: "rgba(var(--background-rgb), 0.8)",
      backdropFilter: "blur(10px)",
      borderBottom: "1px solid rgba(var(--border-rgb), 0.2)",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)"
    }
  };

  // Link animation on hover
  const linkHover = {
    scale: 1.05,
    y: -2,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  };

  return (
    <motion.nav
      className={`sticky top-0 z-50 transition-all duration-300 px-6 py-4 ${scrolled ? 'py-2' : 'py-4'
        }`}
      variants={navbarVariants}
      initial="top"
      animate={scrolled ? "scrolled" : "top"}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <motion.div
            className="flex items-center space-x-2 overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <span className="text-2xl font-bold text-black">
              Project Bazaar
            </span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <NavigationMenu>
            <NavigationMenuList>
              {["Home", "Shop", "Custom Project"].map((item, i) => (
                <NavigationMenuItem key={i}>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle() + " relative overflow-hidden group"}
                    asChild
                  >
                    <Link href={i === 0 ? "/" : i === 1 ? "/shop" : "/custom"}>
                      <motion.span whileHover={linkHover}>
                        {item}
                        <motion.span
                          className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full transform scale-x-0 origin-left"
                          initial={{ scaleX: 0 }}
                          whileHover={{ scaleX: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }}>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full glass-effect"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </motion.div>

          <Link href="/cart" className="relative">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="icon" className="rounded-full glass-effect">
                <ShoppingCart className="h-5 w-5" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      className="absolute -top-1 -right-1 bg-cart-bubble text-white text-xs rounded-full h-7 w-7 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </Link>

          {/* Conditional rendering based on authentication status */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" className="gap-2 glass-effect">
                    <User className="h-4 w-4" />
                    {user?.name?.split(' ')[0]}
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-effect border border-border/30 backdrop-blur-lg">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" className="glass-effect">
                    Login
                  </Button>
                </motion.div>
              </Link>

              <Link href="/signup">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="sm" className="glow-effect">Sign Up</Button>
                </motion.div>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="flex md:hidden items-center space-x-2">
          <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }}>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </motion.div>

          <Link href="/cart" className="relative">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="icon" className="rounded-full">
                <ShoppingCart className="h-5 w-5" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      className="absolute -top-1 -right-1 bg-cart-bubble text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </Link>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMenuOpen ? 'close' : 'open'}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.div>
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 bg-background/90 backdrop-blur-lg border-b p-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <motion.div
              className="flex flex-col space-y-3 staggered-fade-in"
            >
              {["Home", "Browse Projects", "Custom Project"].map((item, i) => (
                <Link
                  key={i}
                  href={i === 0 ? "/" : i === 1 ? "/shop" : "/custom"}
                  className="text-foreground hover:text-primary transition-all py-2 hover:pl-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <motion.span
                    className="block"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {item}
                  </motion.span>
                </Link>
              ))}

              {/* Conditional rendering for mobile menu */}
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className="text-foreground hover:text-primary transition-all py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <motion.span whileHover={{ x: 5 }}>Profile</motion.span>
                  </Link>
                  <Link
                    href="/orders"
                    className="text-foreground hover:text-primary transition-all py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <motion.span whileHover={{ x: 5 }}>My Orders</motion.span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center text-red-500 hover:text-red-600 transition-all py-2 text-left"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <motion.span whileHover={{ x: 5 }}>Logout</motion.span>
                  </button>
                </>
              ) : (
                <motion.div
                  className="flex space-x-2 pt-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link
                    href="/login"
                    className="w-1/2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button variant="outline" className="w-full glass-effect">Login</Button>
                  </Link>
                  <Link
                    href="/signup"
                    className="w-1/2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button className="w-full glow-effect">Sign Up</Button>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
