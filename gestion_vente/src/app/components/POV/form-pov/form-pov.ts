import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-form-pov',
  imports: [RouterLink],
  templateUrl: './form-pov.html',
  styleUrl: './form-pov.scss'
})
export class FormPov {
  povForm!: FormGroup;
}
