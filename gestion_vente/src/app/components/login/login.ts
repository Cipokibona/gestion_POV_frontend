import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Service } from '../../services/service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  loading: boolean = false;
  error: string | null = null;

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(private api: Service, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.error = null;

    if (this.loginForm.valid) {
      const username = this.loginForm.value.username ?? '';
      const password = this.loginForm.value.password ?? '';

      this.api.login(username, password).subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.error = err.error.detail || 'Login failed';
          this.loading = false;
        }
      });
    } else {
      this.error = 'Please fill in all fields';
      this.loading = false;
    }
  }
}
