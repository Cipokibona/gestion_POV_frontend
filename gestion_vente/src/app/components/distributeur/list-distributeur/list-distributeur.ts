import { Component, OnInit } from '@angular/core';
import { catchError, forkJoin } from 'rxjs';
import { Service } from '../../../services/service';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { List } from '../../../reusable_components/list/list';
import { ListAchat } from '../../../reusable_components/list-achat/list-achat';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-distributeur',
  imports: [FormsModule, ReactiveFormsModule, List, ListAchat, CommonModule],
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

  isAchatMode = false;

  listeAchat: any[] = [];

  pointsDeVente: any[] = [];
  selectedPointDeVente: any = null;

  caisses: any[] = [];
  selectedCaisse: any = null;

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

  achatForm = new FormGroup({
    bordereau: new FormControl('', Validators.required),
    pointDeVente: new FormControl('', Validators.required),
    caisse: new FormControl('', Validators.required),
  });

  constructor(private fb: FormBuilder, private service: Service, private router: Router) {

  }

  ngOnInit() {
    this.achatForm.get('caisse')?.valueChanges.subscribe(value => {
      this.selectedCaisse = this.caisses.find(caisse => caisse.id === Number(value)) || null;
    });
    this.achatForm.get('pointDeVente')?.valueChanges.subscribe(value => {
      this.selectedPointDeVente = this.pointsDeVente.find(pov => pov.id === Number(value)) || null;
      console.log('selected pov', this.selectedPointDeVente);
    });
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

    this.getAllPov();
    this.getCaisseGenerale();
  }

  // Méthode pour récupérer les points de vente
  getAllPov() {
    this.service.getAllPov().subscribe({
      next: (data) => {
        this.pointsDeVente = data;
        console.log('Points de vente récupérés :', this.pointsDeVente);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des points de vente :', err);
      }
    });
  }

  // Méthode pour récupérer les caisses
  getCaisseGenerale() {
    this.service.getAllCaissesGenerale().subscribe({
      next: (data) => {
        this.caisses = data;
        console.log('Caisses générales récupérées :', this.caisses);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des caisses générales :', err);
      }
    });
  }

  get products(): FormArray {
    return this.productForm.get('products') as FormArray;
  }

  get totalAchat(): number {
    return this.listeAchat.reduce((total, p) => total + (p.quantite * p.prix_achat), 0);
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

    this.isLoading = true;
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
        this.isLoading = false;
        location.reload(); // Recharger la page pour voir les changements
      },
      error: (error) => {
        this.isLoading = false;
        this.productForm.markAsPristine();
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

  listAchat(item: any) {
    const existe = this.listeAchat.find(prod => prod.id === item.id);

    if (!existe) {
      const produitAchat = {
        produit: item.id,
        nom: item.nom,
        description: item.description,
        quantite: item.quantite ?? 0,
        prix_achat: item.prix_achat ?? 0,
        prix_vente: item.prix_vente ?? 0,
        date_expiration: item.date_expiration ?? null,
        _achatConfirme: true
      };
      this.listeAchat.push(produitAchat);
      console.log('Produit ajouté à la liste d’achat :', this.listeAchat);
    } else {
      console.log('Produit déjà dans la liste d’achat');
    }
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

  faireAchat(){
    this.isAchatMode = true;
    console.log('Mode achat activé');
  }

  validerAchat(dist_id: number) {
    this.isLoading = true;
    this.achatForm.markAllAsTouched();
    const requests = [];
    if (this.achatForm.invalid || this.listeAchat.length === 0) {
      console.error('Formulaire d’achat invalide ou liste d’achat vide');
      this.isLoading = false;
      return;
    } else {
      if (!this.selectedCaisse || this.totalAchat > this.selectedCaisse.montant_total) {
        console.error('Montant total de l\'achat dépasse le montant de la caisse ou caisse non sélectionnée');
        this.isLoading = false;
        return;
      } else {
        const dataAchat = {
          distributeur: dist_id,
          bordereau: this.achatForm.value.bordereau,
          point_de_vente: this.achatForm.value.pointDeVente,
          montant_total: this.totalAchat,
          lignes_achats: this.listeAchat
        };
        const dataCaisse = {
          montant_total: this.selectedCaisse.montant_total - this.totalAchat
        };
        for(let produit of this.listeAchat){
          const dataStockProduit = {
            produit: produit.produit,
            point_de_vente: this.selectedPointDeVente?.id,
            quantite: produit.quantite,
            prix_achat: produit.prix_achat,
            prix_vente: produit.prix_vente,
            date_expiration: produit.date_expiration
          };
          requests.push(this.service.createStock(dataStockProduit));
        };
        requests.push(this.service.createAchat(dataAchat));
        requests.push(this.service.updateCaisseGenerale(this.selectedCaisse.id, dataCaisse));
      }
      forkJoin(requests).subscribe({
        next: (res) => {
          console.log('Achat créé avec succès', res);
          this.isLoading = false;
          this.isAchatMode = false;
          this.listeAchat = [];
          this.achatForm.reset();
          this.products.clear();
          //location.reload(); // Recharger la page pour voir les changements
          // Optionnel : Recharger la page ou mettre à jour la liste d'achats
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Erreur lors de la création de l’achat', err);
        }
      });
      console.log('Formulaire d’achat valide');
    }
    console.log('Achat validé');
  }

  retirerProduit(produit: any) {
    const index = this.listeAchat.findIndex(p => p.id === produit.id);
    if (index !== -1) {
      this.listeAchat.splice(index, 1);
      console.log('Produit retiré de la liste d’achat :', produit);
    } else {
      console.log('Produit non trouvé dans la liste d’achat');
    }
  }
}
