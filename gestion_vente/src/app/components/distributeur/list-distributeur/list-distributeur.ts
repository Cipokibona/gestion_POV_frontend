import { Component, OnInit } from '@angular/core';
import { catchError, forkJoin } from 'rxjs';
import { Service } from '../../../services/service';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { List } from '../../../reusable_components/list/list';

@Component({
  selector: 'app-list-distributeur',
  imports: [FormsModule, ReactiveFormsModule, List],
  templateUrl: './list-distributeur.html',
  styleUrl: './list-distributeur.scss'
})
export class ListDistributeur implements OnInit{

  distributeurs: any[] = [];
  loading = true;
  error: string | null = null;
  isEditMode = false;
  editedDistributeurId: number | null = null;

  isLoading = false;

  selectedProductId: number | null = null;

openCreateModal() {
  this.isEditMode = false;
  this.editedDistributeurId = null;
  this.distributeurForm.reset();
}

openEditModal(distributeur: any) {
  this.isEditMode = true;
  this.editedDistributeurId = distributeur.id;
  this.distributeurForm.patchValue({
    nom: distributeur.nom,
    adress: distributeur.adress,
    telephone: distributeur.telephone
  });
}

   distributeurForm = new FormGroup({
    nom: new FormControl('', Validators.required),
    adress: new FormControl('', Validators.required),
    telephone: new FormControl('', Validators.required),
  });

  productForm!: FormGroup;


  constructor(private fb: FormBuilder, private service: Service, private router: Router) {

  }

  ngOnInit() {
     this.productForm = this.fb.group({
      products: this.fb.array([this.createProductFormGroup()])
    });
    this.service.getDistributeurs()
       .pipe(
         catchError(err => {
           this.error = err.message;
           this.loading = false;
           throw err;
         })
       )
       .subscribe(data => {
         this.distributeurs = data;
         this.loading = false;
         console.log('Réponse API distributeurs :', data);
       });
  }


  get products(): FormArray {
    return this.productForm.get('products') as FormArray;
  }

  createProductFormGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  addProduct(): void {
    this.products.push(this.createProductFormGroup());
  }
  deleteProduct(index : number):void{
    this.products.removeAt(index);
  }

  submitAllProducts(distributeurId: number): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const requests = this.products.controls.map(formGroup => {
      const data = {
        distributeur: distributeurId,
        nom: formGroup.value.name,
        description: formGroup.value.description
      };
      return this.service.createProduct(data); // doit retourner un Observable
    });

    forkJoin(requests).subscribe({
      next: (results) => {
        console.log('Tous les produits ont été créés:', results);
        this.productForm.reset();
        this.products.clear();
        this.addProduct();
      },
      error: (error) => {
        console.error('Erreur lors de la création de produits:', error);
      }
    });
  }

  onSubmit() {
  if (this.distributeurForm.invalid) return;
  this.isLoading = true;
  this.distributeurForm.markAllAsTouched();

  const formData = this.distributeurForm.value;

  if (this.isEditMode && this.editedDistributeurId !== null) {
    this.service.updateDistributeur(this.editedDistributeurId, formData).subscribe({
      next: (res) => {
        console.log('Modification réussie', res);
        location.reload();
      },
      error: (err) => {
        this.isLoading = false;
        this.distributeurForm.markAsPristine();
        console.error('Erreur modif', err);
      }
    });
  } else {
    this.service.createDistributeur(formData).subscribe({
      next: (res) => {
        console.log('Création réussie', res);
        location.reload();
      },
      error: (err) => {
        this.isLoading = false;
        this.distributeurForm.markAsPristine();
        console.error('Erreur création', err);
      }
    });
  }
}

  createProduct(id:number){
    this.isLoading = true;
    this.productForm.markAllAsTouched();
    const data = {
      distributeur: Number(id),
      nom: this.productForm.value.name,
      description: this.productForm.value.description,
    };
    this.service.createProduct(data).subscribe({
      next: (data:any) => {
        console.log('creation reussi de product', data);
        this.isLoading = false;
        location.reload();
      },
      error: (err) => {
        this.isLoading = false;
        this.productForm.markAsPristine();
        console.error('erreur de creation de product',err)
      }
    });
    location.reload();
  }

  modifier(item: any) {
    console.log('Modifier', item);
    this.isEditMode = true;
    this.selectedProductId = item.id;

    // On vide le FormArray actuel
    this.products.clear();

    // On ajoute un seul produit avec les valeurs de l’item
    this.products.push(this.fb.group({
      name: [item.nom, Validators.required],
      description: [item.description, Validators.required]
    }));

    // Ouvrir le modal Bootstrap
    const modalElement = document.getElementById('createProductModal');
    if (modalElement && (window as any).bootstrap) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  supprimerProduit(item: any) {
    console.log('Supprimer', item);
  }

  supprimer(item: any) {
    this.isLoading = true;
    this.service.deleteDistributeur(item).subscribe({
      next: (res) => {
        console.log('Suppression réussie', res);
        this.isLoading = false;
        location.reload();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erreur lors de la suppression', err);
      }
    });
  }
}
