export type OverlayCloseType = 'backdropClick' | 'close' | 'headerClick';

export interface OverlayCloseEvent<R> {
  type: OverlayCloseType;
  data: R;
}

export interface OverlayImpl {
  show(): void;
}

export type CustomOverlayConfig = Partial<{
  panelClass: string;
  sizeClass: 'modal-xl' | 'modal-lg' | 'modal-md';
  delay: number;
}>;
