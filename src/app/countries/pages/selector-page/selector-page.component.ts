import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Country } from '../../interfaces/countries.interface';
import { switchMap,tap } from 'rxjs/operators';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

   myForm: FormGroup = this.fb.group({
     region: ['',Validators.required],
     country: ['',Validators.required],
     borders: ['',Validators.required],

   });

   //poblate
   regions: string[]=[];
   countries : Country[]=[];
   borders : Country[]=[];
 //ui
   loading: boolean = false;
  constructor(private fb:FormBuilder, private countriesService:CountriesService) { }

  ngOnInit(): void {
    this.regions=this.countriesService.regions;
    this.myForm.controls['region'].setValue('1');




    //cambie region
    // this.myForm.get('region')?.valueChanges.subscribe(r =>
    //   {
    //     console.log(r)
    //     this.countriesService.getCountriesByRegion(r)
    //     .subscribe( c => {
    //       this.countries = c
    //       console.log(this.countries);
    //     })


    //   }
    // )
      this.myForm.get('region')?.valueChanges
      .pipe(
        tap( (_) =>{
          this.myForm.get('country')?.reset('');
          this.loading=true;
          // this.myForm.get('borders')?.disable();

        }),
        switchMap(region =>this.countriesService.getCountriesByRegion(region) )
      )
      .subscribe(countries => {
        this.countries = countries;
        this.loading=false;

        console.log(this.countries);
      });
      //country changes
      this.myForm.get('country')?.valueChanges
      .pipe(
        tap( (_) => {
            this.borders=[];
            this.myForm.get('borders')?.reset('');
            this.loading=true;
          }),
        switchMap(code => this.countriesService.getCountryByCode(code)),
        //switchMap(country => this.countriesService.getCountriesByCodes(country![0].borders)),

      )
      .subscribe(country => {
        console.log("borders");

        console.log(country);


        if (country != null)
        {
          const c = this.countriesService.getCountriesByCodes(country![0].borders)
          .subscribe( borders =>  this.borders=borders)


          this.loading=false;
        }
      })
   }





  save(){
    console.log(this.myForm.value);

  }

}
