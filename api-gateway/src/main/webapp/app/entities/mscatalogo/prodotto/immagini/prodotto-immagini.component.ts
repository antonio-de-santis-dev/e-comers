import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import SharedModule from 'app/shared/shared.module';

interface ProdottoImmagine {
  id: string;
  prodottoId: string;
  immagine: string;          // base64
  immagineContentType: string;
  ordine: number;
}

interface ProdottoInfo {
  id: string;
  nome?: string | null;
  immagineCopertina?: string | null;
  immagineCopertinaContentType?: string | null;
}

@Component({
  selector: 'jhi-prodotto-immagini',
  standalone: true,
  imports: [SharedModule, FormsModule, RouterModule],
  templateUrl: './prodotto-immagini.component.html',
  styleUrl: './prodotto-immagini.component.scss',
})
export class ProdottoImmaginiComponent implements OnInit, OnDestroy {

  // ---- State ----
  prodotto = signal<ProdottoInfo | null>(null);
  immagini = signal<ProdottoImmagine[]>([]);
  loading = signal(true);
  salvando = signal(false);
  messaggioOk = signal<string | null>(null);
  messaggioErr = signal<string | null>(null);

  // Preview copertina prima del salvataggio
  nuovaCopertina = signal<{ base64: string; contentType: string } | null>(null);
  anteprima = signal<string | null>(null); // URL per preview

  // Drag & drop
  dragOver = signal(false);

  private readonly destroy$ = new Subject<void>();
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);

  // ---- Lifecycle ----
  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = params.get('prodottoId');
      if (id) {
        this.loadProdotto(id);
        this.loadImmagini(id);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ---- Caricamento dati ----
  private loadProdotto(id: string): void {
    this.http.get<ProdottoInfo>(`/services/mscatalogo/api/prodottos/${id}`)
      .pipe(catchError(() => of(null)), takeUntil(this.destroy$))
      .subscribe(p => {
        this.prodotto.set(p);
        this.loading.set(false);
      });
  }

  private loadImmagini(prodottoId: string): void {
    this.http.get<ProdottoImmagine[]>(`/services/mscatalogo/api/prodottos/${prodottoId}/immagini`)
      .pipe(catchError(() => of([])), takeUntil(this.destroy$))
      .subscribe(imgs => this.immagini.set(imgs));
  }

  // ---- Copertina ----
  onCopertinaChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.leggiFile(file, 'copertina');
  }

  onDropCopertina(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(false);
    const file = event.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      this.leggiFile(file, 'copertina');
    }
  }

  private leggiFile(file: File, tipo: 'copertina' | 'carosello'): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // result = "data:image/jpeg;base64,/9j/..."
      const [meta, base64] = result.split(',');
      const contentType = meta.replace('data:', '').replace(';base64', '');

      if (tipo === 'copertina') {
        this.nuovaCopertina.set({ base64, contentType });
        this.anteprima.set(result);
      } else {
        this.aggiungiImmagineCarosello(base64, contentType);
      }
    };
    reader.readAsDataURL(file);
  }

  salvaCopertina(): void {
    const p = this.prodotto();
    const nuova = this.nuovaCopertina();
    if (!p || !nuova) return;

    this.salvando.set(true);
    this.messaggioOk.set(null);
    this.messaggioErr.set(null);

    // Usa PATCH per aggiornare solo i campi immagine
    this.http.patch(`/services/mscatalogo/api/prodottos/${p.id}`, {
      id: p.id,
      immagineCopertina: nuova.base64,
      immagineCopertinaContentType: nuova.contentType,
    }).pipe(
      catchError(err => {
        this.messaggioErr.set('Errore durante il salvataggio della copertina.');
        this.salvando.set(false);
        return of(null);
      }),
      takeUntil(this.destroy$)
    ).subscribe(result => {
      if (result !== null) {
        this.messaggioOk.set('✅ Copertina salvata con successo!');
        this.nuovaCopertina.set(null);
        // Ricarica il prodotto
        this.loadProdotto(p.id);
      }
      this.salvando.set(false);
    });
  }

  annullaCopertina(): void {
    this.nuovaCopertina.set(null);
    this.anteprima.set(null);
  }

  // ---- Immagini carosello ----
  onCaroselloChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files) return;
    Array.from(files).forEach(file => this.leggiFile(file, 'carosello'));
    // Reset input per permettere di caricare lo stesso file
    input.value = '';
  }

  private aggiungiImmagineCarosello(base64: string, contentType: string): void {
    const p = this.prodotto();
    if (!p) return;

    this.salvando.set(true);
    this.messaggioOk.set(null);
    this.messaggioErr.set(null);

    const ordine = this.immagini().length;

    this.http.post<ProdottoImmagine>(
      `/services/mscatalogo/api/prodottos/${p.id}/immagini`,
      { immagine: base64, immagineContentType: contentType, ordine }
    ).pipe(
      catchError(() => {
        this.messaggioErr.set('Errore durante il caricamento dell\'immagine.');
        this.salvando.set(false);
        return of(null);
      }),
      takeUntil(this.destroy$)
    ).subscribe(result => {
      if (result) {
        this.immagini.update(imgs => [...imgs, result]);
        this.messaggioOk.set('✅ Immagine aggiunta al carosello!');
      }
      this.salvando.set(false);
    });
  }

  eliminaImmagine(immagine: ProdottoImmagine): void {
    const p = this.prodotto();
    if (!p) return;

    if (!confirm('Eliminare questa immagine dal carosello?')) return;

    this.http.delete(`/services/mscatalogo/api/prodottos/${p.id}/immagini/${immagine.id}`)
      .pipe(catchError(() => of(null)), takeUntil(this.destroy$))
      .subscribe(() => {
        this.immagini.update(imgs => imgs.filter(i => i.id !== immagine.id));
        this.messaggioOk.set('Immagine eliminata.');
      });
  }

  // ---- Utility ----
  getCopertinaSrc(): string | null {
    // Prima mostra l'anteprima locale, poi quella salvata
    if (this.anteprima()) return this.anteprima();
    const p = this.prodotto();
    if (p?.immagineCopertina && p.immagineCopertina.length > 10 && p.immagineCopertinaContentType) {
      return `data:${p.immagineCopertinaContentType};base64,${p.immagineCopertina}`;
    }
    return null;
  }

  getImmagineCaroselloSrc(img: ProdottoImmagine): string {
    return `data:${img.immagineContentType};base64,${img.immagine}`;
  }

  tornaIndietro(): void {
    window.history.back();
  }
}
