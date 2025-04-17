"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Mail, User, ShoppingCart, UserPlus, Check, ShieldCheck } from 'lucide-react';
import { fetchAPI } from '@/lib/api';

const SignupPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [formCompletion, setFormCompletion] = useState(0);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        // Update form completion percentage
        const filledFields = Object.values(formData).filter(field => field.trim() !== '').length;
        setFormCompletion(Math.round((filledFields / 4) * 100));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError('');

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await fetchAPI('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            router.push('/login?registered=true');
        } catch (error) {
            console.error('Registration error:', error);
            if (error instanceof Error) {
                setServerError(error.message);
            } else if (typeof error === 'object' && error && 'message' in error) {
                setServerError(String(error.message));
            } else {
                setServerError('Registration failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-accent/10 p-4">
            <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
                {/* Left side - decorative illustration/branding */}
                <motion.div
                    className="hidden md:flex flex-col justify-center items-center p-8"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="relative">
                        <motion.div
                            className="absolute -top-6 -right-6 w-28 h-28 bg-accent/20 rounded-full blur-sm"
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, -10, 0]
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        <motion.div
                            className="absolute -bottom-8 -left-8 w-24 h-24 bg-primary/20 rounded-full blur-sm"
                            animate={{
                                scale: [1, 1.15, 1],
                                rotate: [0, 10, 0]
                            }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 1
                            }}
                        />

                        <motion.div
                            className="absolute top-20 right-10 w-16 h-16 bg-gradient-cool opacity-30 rounded-full blur-md"
                            animate={{
                                scale: [1, 1.2, 1],
                                x: [0, 15, 0]
                            }}
                            transition={{
                                duration: 7,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.5
                            }}
                        />

                        <div className="relative z-10 mb-8">
                            {/* Enhanced Project Bazaar Branding */}
                            <div className="flex items-center mb-8">
                                <div className="bg-gradient-vibrant p-4 rounded-xl shadow-lg mr-4 glow-effect">
                                    <ShoppingCart size={28} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-extrabold text-gradient bg-gradient-to-r from-primary via-accent to-primary">
                                        Project Bazaar
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-1">Your marketplace for premium projects</p>
                                </div>
                            </div>

                            <h1 className="text-4xl font-bold mb-4 text-gradient bg-gradient-to-r from-primary to-accent">
                                Join Project Bazaar
                            </h1>
                            <p className="text-muted-foreground max-w-md">
                                Create an account to explore and purchase high-quality projects for your portfolio or business needs.
                            </p>
                        </div>

                        <div className="mt-8 space-y-4 relative z-10 staggered-fade-in">
                            <div className="flex items-center space-x-3">
                                <div className="bg-gradient-cool p-2 rounded-full shadow-md">
                                    <Check className="h-5 w-5 text-white" />
                                </div>
                                <p className="text-sm">Access exclusive project collections</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="bg-gradient-warm p-2 rounded-full shadow-md">
                                    <ShieldCheck className="h-5 w-5 text-white" />
                                </div>
                                <p className="text-sm">Secure payment and download process</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="bg-gradient-vibrant p-2 rounded-full shadow-md">
                                    <ArrowRight className="h-5 w-5 text-white" />
                                </div>
                                <p className="text-sm">Request customization for your needs</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right side - signup form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {/* Mobile Logo for small screens */}
                    <div className="md:hidden flex justify-center mb-6">
                        <div className="flex items-center">
                            <div className="bg-gradient-vibrant p-3 rounded-xl shadow-md mr-3 glow-effect">
                                <ShoppingCart size={20} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gradient bg-gradient-to-r from-primary to-accent">
                                Project Bazaar
                            </h2>
                        </div>
                    </div>

                    <Card className="border-none shadow-lg glass-effect card-3d">
                        <CardHeader className="space-y-2">
                            <div className="flex justify-center mb-2">
                                <div className="bg-gradient-vibrant p-3 rounded-full shadow-md">
                                    <User className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
                            <CardDescription className="text-center">
                                Enter your information to get started
                            </CardDescription>

                            {/* Form completion progress bar with enhanced styling */}
                            <div className="mt-4">
                                <div className="w-full bg-muted/50 h-1.5 rounded-full overflow-hidden backdrop-blur-sm">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-primary to-accent"
                                        initial={{ width: "0%" }}
                                        animate={{ width: `${formCompletion}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                                <div className="flex justify-end mt-1">
                                    <span className="text-xs text-muted-foreground">{formCompletion}% complete</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {serverError && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Alert variant="destructive" className="mb-4">
                                        <AlertDescription>{serverError}</AlertDescription>
                                    </Alert>
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                            className="pl-10 focus:ring-2 focus:ring-primary/50 transition-all"
                                        />
                                    </div>
                                    {errors.name && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-sm text-destructive"
                                        >
                                            {errors.name}
                                        </motion.span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                            className="pl-10 focus:ring-2 focus:ring-primary/50 transition-all"
                                        />
                                    </div>
                                    {errors.email && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-sm text-destructive"
                                        >
                                            {errors.email}
                                        </motion.span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                            className="pl-10 focus:ring-2 focus:ring-primary/50 transition-all"
                                        />
                                    </div>
                                    {errors.password && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-sm text-destructive"
                                        >
                                            {errors.password}
                                        </motion.span>
                                    )}
                                    {formData.password && formData.password.length > 0 && (
                                        <div className="mt-1 flex space-x-1">
                                            <div className={`h-1 flex-1 rounded-full ${formData.password.length < 6 ? 'bg-destructive/80' : formData.password.length < 10 ? 'bg-gradient-warm' : 'bg-gradient-cool'}`}></div>
                                            <div className={`h-1 flex-1 rounded-full ${formData.password.length < 8 ? 'bg-muted' : formData.password.length < 10 ? 'bg-gradient-warm' : 'bg-gradient-cool'}`}></div>
                                            <div className={`h-1 flex-1 rounded-full ${formData.password.length < 10 ? 'bg-muted' : 'bg-gradient-cool'}`}></div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                            className="pl-10 focus:ring-2 focus:ring-primary/50 transition-all"
                                        />
                                    </div>
                                    {errors.confirmPassword && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-sm text-destructive"
                                        >
                                            {errors.confirmPassword}
                                        </motion.span>
                                    )}
                                </div>

                                <motion.div
                                    className="pt-2"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-vibrant hover:opacity-90 transition-all shadow-md"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Creating account...
                                            </div>
                                        ) : 'Sign Up'}
                                    </Button>
                                </motion.div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-center border-t border-border/30 pt-4 bg-muted/30 backdrop-blur-sm">
                            <p className="text-sm text-muted-foreground text-center">
                                Already have an account?{' '}
                                <Link href="/login" className="text-primary font-medium hover:text-accent hover:underline transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default SignupPage;