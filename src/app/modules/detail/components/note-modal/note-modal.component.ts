import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CustomOverlayRef } from '@classes';
import { Country } from '@models';

@Component({
  selector: 'iwp-note-modal',
  templateUrl: './note-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteModalComponent implements OnInit {
  control: FormControl;

  constructor(private fb: FormBuilder, public ref: CustomOverlayRef<Country>) {}

  ngOnInit(): void {
    this.buildForm();
  }

  addNote(): void {
    if (this.control.invalid) {
      return;
    }

    const note = this.control.value as string;
    const equal = this.ref.data.note === note;

    this.ref.close(equal ? null : ({ ...this.ref.data, note } as Country));
  }

  private buildForm(): void {
    this.control = this.fb.control(this.ref.data.note || '', Validators.required);
  }
}
