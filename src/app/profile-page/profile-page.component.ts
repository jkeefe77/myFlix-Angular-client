import { Component, Input, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

type User = {
  _id?: string;
  Username?: string;
  Password?: string;
  Email?: string;
  Birthday?: string;
  FavoriteMovies?: string[];
};

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  user: any = {};
  favoriteMovies: [] = [];

  @Input() userData = {
    Username: '',
    Password: '',
    Email: '',
    Birthday: '',
    FavoriteMovies: '',
  };

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {
    const user = this.getUser();

    if (!user._id) {
      this.router.navigate(['welcome']);
      return;
    }
    // this will get the user information and return it along with their favourite movies
    this.user = user;
    this.userData = {
      Username: user.Username || '',
      Email: user.Email || '',
      Password: '',
      Birthday: formatDate(this.user.Birthday, 'yyyy-MM-dd', 'en-US', 'UTC+0'),
      FavoriteMovies: '',
    };
    this.fetchFavoriteMovies();
  }
  getUser(): User {
    return JSON.parse(localStorage.getItem('users') || '{}');
  }
  fetchFavoriteMovies(): void {
    this.fetchApiData.getAllMovies().subscribe(
      (response: any) => {
        this.favoriteMovies = response.filter(
          (m: { _id: any }) => this.user.FavoriteMovies.indexOf(m._id) >= 0
        );
      },
      (error) => {
        console.error('Error fetching favorite movies: ', error);
      }
    );
  }

  // this will edit the user information
  updateUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe(
      (data) => {
        console.log('User updated:', data);
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('Username', data.Username);
        this.snackBar.open('User updated!', 'OK', {
          duration: 2000,
        });
      },
      (error) => {
        console.error('Error updating user: ', error);
        this.snackBar.open('Error updating user!', 'OK', {
          duration: 2000,
        });
      }
    );
  }
}
