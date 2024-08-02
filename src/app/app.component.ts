import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {TooltipModule} from "ng-kit/tooltip";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TooltipModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'ng-kit-app';
  public ngOnInit() {
  }
}
