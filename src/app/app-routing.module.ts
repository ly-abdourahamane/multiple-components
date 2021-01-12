import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { FileComponent } from './components/file/file.component';
import { FileListComponent } from './components/file-list/file-list.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: 'about', loadChildren: () => import('./about/about.module').then((m) => m.AboutModule)},
    { path: 'file', component: FileComponent,
      children: [

      ]
    },

    { path: 'file/list', component: FileListComponent },
    { path: '**', component: PageNotFoundComponent, pathMatch: 'full' },
  ]),
  // Fallback when no prior route is matched
  { path: '**', component: PageNotFoundComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
