import { ServiceFactory } from "../service/factory";
import { ApiService } from "../service/api.service";
import * as Mustache from 'mustache';

export class NiviteInvite {
  private invite = document.getElementById('invite');
  private template = document.getElementById('inviteTemplate');

  constructor(private api: ApiService = ServiceFactory.instance().get('api')) {
    this.paint();
    this.listen();
  }
  paint() {
    document.body.classList.add('adjustmargin');
    document.title = 'nIvite - ' + this.api.invite.title;
    if (this.invite) {
      if (this.template && Mustache) {
        this.invite.innerHTML = Mustache.render(this.template.innerHTML, this.api.invite);
      } else {
        this.invite.innerHTML = `
          <div id="title">${this.api.invite.title}</div>
          <div id="shortMsg">${this.api.invite.shortMsg}</div>
          <div id="longMsg">${this.api.invite.longMsg}</div>
          <div id="addr">
            <div id="addrName">${this.api.invite.addrName}</div>
            <div id="addrText">${this.api.invite.addrText}</div>
          </div>
          <div id="time">
            <div id="timeFrom">${this.api.invite.timeFrom}</div>
            <div id="timeTo">${this.api.invite.timeTo}</div>
          </div>
        `;
      }
    }
  }
  listen() { }
}