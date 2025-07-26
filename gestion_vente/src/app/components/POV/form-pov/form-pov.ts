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

  constructor(
    private fb: FormBuilder,
    private service: Service,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.povForm = this.fb.group({
      nom: ['', Validators.required],
      responsable: ['', Validators.required],
      adresse: ['', Validators.required],
      tel: ['', Validators.required],
      caisse: ['', Validators.required]
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


  get renspoble() { return this.povForm.get('renspoble')!; }

  get nom() { return this.povForm.get('nom')!; }
  get adresse() { return this.povForm.get('adresse')!; }
  get tel() { return this.povForm.get('tel')!; }
  get caisse() { return this.povForm.get('caisse')!; }

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

    const povData = this.povForm.value;

    if (this.povId) {
      this.service.updatePov(this.povId, povData).subscribe({
        next: () => {
          console.log('Point de vente mis à jour avec succès');
          this.router.navigate(['/pov']);
        },
        error: err => console.error('Erreur lors de la mise à jour du point de vente:', err)
      });
    } else {
      this.service.createPov(povData).subscribe({
        next: () => {
          console.log('Point de vente créé avec succès');
          this.router.navigate(['/list-pov']);
        },
        error: err => console.error('Erreur lors de la création du point de vente:', err)
      });
    }
  }
}
