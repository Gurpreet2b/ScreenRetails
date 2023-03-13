import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';

@Component({
  selector: 'app-create-domains',
  templateUrl: './create-domains.component.html',
  styleUrls: ['./create-domains.component.css'],
})
export class CreateDomainsComponent implements OnInit {

  public loading = false;

  constructor(private http: HttpService,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute,
    private dtPipe: DatePipe,
    private authService: AuthService) {
  }

  ngOnInit(): void {
  }

}