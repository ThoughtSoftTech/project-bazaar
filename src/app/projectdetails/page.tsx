"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProjectDetails() {
  const router = useRouter();

  // Redirect to shop page after a short delay
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/shop');
    }, 2000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="container mx-auto px-6 py-16 text-center">
      <h1 className="text-2xl font-bold mb-4">Project Details</h1>
      <p className="text-muted-foreground mb-8">
        Please select a specific project to view its details.
        You'll be redirected to the shop page in a few seconds.
      </p>
      <Button asChild>
        <Link href="/shop">Browse Projects</Link>
      </Button>
    </div>
  );
}
