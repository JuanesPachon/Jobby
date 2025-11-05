import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'task/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'published-task/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'profile/:id',
    renderMode: RenderMode.Server
  },
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'register',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'login',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'dashboard',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'recovery',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'profile',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'task',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'task-result',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'my-tasks',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'applied-tasks',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'published-tasks',
    renderMode: RenderMode.Prerender
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
