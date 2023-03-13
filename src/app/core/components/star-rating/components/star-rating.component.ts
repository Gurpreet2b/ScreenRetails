import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css']
})
export class StarRatingComponent implements OnInit {

  @Input('readOnly') readOnly: boolean = false;
  @Input('currentRate') currentRate: number = 0;
  @Output() onSelectRating = new EventEmitter<any>();

  currentRating: number = 0;

  constructor() { 
   
  }

  ngOnInit(): void {
    // this.currentRating = this.rating;    
  }

  onRate(rating: number) {
    this.currentRating = rating;
    this.onSelectRating.emit(rating);
  }

}
