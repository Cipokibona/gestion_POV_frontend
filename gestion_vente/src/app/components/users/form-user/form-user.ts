import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-form-user',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './form-user.html',
  styleUrl: './form-user.scss'
})
export class FormUser {
  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      tel: ['', Validators.required],
      salaire: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]
    });
  }

  get nom() { return this.userForm.get('nom')!; }
  get prenom() { return this.userForm.get('prenom')!; }
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

      // ici tu peux envoyer `data` à ton API via un UserService
      // this.userService.createUser(data).subscribe(...)
    }
  }
}
