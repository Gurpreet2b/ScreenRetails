import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = '2b Innovations';

  constructor(
    private router: Router,
    // private toastr: ToastrService
  ) {

  }

  ngOnInit() {
    this.router.events.subscribe((ev: any) => {
      if (ev instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }
}
