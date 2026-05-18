import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.html'
})
export class Contact {
  onSubmit() {
    // Form submission logic
    alert('Thank you for your interest! Our team will contact you shortly.');
  }
}
