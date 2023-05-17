import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexDefaultComponent } from './pages/index/index-default/index-default.component';

const routes: Routes = [
  { path: '', component: IndexDefaultComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
