import { ServiceFactory } from "../service/factory";
import * as Mustache from 'mustache';
import { CE_REFRESH } from "../const/constants";
import { ISdkApi } from "../api/api";

export class NiviteInvite {
  private invite = document.getElementById('invite');
  private template = document.getElementById('inviteTemplate');

  constructor(private api: ISdkApi = ServiceFactory.instance().get('api')) {
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
        const photos = document.createElement('div');
        photos.id = "photos";
        if (this.api.invite.photos) {
          for (let photoIndx in this.api.invite.photos) {
            const photo = this.api.invite.photos[photoIndx];
            const photoDOM = document.createElement('img');
            photoDOM.id = 'photo' + photoIndx;
            photoDOM.src = photo.url;
            photoDOM.title = photo.title as string;
            photoDOM.alt = photo.description as string;
            photoDOM.setAttribute('data-tags', photo.tags as string);
            photos.append(photoDOM)
          }
        }
        this.invite.append(photos)
      }
    }
  }
  listen() {
    document.addEventListener(CE_REFRESH, (event) => {
      this.paint();
    });
  }
}