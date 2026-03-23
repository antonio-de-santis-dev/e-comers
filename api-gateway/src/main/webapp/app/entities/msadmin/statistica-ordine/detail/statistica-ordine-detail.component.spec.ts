import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { StatisticaOrdineDetailComponent } from './statistica-ordine-detail.component';

describe('StatisticaOrdine Management Detail Component', () => {
  let comp: StatisticaOrdineDetailComponent;
  let fixture: ComponentFixture<StatisticaOrdineDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticaOrdineDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./statistica-ordine-detail.component').then(m => m.StatisticaOrdineDetailComponent),
              resolve: { statisticaOrdine: () => of({ id: 29061 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(StatisticaOrdineDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticaOrdineDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load statisticaOrdine on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', StatisticaOrdineDetailComponent);

      // THEN
      expect(instance.statisticaOrdine()).toEqual(expect.objectContaining({ id: 29061 }));
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
