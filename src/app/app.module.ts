import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, DoBootstrap } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { NiviteWrapComponent } from './components/nivite-wrap/nivite-wrap.component';
import { createCustomElement, WithProperties, NgElement } from '@angular/elements';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IInviteDB, NIVITE_NAV } from './pojos/invite';

const routes: Routes = [
  { path: '**', component: AppComponent }
];

declare global {
  interface HTMLElementTagNameMap {
    'nivite-wrap': NgElement & WithProperties<{ invite: IInviteDB, inviteOid: string, customerInviteOid: string }>;
  }
}

@NgModule({
  declarations: [AppComponent, NiviteWrapComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  entryComponents: [NiviteWrapComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector) { }
  ngDoBootstrap() {
    if (!customElements.get(NIVITE_NAV)) {
      customElements.define(NIVITE_NAV, createCustomElement(NiviteWrapComponent, { injector: this.injector }));
    }
  }
}
