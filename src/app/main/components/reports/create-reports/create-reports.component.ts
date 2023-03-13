import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';

@Component({
  selector: 'app-create-reports',
  templateUrl: './create-reports.component.html',
  styleUrls: ['./create-reports.component.css'],
})
export class CreateReportsComponent implements OnInit {

  public loading = false;

  constructor(private http: HttpService,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute,
    private dtPipe: DatePipe, public fb:FormBuilder,
    private authService: AuthService) {
  }

  ngOnInit(): void {
  }
  alertForm = this.fb.group({
    title: ['', Validators.required]
  })

  
}

