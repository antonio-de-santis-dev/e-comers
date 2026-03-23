import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { OrdineDetailComponent } from './ordine-detail.component';

describe('Ordine Management Detail Component', () => {
  let comp: OrdineDetailComponent;
  let fixture: ComponentFixture<OrdineDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdineDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./ordine-detail.component').then(m => m.OrdineDetailComponent),
              resolve: { ordine: () => of({ id: 15761 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(OrdineDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdineDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load ordine on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', OrdineDetailComponent);

      // THEN
      expect(instance.ordine()).toEqual(expect.objectContaining({ id: 15761 }));
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
