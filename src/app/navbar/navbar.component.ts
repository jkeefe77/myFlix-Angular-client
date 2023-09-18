import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  showProfileLink: boolean = false;
  showMoviesLink: boolean = false;
  showLogoutLink: boolean = false;
  showBurgerMenu: boolean = true;

  // searchTerm: string = '';
  // searchResults: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router
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
  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = event.url;

        // Set the variables based on the current route
        this.showProfileLink = currentRoute !== '/welcome';
        this.showMoviesLink = currentRoute !== '/welcome';
        this.showLogoutLink = currentRoute !== '/welcome';
        this.showBurgerMenu = currentRoute !== '/welcome';
      }
    });
  }
  logoutUser(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['welcome']);
  }
}
