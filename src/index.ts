import '@scss/main.scss'
import { ServiceFactory } from './app/service/factory';
import { ApiService } from './app/service/api.service';
import { CalendarService } from './app/service/calendar.service';
import { NiviteNav } from './app/elements/nav';
import { NiviteRsvpModal } from './app/elements/rsvp';
import { NiviteAtcModal } from './app/elements/atc';
import { NiviteAlert } from './app/elements/alert';
import { NiviteInvite } from './app/elements/invite';

window.onload = () => {

  const api = (ServiceFactory.instance().create('api', new ApiService()) as ApiService);
  ServiceFactory.instance().create('calendar', new CalendarService());
  new NiviteAlert();
  api.loaded.subscribe((invite) => {
    new NiviteInvite();
    new NiviteNav();
    new NiviteRsvpModal();
    new NiviteAtcModal();
  });
}
