"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ className = "" }: { className?: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={`btn btn-outline btn-sm ${className}`}
      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', alignSelf: 'flex-start' }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
      Back
    </button>
  );
}
