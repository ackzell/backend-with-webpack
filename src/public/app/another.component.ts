import {Component} from 'angular2/core';

@Component({
  selector: 'another',
  template: `
  				<div>Hi! I'm another component :)</div>

  				<button (click)="logMe()">Click me</button>
  			`,

})

export class Another {
  name: string;
  picture: string;

  constructor() {
    this.name     = 'Alex',
    this.picture  = 'http://garagemonkey.com/sites/default/files/default_avatar.png'
  }

  logMe(): void {
	  console.log('interesting! now... what?');
  }

}