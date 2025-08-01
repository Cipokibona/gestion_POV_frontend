import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Service } from '../../../services/service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, forkJoin, switchMap } from 'rxjs';

@Component({
  selector: 'app-detail-pov',
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './detail-pov.html',
  styleUrl: './detail-pov.scss'
})
export class DetailPov implements OnInit {
  userData: any;

  povData: any;

  listPov: any;

  selectedProduct: any = null;
  selectedPov: number | null = null;
  quantiteRedirigee: number = 1;
  quantiteDefectueuse: number = 1;

  defectueuxForm!: FormGroup;
  deliverForm!: FormGroup;

  isLoading: boolean = false;

  constructor(
    private service: Service,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ){
    this.defectueuxForm = this.fb.group({
      quantite: [null, [Validators.required, Validators.min(1)]]
    });
    this.deliverForm = this.fb.group({
      quantite: [null, [Validators.required, Validators.min(1)]],
      pov: ['',Validators.required]
    });
  }

  ngOnInit(): void {
    this.getPovById();
    this.getUser();
    this.getAllPov();
  }

  getPovById() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.service.getPovById(idParam).subscribe(
        pov => {
          this.povData = pov;
          console.log('Point de vente récupéré :', this.povData);
        },
        error => {
          console.error('Erreur lors du chargement du point de vente :', error);
        }
      );
    }
  }

  getAllPov(){
    const idParam = this.route.snapshot.paramMap.get('id');
    this.service.getAllPov().subscribe({
      next: (povList:any) => {
        this.listPov = povList.filter((pov:any) => pov.id !== Number(idParam));
      },
      error: (err:any) => {
        console.log('Error de chargement de all pov', err);
      }
    })
  }

  getUser(){
    this.service.getUser().subscribe({
      next: user => {
        this.userData = user;
        console.log('User connecté:', this.userData);
      },
      error: err => console.error('Erreur:', err)
    });
  }

  get totalRendementAttendu(): number {
    if (!this.povData?.stocks) return 0;

    return this.povData.stocks.reduce((total: number, item: any) => {
      return total + (item.quantite * item.prix_vente);
    }, 0);
  }

  redirigerProduit(item: any): void {
    // 1. Validation initiale des données et état de chargement
    this.isLoading = true;
    const quantite = this.deliverForm.value.quantite;
    const povCible_id = Number(this.deliverForm.value.pov);
    const povSource_id = Number(this.route.snapshot.paramMap.get('id'));

    if (!item?.id || !povCible_id || !quantite || isNaN(povCible_id) || isNaN(povSource_id)) {
      alert('Informations de redirection incomplètes ou invalides.');
      this.isLoading = false;
      return;
    }

    // 2. Recherche et validation du stock source
    this.service.getStockByProduitAndPov(item.id, povSource_id).pipe(
      switchMap((stocks) => {
        const stockSource = stocks?.[0];
        if (!stockSource) {
          throw new Error("Stock source introuvable.");
        }

        const newQuantite = stockSource.quantite - quantite;
        console.log('Stock source ID:', stockSource.id);
        console.log('Quantité actuelle en stock:', stockSource.quantite);
        console.log('Quantité demandée par l\'utilisateur:', quantite);
        console.log('Nouvelle quantité après redirection:', newQuantite);
        if (newQuantite < 0) {
          throw new Error("Quantité insuffisante dans le stock source.");
        }

        // 3. Mise à jour du stock source
        const newDataStockSource = {
          produit: item.id,
          point_de_vente: povSource_id,
          prix_achat: item.prix_achat,
          prix_vente: item.prix_vente,
          date_expiration: item.date_expiration,
          quantite: newQuantite
        }
        const updateStockSource$ = this.service.createStock(newDataStockSource);

        // 4. Recherche du stock cible
        const filtre = {
          produit: item.id,
          point_de_vente: povCible_id,
          prix_achat: item.prix_achat,
          prix_vente: item.prix_vente,
          date_expiration: item.date_expiration
        };
        const searchStockCible$ = this.service.searchStockProduit(filtre);

        // 5. Exécution parallèle des requêtes pour optimiser
        return forkJoin({
          updateResult: updateStockSource$,
          stocksTrouves: searchStockCible$
        });
      }),
      // 6. Mise à jour ou création du stock cible en fonction du résultat parallèle
      switchMap(({ stocksTrouves }) => {
        const stockCible = stocksTrouves?.[0];
        if (stockCible) {
          const quantiteTotale = stockCible.quantite + quantite;
          const newDataStockCible = {
            produit: item.id,
            point_de_vente: povCible_id,
            prix_achat: item.prix_achat,
            prix_vente: item.prix_vente,
            date_expiration: item.date_expiration,
            quantite: quantiteTotale
          };
          return this.service.createStock(newDataStockCible);
        } else {
          const nouveauStock = {
            produit: item.id,
            point_de_vente: povCible_id,
            prix_achat: item.prix_achat,
            prix_vente: item.prix_vente,
            date_expiration: item.date_expiration,
            quantite: quantite
          };
          return this.service.createStock(nouveauStock);
        }
      }),
      finalize(() => this.isLoading = false) // Gère l'état de chargement à la fin, qu'il y ait une erreur ou non
    ).subscribe({
      next: () => {
        alert('Produit redirigé avec succès.');
        this.closeModal();
        this.loadData();
      },
      error: (err) => {
        console.error("Erreur détaillée:", err);
        const message = err.message || "Une erreur inconnue est survenue.";
        alert('Erreur lors de la redirection : ' + message);
      }
    });
  }


  retirerDefectueux(item: any){
    const quantite = this.defectueuxForm.value.quantite;
    if (!quantite || quantite < 1) {
      alert("Quantité invalide.");
      return;
    }
    console.log('Produit defectueux', item);
  }

  loadData(): void {
    this.getPovById();
    this.getUser();
    this.getAllPov();
  }

  closeModal(): void {
    // Implémentez ici la logique pour fermer le modal, par exemple en masquant une variable d'état ou en utilisant un service.
    // Exemple : this.isModalOpen = false;
    // Si vous utilisez un modal Angular Material ou autre, adaptez cette méthode.
  }
}
