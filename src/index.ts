import '@scss/main.scss'
import { ServiceFactory } from './app/service/factory';
import { ApiService } from './app/service/api.service';
import { CalendarService } from './app/service/calendar.service';
import { NiviteNav } from './app/elements/nav';
import { NiviteRsvpModal } from './app/elements/rsvp';
import { NiviteAtcModal } from './app/elements/atc';
import { IInviteDB } from './app/pojo/invite';
import { CE_LOADED } from './app/const/constants';
import { NiviteAlert } from './app/elements/alert';

window.onload = () => {

  const api = (ServiceFactory.instance().create('api', new ApiService()) as ApiService);
  ServiceFactory.instance().create('calendar', new CalendarService());
  new NiviteAlert();
  api.loaded.subscribe((invite) => {
    new NiviteNav();
    new NiviteRsvpModal();
    new NiviteAtcModal();
  });

  /** For outside invite to listen to for the data and render the invite **/
  document.addEventListener(CE_LOADED, (event) => {
    document.body.classList.add('adjustmargin');
    const invite = (((event as CustomEvent).detail) as IInviteDB);
    if (invite && invite.title) {
      document.title = 'nIvite - ' + invite.title;
    }
  });
}
