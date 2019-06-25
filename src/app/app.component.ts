import { Component, OnInit, Injector, ApplicationRef, ComponentFactoryResolver } from '@angular/core';
import { NgElement, WithProperties, createCustomElement } from '@angular/elements';
import { NiviteWrapComponent } from './components/nivite-wrap/nivite-wrap.component';
import { HttpClient } from '@angular/common/http';


declare function require(url: string);
const invite = require('../assets/sample.json');

@Component({
  selector: 'nivite-sdk-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'our';
  constructor(private injector: Injector, private httpClient: HttpClient) { }
  ngOnInit() {
    // Convert `PopupComponent` to a custom element.
    const niviteElem = createCustomElement(NiviteWrapComponent, { injector: this.injector });
    // Register the custom element with the browser.
    customElements.define('nivite-wrap', niviteElem);
    // Create element
    const niviteElement: NgElement & WithProperties<NiviteWrapComponent> = document.createElement('nivite-wrap') as any;
    // Listen to the err event and log in console
    niviteElement.addEventListener('err', (msg) => console.log(msg));
    // Set the message
    // niviteElement.invitestr = JSON.stringify(invite);
    // niviteElement.invite = invite;
    // or Set the inviteOid & customerInviteOid - not able to get the HttpClient working
    // niviteElement.inviteOid = '1807175406407';
    // niviteElement.customerInviteOid = '180712f008a48';
    // Add to the DOM
    document.body.appendChild(niviteElement);

    /*
     // Create element
     const niviteElement: HTMLElement = document.createElement('nivite-nav');
     // Create the component and wire it up with the element
     const factory = this.componentFactoryResolver.resolveComponentFactory(NiviteWrapComponent);
     const popupComponentRef = factory.create(this.injector, [], niviteElement);
     // Attach to the view so that the change detector knows to run
     this.applicationRef.attachView(popupComponentRef.hostView);
     // Listen to the close event
     popupComponentRef.instance.closed.subscribe(() => {
       document.body.removeChild(niviteElement);
       this.applicationRef.detachView(popupComponentRef.hostView);
     });
     // Set the message
     popupComponentRef.instance.invite = invite;
     // Add to the DOM
     document.body.appendChild(niviteElement);
     */
  }
}
