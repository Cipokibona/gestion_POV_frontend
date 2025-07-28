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

  constructor(
    private service: Service,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.getPovById();
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

}
