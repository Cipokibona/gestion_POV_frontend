import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Service } from '../../../services/service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { switchMap } from 'rxjs';

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

  redirigerProduit(item: any) {
    console.log('Redirection lancée pour', item);
    this.isLoading = true;

    const quantite = this.deliverForm.value.quantite;
    const povCible_id = Number(this.deliverForm.value.pov);
    const povSource_id = Number(this.route.snapshot.paramMap.get('id'));

    if (!item?.id || !povCible_id || !quantite) {
      alert('Informations incomplètes pour rediriger le produit.');
      this.isLoading = false;
      return;
    }

    this.service.getStockByProduitAndPov(item.id, povSource_id).pipe(
      switchMap((stocks) => {
        if (!stocks.length) throw new Error('Stock source introuvable');
        const stockSource = stocks[0];
        const newQuantite = stockSource.quantite - quantite;

        if (newQuantite < 0) {
          throw new Error("Quantité insuffisante dans le stock source.");
        }

        // 1. Mise à jour du stock source
        return this.service.updateStock(stockSource.id, { quantite: newQuantite }).pipe(
          // 2. Vérification du stock cible existant
          switchMap(() => {
            const filtre = {
              produit: item.id,
              point_de_vente: povCible_id,
              prix_achat: item.prix_achat,
              prix_vente: item.prix_vente,
              date_expiration: item.date_expiration
            };
            return this.service.searchStockProduit(filtre);
          }),

          // 3. Mise à jour ou création du stock cible
          switchMap((stocksTrouves) => {
            if (stocksTrouves.length) {
              const stockCible = stocksTrouves[0];
              const quantiteTotale = stockCible.quantite + quantite;
              return this.service.updateStock(stockCible.id, { quantite: quantiteTotale });
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
          })
        );
      })
    ).subscribe({
      next: () => {
        this.isLoading = false;
        alert('Produit redirigé avec succès.');
        this.closeModal();
        this.loadData();
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        alert('Erreur lors de la redirection : ' + err.message);
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
