import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import * as d3 from 'd3';
import { fromEvent, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { Country, CountryList, CountryUpdateType, MenuItem } from '@models';
import { OverlayService } from '@services';
import { NoteModalComponent } from '../note-modal/note-modal.component';
import { Actions, ofActionDispatched } from '@ngxs/store';
import { GeoCountrySelect } from '@actions';

@Component({
  selector: 'iwp-world-map',
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class WorldMapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapRef', { read: ElementRef })
  private readonly mapRef: ElementRef<HTMLDivElement>;

  @ViewChild('wrapperRef', { read: ElementRef })
  private readonly wrapperRef: ElementRef<HTMLDivElement>;

  @Input()
  countries: CountryList;

  @Output()
  onMapUpdate = new EventEmitter<Country[]>();

  private updatedCountries: CountryList;
  private countriesGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
  private minZoom: number;
  private maxZoom: number;
  private svg: d3.Selection<SVGSVGElement | Element, unknown, null, undefined>;
  private zoom: d3.ZoomBehavior<Element, unknown>;
  private path: d3.GeoPath;
  private readonly destroy$ = new Subject();
  private readonly MAX_WIDTH = 3000;
  private readonly MAX_HEIGHT = 1250;

  constructor(private actions: Actions, private renderer: Renderer2, private overlay: OverlayService) {}

  ngAfterViewInit(): void {
    this.updatedCountries = { ...this.countries };
    this.listenCountrySearchEvent();
    this.draw();
    this.listenResize();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private draw(): void {
    this.path = this.buildPath();
    this.zoom = this.buildMapZoom();
    this.svg = this.buildSVG() as d3.Selection<SVGSVGElement | Element, unknown, null, undefined>;
    this.buildMapParts();
  }

  private buildMapParts() {
    this.buildCountryGroups();
    this.initiateZoom();
  }

  private updateMapParts(): void {
    this.countriesGroup.selectAll('path').data(this.updatedCountries.features);
    const updated = d3.selectAll('.country').data() as Country[];
    this.onMapUpdate.emit(updated);
  }

  private processMenuAction(country: Country): void {
    this.updatedCountries = {
      ...this.updatedCountries,
      features: this.updatedCountries.features.map((item) => {
        if (item.properties.iso_a3 === country.properties.iso_a3) {
          return {
            ...item,
            ...country,
          };
        }
        return item;
      }),
    };
  }

  private drawContextMenu(event: MouseEvent, data: Country): void {
    this.removeContextMenu();

    const menuItems = this.getMenuItems(data);

    const el = this.renderer.createElement('div') as HTMLDivElement;
    this.renderer.appendChild(this.wrapperRef.nativeElement, el);

    d3.select(el)
      .classed('context-menu', true)
      .append('ul')
      .attr('class', 'list-group')
      .selectAll('li')
      .data(menuItems)
      .enter()
      .append('li')
      .attr('class', 'list-group-item list-group-item-action cursor-pointer')
      .text((d) => d.title)
      .on('click', (e: MouseEvent, d) => d.action(data));

    const positions = d3.pointer(event, this.mapRef.nativeElement).map((pos) => (isNaN(pos) ? 0 : pos));

    d3.select(el)
      .style('position', 'absolute')
      .style('left', positions[0] + 'px')
      .style('top', positions[1] + 'px')
      .style('z-index', '100')
      .classed('d-none', false);
  }

  private updateCountryStatus(country: Country): void {
    this.getCountry(country).classed('country-import', country.import).classed('country-export', country.export);
  }

  private getMenuItems(data: Country): MenuItem<Country>[] {
    return [
      {
        title: 'Import',
        action: (value: Country) => {
          this.processCountryAction('import', value);
        },
      },
      {
        title: 'Export',
        action: (value: Country) => {
          this.processCountryAction('export', value);
        },
      },
      {
        title: `${data.note ? 'Update' : 'Add'} Note`,
        action: (value: Country) => {
          const ref = this.overlay.openModal<Country, Country>(NoteModalComponent, value);
          ref.afterClosed$.pipe(take(1)).subscribe(({ data: updatedValue, type }) => {
            if (type === 'close' && updatedValue) {
              this.processCountryAction('note', updatedValue);
            }
          });
        },
      },
      ...(data.export || data.import || data.note
        ? [
            {
              title: 'Delete Informations',
              action: (value: Country) => {
                this.processCountryAction('reset', value);
              },
            },
          ]
        : []),
    ];
  }

  private processCountryAction(type: CountryUpdateType, country: Country): void {
    switch (type) {
      case 'export':
        const updatedExport = { ...country, export: true, import: false } as Country;
        this.updateCountryStatus(updatedExport);
        this.processMenuAction(updatedExport);
        break;
      case 'import':
        const updatedImport = { ...country, export: false, import: true } as Country;
        this.updateCountryStatus(updatedImport);
        this.processMenuAction(updatedImport);
        break;
      case 'note':
        this.processMenuAction(country);
        break;
      case 'reset':
        const updatedReset = { ...country, export: false, import: false, note: '' } as Country;
        this.updateCountryStatus(updatedReset);
        this.processMenuAction(updatedReset);
        break;
    }
    this.updateMapParts();
  }

  private removeContextMenu(): void {
    d3.select('.context-menu').remove();
  }

  private getCountry(data: Country) {
    return d3.select('#country' + data.properties.iso_a3);
  }

  private buildCountryGroups() {
    this.countriesGroup = this.svg.append('g').attr('id', 'map');
    this.countriesGroup
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.MAX_WIDTH)
      .attr('height', this.MAX_HEIGHT);

    d3.select('body').on('click', () => {
      this.removeContextMenu();
    });

    this.countriesGroup
      .selectAll('path')
      .data(this.countries.features)
      .enter()
      .append('path')
      .attr('id', (data: Country) => 'country' + data.properties.iso_a3)
      .attr('class', (data: Country) =>
        ['country', data.export ? 'country-export' : '', data.import ? 'country-import' : ''].filter(Boolean).join(' '),
      )
      .attr('d', this.path as any)
      .on('mouseenter', (event: MouseEvent, data: Country) => {
        this.getCountry(data).classed('country-hover', true);
      })
      .on('mouseleave', (event: MouseEvent, data: Country) => {
        this.getCountry(data).classed('country-hover', false);
      })
      .on('contextmenu', (event: MouseEvent, data: Country) => {
        event.preventDefault();
        this.drawContextMenu(event, data);
      });
  }

  private initiateZoom(): void {
    // Define a "minzoom" whereby the "Countries" is as small possible without leaving white space at top/bottom or sides
    this.minZoom = Math.max(
      this.mapRef.nativeElement.clientWidth / this.MAX_WIDTH,
      this.mapRef.nativeElement.clientHeight / this.MAX_HEIGHT,
    );
    // set max zoom to a suitable factor of this value
    this.maxZoom = 20 * this.minZoom;
    // set extent of zoom to chosen values
    // set translate extent so that panning can't cause map to move out of viewport
    this.zoom.scaleExtent([this.minZoom, this.maxZoom]).translateExtent([
      [0, 0],
      [this.MAX_WIDTH, this.MAX_HEIGHT],
    ]);
    // define X and Y offset for centre of map to be shown in centre of holder
    const midX = (this.mapRef.nativeElement.clientWidth - this.minZoom * this.MAX_WIDTH) / 2;
    const midY = (this.mapRef.nativeElement.clientHeight - this.minZoom * this.MAX_HEIGHT) / 2;
    // change zoom transform to min zoom and centre offsets
    this.svg.call(this.zoom.transform, d3.zoomIdentity.translate(midX, midY).scale(this.minZoom));
  }

  private listenResize() {
    fromEvent(window, 'resize')
      .pipe(
        filter(() => !!this.svg),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        // Resize SVG
        this.svg
          .attr('width', this.mapRef.nativeElement.clientWidth)
          .attr('height', this.mapRef.nativeElement.clientHeight);
        this.initiateZoom();
      });
  }

  private buildMapZoom(): d3.ZoomBehavior<Element, unknown> {
    return d3.zoom().on('zoom', (event) => {
      const { k, x, y } = event.transform;
      if (isNaN(k) && isNaN(x) && isNaN(y)) {
        return;
      }

      const kFix = isNaN(event.transform.k) ? 0 : event.transform.k;
      const xFix = isNaN(event.transform.x) ? 0 : event.transform.x;
      const yFix = isNaN(event.transform.y) ? 0 : event.transform.y;

      if (!this.countriesGroup) {
        return;
      }

      this.countriesGroup.attr('transform', 'translate(' + [xFix, yFix] + ')scale(' + kFix + ')');
    });
  }

  private buildSVG() {
    return d3
      .select(this.mapRef.nativeElement)
      .append('svg')
      .attr('id', 'world-map')
      .attr('width', this.mapRef.nativeElement.offsetWidth)
      .attr('height', this.mapRef.nativeElement.clientHeight)
      .call(this.zoom.bind(this));
  }

  private buildPath(): d3.GeoPath {
    const projection = d3
      .geoEquirectangular()
      .scale(this.MAX_WIDTH / (2 * Math.PI))
      .translate([this.MAX_WIDTH / 2, this.MAX_HEIGHT / 2]);
    return d3.geoPath().projection(projection);
  }

  private listenCountrySearchEvent(): void {
    this.actions.pipe(ofActionDispatched(GeoCountrySelect)).subscribe(({ payload }: GeoCountrySelect) => {
      this.processCountryAction(payload.type, payload.country);
    });
  }
}
