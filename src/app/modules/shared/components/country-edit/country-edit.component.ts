import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Country } from '@models';
import { CustomOverlayRef } from '@classes';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'iwp-country-edit',
  templateUrl: './country-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryEditComponent implements OnInit {
  faTrash = faTrash;
  faPlus = faPlus;
  form: FormGroup;
  country: Country;

  constructor(private fb: FormBuilder, public ref: CustomOverlayRef<Country>) {}

  ngOnInit(): void {
    this.country = this.ref.data;
    this.buildForm();
  }

  addInfo(): void {
    const { importOrExport, note } = this.form.value;
    if (!importOrExport && !note) {
      return;
    }
    const isImport = importOrExport === 'import';
    const country = { ...this.country, note } as Country;
    this.ref.close({ country, type: isImport ? 'import' : 'export' });
  }

  removeInfo(): void {
    this.ref.close({ country: this.country, type: 'reset' });
  }

  private buildForm(): void {
    const { import: isImport, export: isExport, note } = this.country;
    this.form = this.fb.group({
      importOrExport: isImport ? 'import' : isExport ? 'export' : null,
      note,
    });
  }
}
