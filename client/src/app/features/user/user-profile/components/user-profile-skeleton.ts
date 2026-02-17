import { Component } from '@angular/core';
import { DashboardNavbar } from '../../../../shared/dashboard-navbar/dashboard-navbar';

@Component({
    selector: 'app-user-profile-skeleton',
    standalone: true,
    imports: [DashboardNavbar],
    template: `
        <div class="min-h-screen animate-pulse">
            <app-dashboard-navbar></app-dashboard-navbar>

            <main class="flex justify-center py-6">
                <div class="max-w-6xl w-full mx-auto px-2 sm:px-4">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div class="lg:col-span-2">
                            <div class="grid grid-cols-1 gap-6">
                                <div
                                    class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                                >
                                    <div class="h-32 sm:h-40 bg-gray-300 relative">
                                        <div class="absolute -bottom-12 left-6">
                                            <div
                                                class="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-300 border-4 border-white shadow-lg"
                                            ></div>
                                        </div>
                                    </div>

                                    <div class="pt-16 pb-4 px-6">
                                        <div class="flex items-start justify-between mb-4">
                                            <div class="flex-1">
                                                <div
                                                    class="h-8 bg-gray-300 rounded w-48 mb-2"
                                                ></div>
                                                <div
                                                    class="h-4 bg-gray-300 rounded w-64 mb-2"
                                                ></div>
                                                <div
                                                    class="h-4 bg-gray-300 rounded w-32 mb-2"
                                                ></div>
                                                <div class="h-4 bg-gray-300 rounded w-40"></div>
                                            </div>
                                            <div class="w-5 h-5 bg-gray-300 rounded"></div>
                                        </div>

                                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                            <div class="h-12 bg-gray-300 rounded-lg"></div>
                                            <div class="h-12 bg-gray-300 rounded-lg"></div>
                                        </div>

                                        <div
                                            class="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mb-6"
                                        >
                                            <div class="flex items-center space-x-3">
                                                <div class="w-5 h-5 bg-gray-300 rounded"></div>
                                                <div class="h-4 bg-gray-300 rounded w-32"></div>
                                            </div>
                                            <div class="flex items-center space-x-3">
                                                <div class="w-5 h-5 bg-gray-300 rounded"></div>
                                                <div class="h-4 bg-gray-300 rounded w-28"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    class="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                                >
                                    <div class="flex items-center justify-between mb-3">
                                        <div class="h-6 bg-gray-300 rounded w-24"></div>
                                        <div class="w-5 h-5 bg-gray-300 rounded"></div>
                                    </div>
                                    <div class="space-y-2">
                                        <div class="h-4 bg-gray-300 rounded w-full"></div>
                                        <div class="h-4 bg-gray-300 rounded w-5/6"></div>
                                        <div class="h-4 bg-gray-300 rounded w-4/5"></div>
                                    </div>
                                </div>

                                <div
                                    class="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                                >
                                    <div class="flex items-center justify-between mb-3">
                                        <div class="h-6 bg-gray-300 rounded w-24"></div>
                                        <div class="w-5 h-5 bg-gray-300 rounded"></div>
                                    </div>
                                    <div class="space-y-4">
                                        <div class="flex items-center space-x-3">
                                            <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
                                            <div class="flex-1">
                                                <div
                                                    class="h-5 bg-gray-300 rounded w-40 mb-1"
                                                ></div>
                                                <div class="h-4 bg-gray-300 rounded w-32"></div>
                                            </div>
                                            <div class="flex items-center space-x-2">
                                                <div class="w-4 h-4 bg-gray-300 rounded"></div>
                                                <div class="w-4 h-4 bg-gray-300 rounded"></div>
                                            </div>
                                        </div>
                                        <div class="flex items-center space-x-3">
                                            <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
                                            <div class="flex-1">
                                                <div
                                                    class="h-5 bg-gray-300 rounded w-40 mb-1"
                                                ></div>
                                                <div class="h-4 bg-gray-300 rounded w-32"></div>
                                            </div>
                                            <div class="flex items-center space-x-2">
                                                <div class="w-4 h-4 bg-gray-300 rounded"></div>
                                                <div class="w-4 h-4 bg-gray-300 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    class="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                                >
                                    <div class="flex items-center justify-between mb-3">
                                        <div class="h-6 bg-gray-300 rounded w-24"></div>
                                        <div class="w-5 h-5 bg-gray-300 rounded"></div>
                                    </div>
                                    <div class="flex flex-wrap gap-2">
                                        <div class="h-8 bg-gray-300 rounded-lg w-20"></div>
                                        <div class="h-8 bg-gray-300 rounded-lg w-24"></div>
                                        <div class="h-8 bg-gray-300 rounded-lg w-16"></div>
                                        <div class="h-8 bg-gray-300 rounded-lg w-28"></div>
                                    </div>
                                </div>

                                <div
                                    class="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                                >
                                    <div class="flex items-center justify-between mb-3">
                                        <div class="h-6 bg-gray-300 rounded w-32"></div>
                                        <div class="w-5 h-5 bg-gray-300 rounded"></div>
                                    </div>
                                    <div class="space-y-2">
                                        <div
                                            class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                                        >
                                            <div class="w-6 h-6 bg-gray-300 rounded"></div>
                                            <div class="h-4 bg-gray-300 rounded flex-1"></div>
                                            <div class="w-4 h-4 bg-gray-300 rounded"></div>
                                        </div>
                                        <div
                                            class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                                        >
                                            <div class="w-6 h-6 bg-gray-300 rounded"></div>
                                            <div class="h-4 bg-gray-300 rounded flex-1"></div>
                                            <div class="w-4 h-4 bg-gray-300 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="lg:col-span-1">
                            <div class="grid grid-cols-1 gap-6">
                                <div
                                    class="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
                                >
                                    <div class="flex items-center justify-between mb-3">
                                        <div class="h-6 bg-gray-300 rounded w-32"></div>
                                        <div class="w-4 h-4 bg-gray-300 rounded"></div>
                                    </div>
                                    <div class="h-4 bg-gray-300 rounded w-16"></div>
                                </div>

                                <div
                                    class="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
                                >
                                    <div class="flex items-center justify-between mb-3">
                                        <div class="h-6 bg-gray-300 rounded w-24"></div>
                                        <div class="w-4 h-4 bg-gray-300 rounded"></div>
                                    </div>
                                </div>

                                <div
                                    class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                                >
                                    <div class="h-48 bg-gray-300"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class="fixed bottom-10 right-8 w-16 h-16 lg:w-[4.5rem] lg:h-[4.5rem] 
                   flex items-center justify-center 
                   lg:right-[calc((100vw-1024px)/2+1rem)] 
                   xl:right-[calc((100vw-1280px)/2+1rem)] 
                   2xl:right-[calc((100vw-1536px)/2+1rem)] 
                   z-3 bg-gray-300 rounded-full border-[1px] border-gray-400"
                >
                    <div class="w-8 h-8 bg-gray-400 rounded"></div>
                </div>
            </main>

            <div
                class="mt-6 md:mt-6 border-t border-gray-400 pt-3 md:pt-3 flex items-center justify-between px-4"
            >
                <div class="h-4 bg-gray-300 rounded w-20"></div>
                <div class="h-5 sm:h-6 w-16 bg-gray-300 rounded"></div>
            </div>
        </div>
    `,
    styles: [
        `
            .animate-pulse {
                animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }

            @keyframes pulse {
                0%,
                100% {
                    opacity: 1;
                }
                50% {
                    opacity: 0.5;
                }
            }
        `,
    ],
})
export class UserProfileSkeletonComponent {}
