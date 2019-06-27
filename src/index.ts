import '@scss/main.scss'
import { ServiceFactory } from './app/service/factory';
import { ApiService } from './app/service/api.service';
import { CalendarService } from './app/service/calendar.service';
import { NiviteNav } from './app/elements/nav';
import { NiviteRsvpModal } from './app/elements/rsvp';
import { NiviteAtcModal } from './app/elements/atc';

const api = (ServiceFactory.instance().create('api', new ApiService()) as ApiService);
ServiceFactory.instance().create('calendar', new CalendarService());

api.loaded.subscribe((invite) => {
  new NiviteNav();
  new NiviteRsvpModal();
  new NiviteAtcModal();
});