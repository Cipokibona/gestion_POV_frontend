import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Service } from '../../../services/service';

@Component({
  selector: 'app-form-pov',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './form-pov.html',
  styleUrl: './form-pov.scss'
})
export class FormPov {
  povForm!: FormGroup;

  povId: string | null = null;
  povData: any;

  responsables: any[] = [];

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private service: Service,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.povForm = this.fb.group({
      nom: ['', Validators.required],
      responsable_id: ['', Validators.required],
      adresse: ['', Validators.required],
      tel: ['', Validators.required],
    });
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.povId = idParam;

      this.service.getPovById(this.povId).subscribe(
        pov => {
          if (pov) {
            this.povForm.patchValue(pov);
          }
        },
        error => {
          console.error('Erreur lors du chargement du point de vente :', error);
        }
      );
    }

    this.loadResponsables();
  }


  get responsable_id() { return this.povForm.get('responsable_id')!; }

  get nom() { return this.povForm.get('nom')!; }
  get adresse() { return this.povForm.get('adresse')!; }
  get tel() { return this.povForm.get('tel')!; }

  loadResponsables() {
    this.service.getAllUser().subscribe({
      next: (users: any[]) => {
        this.responsables = users.filter((user: any) => user.role_display === 'responsable');
        console.log('Responsables chargés:', this.responsables);
      },
      error: err => console.error('Erreur lors du chargement des responsables:', err)
    });
  }

  onSubmit() {
    if (this.povForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.povForm.markAllAsTouched();
    const povData = this.povForm.value;

    if (this.povId) {
      this.service.updatePov(this.povId, povData).subscribe({
        next: () => {
          console.log('Point de vente mis à jour avec succès');
          this.router.navigate(['/list-pov']);
        },
        error: err => {
          this.isLoading = false;
          this.povForm.markAsPristine();
          console.error('Erreur lors de la mise à jour du point de vente:', err)
        }
      });
    } else {
      this.service.createPov(povData).subscribe({
        next: () => {
          console.log('Point de vente créé avec succès');
          this.router.navigate(['/list-pov']);
        },
        error: err => {
          this.isLoading = false;
          this.povForm.markAsPristine();
          console.error('Erreur lors de la création du point de vente:', err)
        }
      });
    }
  }
}
