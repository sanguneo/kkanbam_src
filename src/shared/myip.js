import axios from 'axios';

window.onOffice = {
  /* eslint-disable */
  get ip() {
    return this._ip || '';
  },
  set ip(ipAddress) {
    this.changed = this._ip !== ipAddress;
    this._ip = ipAddress;
    this.office = ipAddress === '211.192.187.65' || ipAddress === '58.151.93.66';
    this.callback();
    this.swcallback();
  },
  office: false,
  changed: false,
  callback(json = this.toJSON()) {
    console.log(json);
  },
  swcallback(json = this.toJSON()) {
    console.log(json);
  },
  toString() {
    return String(this.ip);
  },
  toJSON() {
    return {
      ip: this.ip,
      office: this.office,
      changed: this.changed,
    };
  },
  // real values below
  _ip: '',
};

export const ifconfig = () => axios.get('https://myexternalip.com/json').then(({ data }) => data);
export const isOnOffice = () => ifconfig().then(({ ip }) => { window.onOffice.ip = ip; });
export const continuesCheck = () => setInterval(() => isOnOffice(), 1800000);

(() => {
  isOnOffice();
  continuesCheck();
  window.navigator.connection && (window.navigator.connection.onchange = () => setTimeout(() => isOnOffice(), 5000));
})();
