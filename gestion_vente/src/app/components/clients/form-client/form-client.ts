import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Service } from '../../../services/service';

@Component({
  selector: 'app-form-client',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './form-client.html',
  styleUrl: './form-client.scss'
})
export class FormClient implements OnInit{
  clientForm!: FormGroup;

  clientId: string | null = null;
  clientData: any;

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private service: Service,
    private router: Router,
    private route: ActivatedRoute
  ){
    this.clientForm = this.fb.group({
      nom: ['', Validators.required],
      telephone: ['', Validators.required],
      adress: ['', Validators.required]
    });
  }

  ngOnInit(){
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.clientId = idParam;

      this.service.getClientById(this.clientId).subscribe(
        client => {
          if (client) {
            this.clientForm.patchValue(client);
          }
        },
        error => {
          console.error('Erreur lors du chargement du client :', error);
        }
      );
    }
  }

  get nom() { return this.clientForm.get('nom')!; }
  get telephone() { return this.clientForm.get('telephone')!; }
  get adress() { return this.clientForm.get('adress')!; }

  onSubmit() {
    if (this.clientForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.clientForm.markAllAsTouched();
    const clientData = this.clientForm.value;

    if (this.clientId) {
      this.service.updateClient(this.clientId, clientData).subscribe({
        next: () => {
          console.log('Client mis à jour avec succès');
          this.router.navigate(['/list-clients']);
        },
        error: err => {
          this.isLoading = false;
          this.clientForm.markAsPristine();
          console.error('Erreur lors de la mise à jour du client:', err)
        }
      });
    } else {
      this.service.createClient(clientData).subscribe({
        next: () => {
          console.log('Client cree avec succes');
          this.router.navigate(['/list-clients']);
        },
        error: err => {
          this.isLoading = false;
          this.clientForm.markAsPristine();
          console.error('Erreur lors de la création du client:', err)
        }
      });
    }
  }
}
