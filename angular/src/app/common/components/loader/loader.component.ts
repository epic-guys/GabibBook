import { Component, ElementRef, Input, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  @Input() position: 'fixed' | 'absolute' | 'relative' = 'absolute';
  @Input() color: string = '#000';

  constructor(private elRef: ElementRef, private renderer: Renderer2) {
    this.renderer.setStyle(this.elRef.nativeElement, 'position', this.position);
    this.renderer.setStyle(this.elRef.nativeElement, 'color', this.color);
  }

  ngOnInit() {
    this.renderer.setStyle(this.elRef.nativeElement, 'position', this.position);
    this.renderer.setStyle(this.elRef.nativeElement, 'color', this.color);

    if(this.position === 'absolute') {
      this.renderer.setStyle(this.elRef.nativeElement, 'top', '50%');
      this.renderer.setStyle(this.elRef.nativeElement, 'left', '50%');
      this.renderer.setStyle(this.elRef.nativeElement, 'transform', 'translate(-50%, -50%)');
      this.renderer.setStyle(this.elRef.nativeElement, 'background-color', 'rgba(255, 255, 255, 0.5)');
    }
  }

  ngOnDestroy() {
    this.renderer.removeStyle(this.elRef.nativeElement, 'position');
    this.renderer.removeStyle(this.elRef.nativeElement, 'color');
    this.renderer.removeStyle(this.elRef.nativeElement, 'top');
    this.renderer.removeStyle(this.elRef.nativeElement, 'left');
    this.renderer.removeStyle(this.elRef.nativeElement, 'transform');
  }

}
