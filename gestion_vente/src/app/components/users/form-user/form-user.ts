import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Service } from '../../../services/service';

@Component({
  selector: 'app-form-user',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './form-user.html',
  styleUrl: './form-user.scss'
})
export class FormUser {
  userForm: FormGroup;

  constructor(private fb: FormBuilder, private service: Service, private router: Router) {
    this.userForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      tel: ['', Validators.required],
      salaire: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required]],
      role: ['', Validators.required]
    });
  }

  get first_name() { return this.userForm.get('first_name')!; }
  get last_name() { return this.userForm.get('last_name')!; }
  get email() { return this.userForm.get('email')!; }
  get tel() { return this.userForm.get('tel')!; }
  get salaire() { return this.userForm.get('salaire')!; }
  get username() { return this.userForm.get('username')!; }
  get password() { return this.userForm.get('password')!; }
  get role() { return this.userForm.get('role')!; }

  submit() {
    if (this.userForm.valid) {
      const data = this.userForm.value;
      console.log('Nouvel utilisateur à enregistrer :', data);

      this.service.createUser(data).subscribe(
        response => {
          this.router.navigate(['/list-users']);
          console.log('Utilisateur créé avec succès :', response);
        },
        error => {
          console.error('Erreur lors de la création de l\'utilisateur :', error);
        }
      );
    }
  }
}
