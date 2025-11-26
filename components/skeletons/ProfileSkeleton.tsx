import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header Skeleton */}
            <div className="bg-white border-b sticky top-0 z-30">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Skeleton className="h-8 w-32" />
                    <div className="flex gap-4">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
            </div>

            {/* Hero / Profile Header Skeleton */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Avatar */}
                        <Skeleton className="w-32 h-32 rounded-full flex-shrink-0" />

                        <div className="flex-1 w-full space-y-4">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-8 w-64" />
                                    <Skeleton className="h-4 w-48" />
                                    <div className="flex gap-2 pt-2">
                                        <Skeleton className="h-6 w-20 rounded-full" />
                                        <Skeleton className="h-6 w-20 rounded-full" />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Skeleton className="h-12 w-32" />
                                    <Skeleton className="h-12 w-12" />
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-8 pt-4 border-t">
                                <div className="space-y-1">
                                    <Skeleton className="h-6 w-16" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <div className="space-y-1">
                                    <Skeleton className="h-6 w-16" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <div className="space-y-1">
                                    <Skeleton className="h-6 w-16" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column - About & Services */}
                    <div className="md:col-span-2 space-y-8">
                        {/* About */}
                        <div className="bg-white p-6 rounded-xl border space-y-4">
                            <Skeleton className="h-6 w-32" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </div>

                        {/* Gallery */}
                        <div className="bg-white p-6 rounded-xl border space-y-4">
                            <Skeleton className="h-6 w-32" />
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <Skeleton className="aspect-square rounded-lg" />
                                <Skeleton className="aspect-square rounded-lg" />
                                <Skeleton className="aspect-square rounded-lg" />
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="bg-white p-6 rounded-xl border space-y-6">
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-10 w-32" />
                            </div>

                            {[1, 2, 3].map((i) => (
                                <div key={i} className="border-b pb-6 last:border-0 last:pb-0 space-y-3">
                                    <div className="flex justify-between">
                                        <div className="flex gap-3">
                                            <Skeleton className="w-10 h-10 rounded-full" />
                                            <div className="space-y-1">
                                                <Skeleton className="h-4 w-24" />
                                                <Skeleton className="h-3 w-16" />
                                            </div>
                                        </div>
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Contact & Map */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl border space-y-4 sticky top-24">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <div className="pt-4 border-t space-y-3">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
