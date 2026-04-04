import { Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'loading',
  imports: [MatProgressSpinnerModule],
  templateUrl: 'loading.component.html',
  styleUrl: 'loading.component.scss',
})
export class LoadingComponent {
  diameter = input<number>(48);
  fullScreen = input<boolean>(false);
}
