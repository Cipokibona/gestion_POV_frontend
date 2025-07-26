import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Service } from '../../../services/service';

@Component({
  selector: 'app-form-user',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './form-user.html',
  styleUrl: './form-user.scss'
})
export class FormUser implements OnInit{
  userForm: FormGroup;

  userId: string | null = null;
  userData: any;

  constructor(
    private fb: FormBuilder,
    private service: Service,
    private router: Router,
    private route: ActivatedRoute
  ) {
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

  ngOnInit() {
  const idParam = this.route.snapshot.paramMap.get('id');
  if (idParam) {
    this.userId = idParam;

    this.service.getUserById(this.userId).subscribe(
      user => {
        if (user) {
          this.userForm.patchValue(user);

          // Si le champ password existe dans le form, on supprime les validateurs
          if (this.userForm.contains('password')) {
            this.password.clearValidators();
            this.password.updateValueAndValidity();
          }
        }
      },
      error => {
        console.error('Erreur lors du chargement de l’utilisateur :', error);
      }
    );
  }
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

      // Si on est en édition, on supprime le champ password s’il est vide
      if (this.userId && !data.password) {
        delete data.password;
      }

      if (this.userId) {
        // Mode édition
        this.service.updateUser(this.userId, data).subscribe(
          response => {
            console.log('Utilisateur modifié avec succès :', response);
            this.router.navigate(['/list-users']);
          },
          error => {
            console.error('Erreur lors de la modification :', error);
          }
        );
      } else {
        // Mode création
        this.service.createUser(data).subscribe(
          response => {
            console.log('Utilisateur créé avec succès :', response);
            this.router.navigate(['/list-users']);
          },
          error => {
            console.error('Erreur lors de la création :', error);
          }
        );
      }
    }
  }

  mapDisplayToRole(display: string): string {
    const clean = display?.trim().toLowerCase();
    switch (clean) {
      case 'agent':
        return 'agent';
      case 'responsable':
        return 'responsable';
      case 'gérant':
      case 'gerant':
        return 'gerant';
      default:
        return '';
    }
  }

  patchUserFormWithDisplayRole(user: any) {
    const role = this.mapDisplayToRole(user.role_display);
    setTimeout(() => {
      this.userForm.patchValue({
        ...user,
        role: role
      });
    });
  }

}
