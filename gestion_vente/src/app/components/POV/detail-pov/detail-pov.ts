import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Service } from '../../../services/service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-pov',
  imports: [RouterLink, CommonModule],
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

  isLoading: boolean = false;

  constructor(
    private service: Service,
    private route: ActivatedRoute
  ){}

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

  redirigerProduit(item: any){
    if (!this.selectedPov || !this.quantiteRedirigee || this.quantiteRedirigee <= 0) {
      alert('Veuillez sélectionner un point de vente de destination et une quantité valide.');
      return;
    }

    if (this.quantiteRedirigee > item.quantite) {
      alert(`La quantité à rediriger (${this.quantiteRedirigee}) dépasse le stock actuel (${item.quantite}).`);
      return;
    }

    this.isLoading = true;
  }

  retirerDefectueux(item: any){
    console.log('Produit defectueux', item);
  }
}
