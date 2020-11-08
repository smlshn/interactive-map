import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { TemplatePortal } from '@angular/cdk/portal';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ConnectionPositionPair, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { FormBuilder, FormControl } from '@angular/forms';
import { AutoCompleteMapperFn, AutoCompleteResult } from '../../models';

@Component({
  selector: 'iwp-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutoCompleteComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  placeholder: string;

  @Input()
  debounce = 150;

  @Input()
  items: any[] = [];

  @Input()
  mapperFn: AutoCompleteMapperFn;

  @Output()
  onSelect = new EventEmitter<any>();

  @ViewChild('input', { read: ElementRef })
  inputRef: ElementRef;

  @ViewChild('input', { read: ViewContainerRef })
  inputVcRef: ViewContainerRef;

  @ViewChild('autocompleteDropRef')
  autocompleteDropRef: TemplateRef<unknown>;

  isOpen = false;
  overlayRef: OverlayRef;
  control: FormControl;
  searchResults: Array<AutoCompleteResult | any> = [];
  private searchItems: any[] = [];
  private portalRef: TemplatePortal;
  private destroy$ = new Subject();
  private backdropClick$ = new Subject();

  constructor(private fb: FormBuilder, private overlay: Overlay, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.searchItems = [...this.items];
    this.buildForm();
    this.listenSearchInput();
  }

  ngOnChanges({ items }: SimpleChanges) {
    if (items && items.currentValue && !items.firstChange) {
      this.searchItems = [...items.currentValue];
      this.filterSearchItems(this.control.value);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.backdropClick$.complete();
  }

  onInputFocus(): void {
    if (this.searchResults.length) {
      this.open();
    }
  }

  open(): void {
    if (this.isOpen) {
      return;
    }

    this.portalRef = new TemplatePortal(this.autocompleteDropRef, this.inputVcRef);

    const positions = [
      new ConnectionPositionPair({ originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' }),
      new ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' }),
    ];

    const overlayConfig = new OverlayConfig({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.inputRef)
        .withPositions(positions)
        .withFlexibleDimensions(false),
      scrollStrategy: this.overlay.scrollStrategies.block(),
      disposeOnNavigation: true,
      hasBackdrop: true,
      backdropClass: '',
    });

    this.overlayRef = this.overlay.create(overlayConfig);
    this.overlayRef.attach(this.portalRef);

    this.overlayRef
      .backdropClick()
      .pipe(takeUntil(this.backdropClick$))
      .subscribe(() => this.close());

    this.isOpen = true;
  }

  close(): void {
    if (this.isOpen) {
      this.overlayRef.detach();
      this.isOpen = false;
      this.backdropClick$.next();
    }
  }

  onItemClick(item: AutoCompleteResult, event: MouseEvent): void {
    event.preventDefault();
    this.control.patchValue(item.label, {
      emitEvent: false,
    });
    this.onSelect.emit(item.value);
    this.close();
  }

  private buildForm(): void {
    this.control = this.fb.control('');
  }

  private listenSearchInput(): void {
    this.control.valueChanges
      .pipe(debounceTime(this.debounce), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((term: string) => {
        if (term.length >= 3) {
          this.filterSearchItems(term);
          this.open();
        }
      });
  }

  private filterSearchItems(term: string) {
    this.searchResults = this.searchItems.filter(
      (country) => country.properties.name.toLowerCase().indexOf(term.toLowerCase()) > -1,
    );
    this.searchResults =
      this.mapperFn && typeof this.mapperFn === 'function' ? this.mapperFn(this.searchResults) : this.searchResults;
    this.cdRef.detectChanges();
  }
}
