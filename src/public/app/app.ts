import {bootstrap} from 'angular2/platform/browser'
import {Component} from 'angular2/core'
import {Another} from './another.component.ts'

@Component({
  directives: [Another],
  selector: 'app',
  template: require('./app.html')
})
export class AppComponent {
  brand: string;

  constructor() {
    this.brand = 'Brand!';

    console.warn(this.brand + 'pff');
    
  }

}

bootstrap(AppComponent);
