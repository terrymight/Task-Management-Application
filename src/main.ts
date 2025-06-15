import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/features/home/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
