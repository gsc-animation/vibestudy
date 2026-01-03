'use client';

import { ParentInsightCard } from '@/components/dashboard/ParentInsightCard';
import { ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';

export default function ParentDashboardPage() {
  // In production, get childId from auth context or URL params
  const childId = 'child-123';
  const childName = 'Alex';

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-white rounded-full transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {childName}&apos;s Learning Journey
              </h1>
              <p className="text-gray-500 text-sm">Parent Dashboard</p>
            </div>
          </div>
        </div>

        {/* Insight Card */}
        <ParentInsightCard childId={childId} />

        {/* Additional sections can be added here */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-4">📊 Activity Timeline</h3>
          <p className="text-gray-500 text-sm">
            Detailed activity timeline coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
