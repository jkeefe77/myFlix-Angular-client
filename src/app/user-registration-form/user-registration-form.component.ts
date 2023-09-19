// src/app/user-registration-form/user-registration-form.component.ts
import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss'],
})
export class UserRegistrationFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {}

  // This is the function responsible for sending the form inputs to the backend
  /**
   * This method will send the form inputs to the backend
   * @param void
   * @returns user object
   * @memberof UserRegistrationFormComponent
   * @see FetchApiDataService.registerUser()
   * @example registerUser()
   */
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe(
      (registrationResponse) => {
        // Registration successful, now log in the user
        const loginData = {
          Username: this.userData.Username,
          Password: this.userData.Password,
        };

        this.fetchApiData.userLogin(loginData).subscribe(
          (loginResponse) => {
            // Logic for successful login after registration goes here
            this.dialogRef.close(); // Close the modal on success
            console.log('User logged in:', loginResponse);
            this.snackBar.open(
              'User successfully registered and logged in',
              'OK',
              {
                duration: 2000,
              }
            );
            this.router.navigate(['/movies']);
          },
          (loginError) => {
            this.snackBar.open('Error logging in after registration', 'OK', {
              duration: 2000,
            });
          }
        );
      },
      (registrationError) => {
        this.snackBar.open(registrationError, 'OK', {
          duration: 2000,
        });
      }
    );
  }
}
