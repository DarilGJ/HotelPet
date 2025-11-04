import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CustomerService } from '../../services/customer.service';
import { EmployeeService } from '../../services/employee.service';
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
  private readonly customerService = inject(CustomerService);
  private readonly employeeService = inject(EmployeeService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  loading = false;
  errorMessage = '';
  successMessage = '';
  returnUrl: string | null = null;
  reservationParams: any = {};
  isRegisterMode = false;

  // Formulario de login
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  // Formulario de registro
  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    usertype: ['customer' as 'staff' | 'customer', [Validators.required]],
    // Campos adicionales para crear customer/employee
    name: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    address: [''],
    dpi: ['']
  });

  ngOnInit(): void {
    // Capturar parámetros de retorno y reserva desde queryParams
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || null;
      const { returnUrl, ...otherParams } = params;
      if (Object.keys(otherParams).length > 0) {
        this.reservationParams = otherParams;
      }
    });

    // Validación personalizada para confirmar contraseña
    this.registerForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.passwordMatchValidator();
    });
    
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.passwordMatchValidator();
    });

    // No necesitamos limpiar nada cuando cambia el tipo de usuario
    // Los campos se mantienen ya que ambos tipos usan name, lastName, phone, etc.
  }

  // Validador personalizado para confirmar contraseña
  passwordMatchValidator() {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    
    if (confirmPassword && password !== confirmPassword) {
      this.registerForm.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    // Si hay otros errores, mantenerlos; si no, limpiar errores
    const confirmPasswordControl = this.registerForm.get('confirmPassword');
    if (confirmPasswordControl && confirmPasswordControl.errors?.['passwordMismatch']) {
      const errors = { ...confirmPasswordControl.errors };
      delete errors['passwordMismatch'];
      if (Object.keys(errors).length === 0) {
        confirmPasswordControl.setErrors(null);
      } else {
        confirmPasswordControl.setErrors(errors);
      }
    }
    
    return null;
  }

  toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMessage = '';
    this.successMessage = '';
    if (this.isRegisterMode) {
      this.loginForm.reset();
    } else {
      this.registerForm.reset();
      this.registerForm.patchValue({ 
        usertype: 'customer',
        name: '',
        lastName: '',
        phone: '',
        address: '',
        dpi: ''
      });
    }
  }

  submit(): void {
    if (this.isRegisterMode) {
      this.register();
    } else {
      this.login();
    }
  }

  login(): void {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { email, password } = this.loginForm.value;
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

  register(): void {
    this.errorMessage = '';
    this.successMessage = '';
    
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { email, password, usertype, name, lastName, phone, address, dpi } = this.registerForm.value;

    // Si es customer, primero crear el customer
    if (usertype === 'customer') {
      const customerData = {
        name: name!,
        lastName: lastName!,
        email: email!,
        phone: phone!,
        address: address || '',
        dpi: dpi || '',
        registrationDate: new Date(),
        status: 'active'
      };

      this.customerService.createCustomer(customerData).subscribe({
        next: (customer) => {
          // Una vez creado el customer, crear el usuario con su ID
          const registerData = {
            email: email!,
            password: password!,
            usertype: 'customer' as const,
            customerId: customer.id!,
            employeeId: null
          };

          this.authService.register(registerData).subscribe({
            next: (response) => {
              this.loading = false;
              this.successMessage = response.message || 'Usuario registrado exitosamente. Redirigiendo al login...';
              // Limpiar el formulario
              this.registerForm.reset();
              this.registerForm.patchValue({ usertype: 'customer' });
              // Cambiar a modo login después de 2 segundos
              setTimeout(() => {
                this.isRegisterMode = false;
                this.successMessage = '';
                // Auto-llenar el formulario de login con el email registrado
                this.loginForm.patchValue({ email: email! });
              }, 2000);
            },
            error: (err) => {
              this.loading = false;
              this.errorMessage = err?.error?.message || 'Error al registrar usuario';
            }
          });
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err?.error?.message || 'Error al crear el cliente';
        }
      });
    } 
    // Si es staff, primero crear el employee
    else if (usertype === 'staff') {
      const employeeData = {
        name: name!,
        lastName: lastName!,
        email: email!,
        phone: phone!,
        position: 'petSitter', // Valor por defecto, puede ser configurable después
        salary: 0, // Valor por defecto
        hiringDate: new Date(),
        status: 'active' as const
      };

      this.employeeService.createEmployee(employeeData).subscribe({
        next: (employee) => {
          // Una vez creado el employee, crear el usuario con su ID
          const registerData = {
            email: email!,
            password: password!,
            usertype: 'staff' as const,
            employeeId: employee.id!,
            customerId: null
          };

          this.authService.register(registerData).subscribe({
            next: (response) => {
              this.loading = false;
              this.successMessage = response.message || 'Usuario registrado exitosamente. Redirigiendo al login...';
              // Limpiar el formulario
              this.registerForm.reset();
              this.registerForm.patchValue({ usertype: 'customer' });
              // Cambiar a modo login después de 2 segundos
              setTimeout(() => {
                this.isRegisterMode = false;
                this.successMessage = '';
                // Auto-llenar el formulario de login con el email registrado
                this.loginForm.patchValue({ email: email! });
              }, 2000);
            },
            error: (err) => {
              this.loading = false;
              this.errorMessage = err?.error?.message || 'Error al registrar usuario';
            }
          });
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err?.error?.message || 'Error al crear el empleado';
        }
      });
    }
  }
}


