import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './app/environment.prod';
import { enableProdMode } from '@angular/core';

if (environment.production) {
  enableProdMode();
}
fetch('/assets/config/config.json')
  .then(res => res.json())
  .then(config => {
    (window as any).apiUrl = config.apiUrl;
    platformBrowserDynamic().bootstrapModule(AppModule)
      .catch(err => console.error(err));
  })
  .catch(() => {
    (window as any).apiUrl = 'http://localhost:8088/nour';
    platformBrowserDynamic().bootstrapModule(AppModule)
      .catch(err => console.error(err));
  });
