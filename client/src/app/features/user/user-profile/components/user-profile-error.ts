import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DashboardNavbar } from '../../../../shared/dashboard-navbar/dashboard-navbar';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-user-profile-error',
    standalone: true,
    imports: [DashboardNavbar, RouterLink],
    template: `
        <div class="min-h-screen flex flex-col">
            <app-dashboard-navbar></app-dashboard-navbar>

            <main class="flex-1 flex justify-center py-6">
                <div class="max-w-4xl w-full mx-auto px-4 sm:px-6">
                    <div class="flex flex-col items-center justify-center h-full">
                        <div
                            class="bg-white rounded-xl shadow-lg border border-black p-8 w-full max-w-md text-center"
                        >
                            <div
                                class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6"
                            >
                                <svg
                                    class="h-8 w-8 text-red-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.382 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    />
                                </svg>
                            </div>

                            <h2 class="text-2xl font-bold text-gray-900 mb-3">
                                ¡Oops! Algo salió mal
                            </h2>

                            <p class="text-gray-600 text-base mb-6 leading-relaxed">
                                {{ errorMessage }}
                            </p>

                            <div
                                class="space-y-3 sm:space-y-0 sm:space-x-3 sm:flex sm:justify-center"
                            >
                                <button
                                    (click)="onRetry()"
                                    class="w-full sm:w-auto bg-main-blue text-white px-6 py-3 rounded-full border border-black cursor-pointer font-medium 
                         hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                         transition-all duration-200 flex items-center justify-center space-x-2"
                                >
                                    <svg
                                        class="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        />
                                    </svg>
                                    <span>Reintentar</span>
                                </button>

                                <a
                                    [routerLink]="'/dashboard'"
                                    class="w-full sm:w-auto bg-white text-black px-6 py-3 rounded-full border border-black cursor-pointer font-medium 
                         hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 
                         transition-all duration-200 flex items-center justify-center space-x-2"
                                >
                                    <svg
                                        class="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                        />
                                    </svg>
                                    <span>Volver al Dashboard</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    class="fixed bottom-10 right-8 w-16 h-16 lg:w-[4.5rem] lg:h-[4.5rem] 
                       flex items-center justify-center 
                       lg:right-[calc((100vw-1024px)/2+1rem)] 
                       xl:right-[calc((100vw-1280px)/2+1rem)] 
                       2xl:right-[calc((100vw-1536px)/2+1rem)] 
                       z-3 bg-[#EBC636] p-2 rounded-full border-[1px] border-black 
                       hover:bg-yellow-500 transition-colors duration-200"
                >
                    <img class="w-8 h-8" src="/icons/help_icon.svg" alt="Botón de ayuda" />
                </button>
            </main>

            <footer
                class="border-t border-gray-400 pt-3 pb-3 flex items-center justify-between px-4"
            >
                <p class="text-xs md:text-xs text-black">© ADSO - 2025</p>
                <img
                    src="/images/LOGO/png_sin_fondo/fondo_blanco.png"
                    alt="Jobby Logo"
                    class="h-5 sm:h-6"
                />
            </footer>
        </div>
    `,
})
export class UserProfileErrorComponent {
    @Input() errorMessage: string = '';
    @Output() retry = new EventEmitter<void>();

    onRetry() {
        this.retry.emit();
    }
}
