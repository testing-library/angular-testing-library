import { Component, EventEmitter, Injectable, Input, Output } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import userEvent from '@testing-library/user-event';
import { of, BehaviorSubject } from 'rxjs';
import { debounceTime, switchMap, map, startWith } from 'rxjs/operators';
import { render, screen, waitFor, waitForElementToBeRemoved, within } from '../src/lib/testing-library';

const DEBOUNCE_TIME = 1_000;

@Injectable()
class EntitiesService {
  fetchAll() {
    return of([]);
  }
}

@Injectable()
class ModalService {
  open(...args: any[]) {
    console.log('open', ...args);
  }
}

@Component({
  template: `
    <h1>Entities Title</h1>
    <button (click)="newEntityClicked()">Create New Entity</button>
    <label>
      Search entities
      <input type="text" (input)="query.next($event.target.value)" />
    </label>
    <atl-table [entities]="entities | async" (edit)="editEntityClicked($event)"></atl-table>
  `,
})
class EntitiesComponent {
  query = new BehaviorSubject<string>('');
  readonly entities = this.query.pipe(
    debounceTime(DEBOUNCE_TIME),
    switchMap((q) =>
      this.entitiesService.fetchAll().pipe(map((ent: any) => ent.filter((e: any) => e.name.includes(q)))),
    ),
    startWith(entities),
  );

  constructor(private entitiesService: EntitiesService, private modalService: ModalService) {}

  newEntityClicked() {
    this.modalService.open('new entity');
  }

  editEntityClicked(entity: string) {
    setTimeout(() => {
      this.modalService.open('edit entity', entity);
    }, 100);
  }
}

@Component({
  selector: 'atl-table',
  template: `
    <table>
      <tr *ngFor="let entity of entities">
        <td>{{ entity.name }}</td>
        <td><button (click)="edit.next(entity.name)">Edit</button></td>
      </tr>
    </table>
  `,
})
class TableComponent {
  @Input() entities: any[] = [];
  @Output() edit = new EventEmitter<string>();
}

const entities = [
  {
    id: 1,
    name: 'Entity 1',
  },
  {
    id: 2,
    name: 'Entity 2',
  },
  {
    id: 3,
    name: 'Entity 3',
  },
];

test('renders the table', async () => {
  jest.useFakeTimers();

  await render(EntitiesComponent, {
    declarations: [TableComponent],
    providers: [
      {
        provide: EntitiesService,
        useValue: {
          fetchAll: jest.fn().mockReturnValue(of(entities)),
        },
      },
      {
        provide: ModalService,
        useValue: {
          open: jest.fn(),
        },
      },
    ],
  });
  const modalMock = TestBed.inject(ModalService);

  expect(await screen.findByRole('heading', { name: /Entities Title/i })).toBeInTheDocument();

  expect(await screen.findByRole('cell', { name: /Entity 1/i })).toBeInTheDocument();
  expect(await screen.findByRole('cell', { name: /Entity 2/i })).toBeInTheDocument();
  expect(await screen.findByRole('cell', { name: /Entity 3/i })).toBeInTheDocument();

  userEvent.type(await screen.findByRole('textbox', { name: /Search entities/i }), 'Entity 2', {});

  jest.advanceTimersByTime(DEBOUNCE_TIME);

  await waitForElementToBeRemoved(() => screen.queryByRole('cell', { name: /Entity 1/i }));
  expect(await screen.findByRole('cell', { name: /Entity 2/i })).toBeInTheDocument();

  userEvent.click(await screen.findByRole('button', { name: /New Entity/i }));
  expect(modalMock.open).toHaveBeenCalledWith('new entity');

  const row = await screen.findByRole('row', {
    name: /Entity 2/i,
  });

  userEvent.click(
    await within(row).findByRole('button', {
      name: /edit/i,
    }),
  );
  await waitFor(() => expect(modalMock.open).toHaveBeenCalledWith('edit entity', 'Entity 2'));
});
