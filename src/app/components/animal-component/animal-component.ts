import { Component } from '@angular/core';
import { AnimalService } from '../../services/animal-service';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-animal-component',
  standalone: true, // ✅ ¡Esto es vital para standalone components!
  imports: [CommonModule, ReactiveFormsModule], // 👈 AGREGA ESTO,
  templateUrl: './animal-component.html',
  styleUrl: './animal-component.css',

})

export class AnimalComponent {
  animalList: any = [];
  animalForm: FormGroup | any;
  idAnimal: any;
  editableAnimal: boolean = false;


  constructor(private animalService: AnimalService, private toastr: ToastrService, private formBuilder: FormBuilder, private router: Router) {
  }
  getAllAnimals() {
    this.animalService.getAllAnimalsData().subscribe((data: {}) => {
      this.animalList = data;
    });
  }

  ngOnInit() {
    this.animalForm = this.formBuilder.group({
      nombre: '',
      edad: 0,
      tipo: ''
    });
    this.getAllAnimals();
  }

  newMessage(messageText: string) {
    this.toastr.success('Clic aquí para actualizar la lista', messageText)
      .onTap
      .pipe(take(1))
      .subscribe(() => window.location.reload());
  }

  newAnimalEntry() {
    this.animalService.newAnimal(this.animalForm.value).subscribe(

      () => {
        //Redirigiendo a la ruta actual /animales y recargando la ventana
        this.router.navigate(['/animales'])
          .then(() => {
            this.newMessage('Registro exitoso');
            this.animalForm.reset();
            this.getAllAnimals(); // 🔄 actualiza la lista sin recargar
          })
      }
    );
  }
  updateAnimalEntry() {
    //Removiendo valores vacios del formulario de actualización
    for (let key in this.animalForm.value) {
      if (this.animalForm.value[key] === '') {
        this.animalForm.removeControl(key);
      }
    }
    this.animalService.updateAnimal(this.idAnimal, this.animalForm.value).subscribe(
      () => {
        //Enviando mensaje de confirmación
        this.newMessage("Animal editado");
      }
    );
  }
  toggleEditAnimal(id: any) {
    this.idAnimal = id;
    console.log(this.idAnimal)
    this.animalService.getOneAnimal(id).subscribe(
      data => {
        this.animalForm.setValue({
          nombre: data.nombre,
          edad: data.edad,
          tipo: data.tipo,
        });
      }
    );
    this.editableAnimal = !this.editableAnimal;
  }
  deleteAnimalEntry(id: any) {
    console.log(id)
    this.animalService.deleteAnimal(id).subscribe(
      () => {
        //Enviando mensaje de confirmación
        this.newMessage("Animal eliminado");
      }
    );
  }


}
