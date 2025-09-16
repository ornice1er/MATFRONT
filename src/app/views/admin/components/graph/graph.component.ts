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


  insertIntoEditor(graphKey: string) {
    if (!this.quill) return;

    const canvas = this.canvasRefs.find(
      c => c.nativeElement.getAttribute('data-id') === graphKey
    )?.nativeElement;

    if (!canvas) return;

    const imgBase64 = canvas.toDataURL('image/png');
    const html = `<img src="${imgBase64}" alt="${graphKey}" style="max-width:100%; display:block; margin:10px 0;" />`;

    const range = this.quill.getSelection(true);
    this.quill.clipboard.dangerouslyPasteHTML(range.index, html);
    this.quill.setSelection(range.index + 1);
  }
}
