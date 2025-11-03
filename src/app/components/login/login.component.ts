import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../landing/navbar/navbar.component';
import { FooterComponent } from '../landing/footer/footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, FooterComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  loading = false;
  errorMessage = '';
  returnUrl: string | null = null;
  reservationParams: any = {};

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit(): void {
    // Capturar parámetros de retorno y reserva desde queryParams
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || null;
      
      // Si hay parámetros de reserva (roomId, startDate, etc.), guardarlos
      if (params['roomId']) {
        this.reservationParams = {
          roomId: params['roomId'],
          roomType: params['roomType'],
          roomPrice: params['roomPrice'],
          startDate: params['startDate'],
          endDate: params['endDate']
        };
      } else {
        // Si hay otros queryParams pero no son de reserva, guardarlos para preservarlos
        const { returnUrl, ...otherParams } = params;
        if (Object.keys(otherParams).length > 0) {
          this.reservationParams = otherParams;
        }
      }
    });
  }

  submit(): void {
    this.errorMessage = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { email, password } = this.form.value;
    this.authService.login({ email: email!, password: password! }).subscribe({
      next: () => {
        this.loading = false;
        
        // Si hay una URL de retorno con parámetros de reserva, redirigir allí
        if (this.returnUrl === '/confirm-reservation' && this.reservationParams.roomId) {
          this.router.navigate([this.returnUrl], { queryParams: this.reservationParams });
        } 
        // Si hay otra URL de retorno, usarla
        else if (this.returnUrl && this.returnUrl !== '/login') {
          // Si la returnUrl tiene queryParams, parsearlos
          const urlTree = this.router.parseUrl(this.returnUrl);
          if (Object.keys(this.reservationParams).length > 0) {
            urlTree.queryParams = { ...urlTree.queryParams, ...this.reservationParams };
          }
          this.router.navigateByUrl(urlTree);
        } 
        // Por defecto, ir al dashboard
        else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Error al iniciar sesión';
      }
    });
  }
}


