import { Component } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MovieDetailDialogComponent } from '../movie-detail-dialog/movie-detail-dialog.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent {
  movies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('users');
    if (!user) {
      this.router.navigate(['welcome']);
      return;
    }

    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }
  openGenreDialog(genres: any): void {
    this.dialog.open(MovieDetailDialogComponent, {
      data: {
        title: 'Genre',
        content: genres,
      },
    });
  }

  openSynopsisDialog(synopsis: string): void {
    this.dialog.open(MovieDetailDialogComponent, {
      data: {
        title: 'Description',
        content: synopsis,
      },
    });
  }

  openDirectorDialog(director: any): void {
    this.dialog.open(MovieDetailDialogComponent, {
      data: {
        title: 'Director',
        content: director,
      },
    });
  }

  isFavorite(movieId: string): boolean {
    return this.fetchApiData.isFavoriteMovie(movieId);
  }

  /**
   * calls the deleteFavoriteMovie api and shows the snackbar if successful
   * @param id the movie id
   */
  removeFavorite(movieId: string): void {
    this.fetchApiData.deleteFavoriteMovie(movieId).subscribe(() => {
      this.snackBar.open('removed from favorites', 'OK', {
        duration: 2000,
      });
    });
  }

  addFavorite(movieId: string): void {
    this.fetchApiData.addFavoriteMovie(movieId).subscribe(() => {
      this.snackBar.open('added to favorites', 'OK', {
        duration: 2000,
      });
    });
  }
}
