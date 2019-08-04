import '@scss/main.scss'
import { ServiceFactory } from './app/service/factory';
import { CalendarService } from './app/service/calendar.service';
import { NiviteNav } from './app/elements/nav';
import { NiviteRsvpModal } from './app/elements/rsvp';
import { NiviteAtcModal } from './app/elements/atc';
import { NiviteAlert } from './app/elements/alert';
import { NiviteInvite } from './app/elements/invite';
import { ISdkApi } from './app/api/api';
import { FirebaseSdkApi } from './app/api/firebase.api';

window.addEventListener('load', () => {

  const plugin = new URL(window.location.href).searchParams.get('plug');          // [optional] Default - firebase, work in progress for api.nivite.com, github.com

  const sdkApi = () => {
    if (!plugin) {
      return new FirebaseSdkApi();
    } else if (plugin === 'nivite') {
      return undefined;                 // TODO: implements SdkPlugin for nivite
    } else if (plugin === 'github') {
      return undefined;                 // TODO: implements SdkPlugin for github
    }
  }

  ServiceFactory.instance().create('calendar', new CalendarService());
  const api = (ServiceFactory.instance().create('api', sdkApi()) as ISdkApi);
  new NiviteAlert();
  api.loaded.subscribe((invite) => {
    new NiviteInvite();
    new NiviteNav();
    new NiviteRsvpModal();
    new NiviteAtcModal();
  });
  api.getInviteFromDB();
}, false);