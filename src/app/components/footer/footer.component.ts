import { Component } from '@angular/core';

@Component({
  selector: 'xm-footer',
  templateUrl: 'footer.component.html',
  styleUrl: 'footer.component.scss',
})
export class FooterComponent {
  year = new Date().getFullYear();
}
