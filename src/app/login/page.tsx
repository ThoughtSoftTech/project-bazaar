"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { fetchAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        // Check if the user just registered
        const justRegistered = searchParams.get('registered');
        if (justRegistered === 'true') {
            setSuccessMessage('Account created successfully! Please log in.');
        }
    }, [searchParams]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError('');
        setSuccessMessage('');

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const response = await fetchAPI('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            // Use AuthContext login function instead of directly setting localStorage
            login(response.token, response.user);

            // Redirect to home page or dashboard
            router.push('/');
        } catch (error) {
            console.error('Login error:', error);
            if (error instanceof Error) {
                setServerError(error.message);
            } else if (typeof error === 'object' && error && 'message' in error) {
                setServerError(String(error.message));
            } else {
                setServerError('Invalid email or password');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-6 py-12 flex justify-center">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {serverError && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{serverError}</AlertDescription>
                        </Alert>
                    )}

                    {successMessage && (
                        <Alert className="mb-4 bg-green-50 border-green-200">
                            <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            {errors.email && <span className="text-sm text-red-500">{errors.email}</span>}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            {errors.password && <span className="text-sm text-red-500">{errors.password}</span>}
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="text-primary hover:underline">
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default LoginPage;