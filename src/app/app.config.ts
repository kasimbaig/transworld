import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts'; // Add this import
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    // provideCharts(withDefaultRegisterables()), // Add this line
    provideAnimations(),

    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
  ],
};
