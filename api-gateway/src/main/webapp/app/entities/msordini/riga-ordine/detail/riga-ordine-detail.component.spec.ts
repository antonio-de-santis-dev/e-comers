import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { RigaOrdineDetailComponent } from './riga-ordine-detail.component';

describe('RigaOrdine Management Detail Component', () => {
  let comp: RigaOrdineDetailComponent;
  let fixture: ComponentFixture<RigaOrdineDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RigaOrdineDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./riga-ordine-detail.component').then(m => m.RigaOrdineDetailComponent),
              resolve: { rigaOrdine: () => of({ id: 32109 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(RigaOrdineDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RigaOrdineDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load rigaOrdine on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', RigaOrdineDetailComponent);

      // THEN
      expect(instance.rigaOrdine()).toEqual(expect.objectContaining({ id: 32109 }));
    });
  });

  describe('PreviousState', () => {
    it('should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
