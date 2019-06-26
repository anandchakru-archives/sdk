import { Component, OnInit, Injector, ApplicationRef, ComponentFactoryResolver } from '@angular/core';
import { NgElement, WithProperties, createCustomElement } from '@angular/elements';
import { NiviteWrapComponent } from './components/nivite-wrap/nivite-wrap.component';
import { HttpClient } from '@angular/common/http';
import { IInviteDB, NIVITE_NAV } from './pojos/invite';

@Component({
  selector: 'nivite-sdk-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private injector: Injector, private http: HttpClient) { }
  ngOnInit() {
    // Convert `NiviteWrapComponent` to a custom element and Register it with the browser.
    customElements.define(NIVITE_NAV, createCustomElement(NiviteWrapComponent, { injector: this.injector }));
    // Create element
    const niviteElement: NgElement & WithProperties<NiviteWrapComponent> = document.createElement(NIVITE_NAV) as any;
    // Set @Input items
    this.http.get<IInviteDB>('https://nivite.github.io/sdk/dist/elements/test/sample.json').subscribe((invite: IInviteDB) => {
      // niviteElement.inviteStr = JSON.stringify(invite);
      // Listen to the @Output events
      niviteElement.inviteStr = JSON.stringify(invite);

      niviteElement.addEventListener('err', (ce: CustomEvent) => {
        console.log(ce.detail);
      });
      niviteElement.addEventListener('loaded', (ce: CustomEvent) => {
        console.log(ce.detail);
      });
      // Add to the DOM
      document.body.appendChild(niviteElement);
    });
  }
}
