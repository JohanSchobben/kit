import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {KIT_TOOLTIP_OPTIONS } from "ng-kit/tooltip";
import {provideAnimations} from "@angular/platform-browser/animations";

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    {
      provide: KIT_TOOLTIP_OPTIONS,
      useValue: {
        className: "bye"
      }
    },
  ]
};
