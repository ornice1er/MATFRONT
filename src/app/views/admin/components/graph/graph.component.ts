// graph.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy, NgZone, ElementRef, QueryList, ViewChildren, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.css'
})
export class GraphComponent {
 @Input() graphMap: any = {};  // {clé: config Chart.js}
  @Input() quill: any;          // Instance de ton éditeur Quill

  @ViewChildren('canvas') canvasRefs!: QueryList<ElementRef<HTMLCanvasElement>>;
  chartInstances: { [key: string]: Chart } = {};

  get graphKeys(): string[] {
    return Object.keys(this.graphMap);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['graphMap'] && this.graphKeys.length > 0) {
      setTimeout(() => this.renderCharts(), 0); // attendre que le DOM soit mis à jour
    }
  }

  private renderCharts() {
    this.canvasRefs.forEach(canvasRef => {
      const id = canvasRef.nativeElement.getAttribute('data-id')!;
      const ctx = canvasRef.nativeElement.getContext('2d');
      if (ctx && this.graphMap[id]) {
        // Détruire un graphique déjà existant pour éviter les doublons
        if (this.chartInstances[id]) {
          this.chartInstances[id].destroy();
        }
        this.chartInstances[id] = new Chart(ctx, this.graphMap[id]);
      }
    });
  }


  private canvasToBase64(canvas: HTMLCanvasElement): string {
  const tmp = document.createElement('canvas');
  tmp.width = canvas.width;
  tmp.height = canvas.height;

  const ctx = tmp.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, tmp.width, tmp.height);
  ctx.drawImage(canvas, 0, 0);

  return tmp.toDataURL('image/png');
}


 insertIntoEditor(graphKey: string) {
  if (!this.quill) return;

  const canvas = this.canvasRefs.find(
    c => c.nativeElement.getAttribute('data-id') === graphKey
  )?.nativeElement;

  if (!canvas) return;

  const imgBase64 = this.canvasToBase64(canvas);
  const range = this.quill.getSelection(true);

  this.quill.insertEmbed(range.index, 'graphImage', {
    src: imgBase64,
    alt: graphKey
  });

  this.quill.setSelection(range.index + 1);
}

}
