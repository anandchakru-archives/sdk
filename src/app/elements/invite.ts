import { ServiceFactory } from "../service/factory";
import { ApiService } from "../service/api.service";
import { CE_REFRESH } from "../const/constants";
import Mustache from "mustache";

type MustacheWaxType = typeof Mustache;
export interface MustacheWaxStatic extends MustacheWaxType { Formatters: any; }
declare var MustacheWax: MustacheWaxStatic;

export class NiviteInvite {
  private invite = document.getElementById('invite');
  private template = document.getElementById('inviteTemplate');

  constructor(private api: ApiService = ServiceFactory.instance().get('api')) {
    if (Mustache) {
      (Mustache as MustacheWaxStatic).Formatters = {
        date: function (str: string) {
          var dt = new Date(parseInt(str.substr(6, str.length - 8), 10));
          return (dt.getDate() + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear());
        }
      };
      this.MustacheApplyWax();
    }
    this.paint();
    this.listen();
  }

  paint() {
    document.body.classList.add('adjustmargin');
    document.title = 'nIvite - ' + this.api.invite.title;
    if (this.invite) {
      if (this.template && Mustache && MustacheWax) {
        this.invite.innerHTML = MustacheWax.render(this.template.innerHTML, this.api.invite);
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
  listen() {
    document.addEventListener(CE_REFRESH, (event) => {
      $('#niviteCalendarModal').modal('show');
    });
  }

  //From: https://github.com/jvitela/mustache-wax
  private MustacheApplyWax() {
    // Copy of the original lookup function of Mustache
    const lookup = Mustache.Context.prototype.lookup;
    Mustache.Context.prototype.lookup = (name: any) => {
      const formatters = name.split("|");
      let expression = formatters && formatters.shift();
      // call original lookup method
      expression = expression && lookup.call(this, expression.trim());
      // Apply the formatters
      for (let i = 0, l = formatters.length; i < l; ++i) {
        expression = this.applyMustacheFilter(expression, formatters[i], lookup.bind(this));
      }
      return expression;
    };

  }
  private parseMustacheParam(param: any, lookup: any) {
    var isString, isInteger, isFloat;
    isString = /^[\'\"](.*)[\'\"]$/g;
    isInteger = /^[+-]?\d+$/g;
    isFloat = /^[+-]?\d*\.\d+$/g;
    if (isString.test(param)) {
      return param.replace(isString, '$1');
    }
    if (isInteger.test(param)) {
      return parseInt(param, 10);
    }
    if (isFloat.test(param)) {
      return parseFloat(param);
    }
    return lookup(param);
  };
  private applyMustacheFilter(expr: any, fltr: any, lookup: any) {
    var filterExp, paramsExp, match, filter, params = [expr];
    filterExp = /^\s*([^\:]+)/g;
    paramsExp = /\:\s*([\'][^\']*[\']|[\"][^\"]*[\"]|[^\:]+)\s*/g;
    match = filterExp.exec(fltr);
    filter = match && match[1].trim();
    while ((match = paramsExp.exec(fltr))) {
      params.push(this.parseMustacheParam(match[1].trim(), lookup));
    }

    if (MustacheWax.Formatters.hasOwnProperty(filter)) {
      fltr = filter && MustacheWax.Formatters[filter];
      return fltr.apply(fltr, params);
    }
    return expr;
  };
}