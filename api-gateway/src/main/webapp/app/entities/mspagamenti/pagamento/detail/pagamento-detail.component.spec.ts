import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { PagamentoDetailComponent } from './pagamento-detail.component';

describe('Pagamento Management Detail Component', () => {
  let comp: PagamentoDetailComponent;
  let fixture: ComponentFixture<PagamentoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagamentoDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./pagamento-detail.component').then(m => m.PagamentoDetailComponent),
              resolve: { pagamento: () => of({ id: 5510 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(PagamentoDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagamentoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load pagamento on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', PagamentoDetailComponent);

      // THEN
      expect(instance.pagamento()).toEqual(expect.objectContaining({ id: 5510 }));
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
