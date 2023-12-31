import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

const apiUrl = 'https://filmsonthefly-app-ca635d09fe99.herokuapp.com';

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {}
  // Making the api call for the user registration endpoint

  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(`${apiUrl}/users`, userDetails)
      .pipe(catchError(this.handleError));
  }
  // Making the api call for the user login endpoint
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(`${apiUrl}/login`, userDetails)
      .pipe(catchError(this.handleError));
  }

  // Making the api call for the get all movies endpoint
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(`${apiUrl}/movies`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // searchMovies(title: string): Observable<any> {
  //   return this.http
  //     .get(`${apiUrl}/movies/${title}`, {
  //     })
  //     .pipe(map(this.extractResponseData), catchError(this.handleError));
  // }
  // Making the api call for the get one movie endpoint
  getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(`${apiUrl}/movies/${title}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Making the api call for the get one director endpoint
  getOneDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(`${apiUrl}/directors/${directorName}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Making the api call for the get one genre endpoint
  getOneGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(`${apiUrl}/genres/${genreName}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Making the api call for the get one user endpoint
  getOneUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('users') || '{}');
    return user;
    // const token = localStorage.getItem('token');
    // return this.http.get(apiUrl + 'users/' + user.Username, {
    //   headers: new HttpHeaders(
    //     {
    //       Authorization: 'Bearer ' + token,
    //     })
    // }).pipe(
    //   map(this.extractResponseData),
    //   catchError(this.handleError)
    // );
  }

  // Making the api call for the get favorite movies for a user endpoint
  getFavoriteMovies(): Observable<any> {
    const Username = JSON.parse(localStorage.getItem('users') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .get(`${apiUrl}/users/${Username}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(
        map(this.extractResponseData),
        map((data) => data.FavoriteMovies),
        catchError(this.handleError)
      );
  }

  // Making the api call for the add a movie to favorite movies endpoint
  addFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('users') || '{}');
    const token = localStorage.getItem('token');
    const index = user.FavoriteMovies.indexOf(movieId);
    console.log(index);
    user.FavoriteMovies.push(movieId);
    localStorage.setItem('users', JSON.stringify(user));
    return this.http
      .post(`${apiUrl}/users/${user.Username}/movies/${movieId}`, null, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
        responseType: 'text',
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  isFavoriteMovie(movieId: string): boolean {
    const user = JSON.parse(localStorage.getItem('users') || '{}');
    return user.FavoriteMovies.indexOf(movieId) >= 0;
  }

  // Making the api call for the edit user endpoint
  editUser(updateUser: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('users') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .put(apiUrl + '/users/' + user.Username, updateUser, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Making the api call for the delete user endpoint
  deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('users') || '{}');
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + '/users/' + user.Username, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    });
    // .pipe(catchError(this.handleError));
  }

  // Making the api call to delete a movie from the favorite movies endpoint
  deleteFavoriteMovie(movieId: string): Observable<any> {
    const Username = JSON.parse(localStorage.getItem('users') || '{}');
    const token = localStorage.getItem('token');

    const index = Username.FavoriteMovies.indexOf(movieId);
    console.log(index);
    if (index > -1) {
      // only splice array when item is found
      Username.FavoriteMovies.splice(index, 1); // 2nd parameter means remove one item only
    }
    localStorage.setItem('users', JSON.stringify(Username));
    return this.http
      .delete(`${apiUrl}/users/${Username}/movies/${movieId}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
        responseType: 'text',
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Non-typed response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }
  private handleError(error: HttpErrorResponse): any {
    if (error instanceof Error) {
      console.error('Some error occurred:', error.error.message);
    } else if (error.status >= 200 && error.status <= 299) {
      return;
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError(() => new Error('Invalid entry, please try again.'));
  }
}
