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


  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router
  ) {}


  // get showLink(): boolean {
  //   return window.location.pathname !== '/welcome';
  // }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = event.url;
        console.log(currentRoute);

        // Set the variables based on the current route
        this.showProfileLink = currentRoute !== '/welcome';
        this.showMoviesLink = currentRoute !== '/welcome';
        this.showLogoutLink = currentRoute !== '/welcome';
        this.showBurgerMenu = currentRoute !== '/welcome';
      }
    });
    // this.showProfileLink = window.location.pathname !== '/welcome';
    // this.showMoviesLink = window.location.pathname !== '/welcome';
    // this.showLogoutLink = window.location.pathname !== '/welcome';
    // this.showBurgerMenu = window.location.pathname !== '/welcome';
  }
  logoutUser(): void {
    localStorage.removeItem('users');
    localStorage.removeItem('token');
    this.router.navigate(['welcome']);
  }
}
