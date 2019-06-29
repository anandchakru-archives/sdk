import '@scss/main.scss'
import { ServiceFactory } from './app/service/factory';
import { ApiService } from './app/service/api.service';
import { CalendarService } from './app/service/calendar.service';
import { NiviteNav } from './app/elements/nav';
import { NiviteRsvpModal } from './app/elements/rsvp';
import { NiviteAtcModal } from './app/elements/atc';
import { IInviteDB } from './app/pojo/invite';

window.onload = () => {

  const api = (ServiceFactory.instance().create('api', new ApiService()) as ApiService);
  ServiceFactory.instance().create('calendar', new CalendarService());

  api.loaded.subscribe((invite) => {
    new NiviteNav();
    new NiviteRsvpModal();
    new NiviteAtcModal();
  });

  /** For outside invite to listen to for the data and render the invite **/
  document.addEventListener('niviteLoaded', (event) => {
    const invite = (((event as CustomEvent).detail) as IInviteDB);
    console.log('Go render this invite to your heart\'s content');
  });
}
