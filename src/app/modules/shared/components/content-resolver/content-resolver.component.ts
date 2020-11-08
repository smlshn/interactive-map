import { ChangeDetectionStrategy, Component, Input, TemplateRef, Type } from '@angular/core';

@Component({
  selector: 'iwp-content-resolver',
  templateUrl: './content-resolver.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentResolverComponent {
  @Input()
  contentType: 'template' | 'string' | 'component';

  @Input()
  content: string | TemplateRef<any> | Type<any>;

  @Input()
  context: any;
}
