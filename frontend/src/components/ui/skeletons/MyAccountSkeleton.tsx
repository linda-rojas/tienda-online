'use client';

import Skeleton from './Skeleton';

export default function MyAccountSkeleton() {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className="w-[50%] shadow-lg p-4 sm:p-6 lg:p-6 rounded-l-lg color-blue-footer-bg">
                <div className="flex justify-center mb-6">
                    <Skeleton className="h-24 w-24 rounded-full bg-white/20" />
                </div>

                <div className="flex flex-col items-center gap-2">
                    <Skeleton className="h-5 w-32 rounded bg-white/20" />
                    <Skeleton className="h-5 w-40 rounded bg-white/20" />
                </div>

                <div className="mt-6 space-y-4">
                    <Skeleton className="h-10 w-full rounded bg-white/20" />
                    <Skeleton className="h-10 w-full rounded bg-white/20" />
                    <Skeleton className="h-10 w-full rounded bg-white/20" />
                </div>

                <div className="mt-12 flex justify-center">
                    <Skeleton className="h-10 w-40 rounded bg-white/20" />
                </div>
            </div>

            {/* Content */}
            <div className="w-3/4 p-3 sm:p-6 lg:p-6 bg-gray-100">
                <Skeleton className="h-6 w-32 rounded bg-gray-200" />

                <div className="mt-4 flex flex-col gap-4 bg-gray-50 p-3 sm:p-5 lg:p-7 rounded-lg shadow">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24 rounded bg-gray-200" />
                        <Skeleton className="h-4 w-64 rounded bg-gray-200" />
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24 rounded bg-gray-200" />
                        <Skeleton className="h-4 w-72 rounded bg-gray-200" />
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24 rounded bg-gray-200" />
                        <Skeleton className="h-4 w-40 rounded bg-gray-200" />
                    </div>
                </div>

                <div className="mt-6">
                    <Skeleton className="h-5 w-28 rounded bg-gray-200" />
                    <div className="mt-3 space-y-3">
                        <Skeleton className="h-24 w-full rounded bg-gray-200" />
                        <Skeleton className="h-24 w-full rounded bg-gray-200" />
                    </div>
                </div>
            </div>
        </div>
    );
}
