import { Component } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  // searchTerm: string = '';
  // searchResults: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
  ) {}

  // performSearch(_id: string): void {
  //   if (this.searchTerm.trim() !== '') {
  //     // Call your API service method to filter movies based on searchTerm
  //     this.fetchApiData.searchMovies(this.searchTerm).subscribe((filteredMovies) => {
  //       // Handle the filteredMovies data here
  //       this.searchResults = filteredMovies;
  //       this.searchTerm = '';
  //     });
  //   } else {
  //     // If the search term is empty, you can handle it here or do nothing
  //   }
  // }

  logoutUser(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['welcome']);
  }
}

