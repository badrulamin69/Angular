import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  subscribeNewsletter() {
    alert('Thank you for subscribing! You will receive our latest updates soon.');
  }
}
