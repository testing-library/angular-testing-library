import { Component, EventEmitter, Injectable, Input, Output } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';
import { debounceTime, switchMap, map, startWith } from 'rxjs/operators';
import { render, screen, waitFor, waitForElementToBeRemoved, within } from '../src/lib/testing-library';
import userEvent from '@testing-library/user-event';
import { AsyncPipe, NgForOf } from '@angular/common';

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
  selector: 'atl-table',
  template: `
    <table>
      <tr *ngFor="let entity of entities">
        <td>{{ entity.name }}</td>
        <td>
          <button (click)="edit.next(entity.name)">Edit</button>
        </td>
      </tr>
    </table>
  `,
  imports: [NgForOf],
})
class TableComponent {
  @Input() entities: any[] = [];
  @Output() edit = new EventEmitter<string>();
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
  imports: [TableComponent, AsyncPipe],
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

async function setup() {
  jest.useFakeTimers();
  const user = userEvent.setup();

  await render(EntitiesComponent, {
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

  return {
    modalMock,
    user,
  };
}

test('renders the heading', async () => {
  await setup();

  expect(await screen.findByRole('heading', { name: /Entities Title/i })).toBeInTheDocument();
});

test('renders the entities', async () => {
  await setup();

  expect(await screen.findByRole('cell', { name: /Entity 1/i })).toBeInTheDocument();
  expect(await screen.findByRole('cell', { name: /Entity 2/i })).toBeInTheDocument();
  expect(await screen.findByRole('cell', { name: /Entity 3/i })).toBeInTheDocument();
});

test.skip('finds the cell', async () => {
  const { user } = await setup();

  await user.type(await screen.findByRole('textbox', { name: /Search entities/i }), 'Entity 2', {});

  jest.advanceTimersByTime(DEBOUNCE_TIME);

  await waitForElementToBeRemoved(() => screen.queryByRole('cell', { name: /Entity 1/i }));
  expect(await screen.findByRole('cell', { name: /Entity 2/i })).toBeInTheDocument();
});

test.skip('opens the modal', async () => {
  const { modalMock, user } = await setup();
  await user.click(await screen.findByRole('button', { name: /New Entity/i }));
  expect(modalMock.open).toHaveBeenCalledWith('new entity');

  const row = await screen.findByRole('row', {
    name: /Entity 2/i,
  });

  await user.click(
    await within(row).findByRole('button', {
      name: /edit/i,
    }),
  );
  await waitFor(() => expect(modalMock.open).toHaveBeenCalledWith('edit entity', 'Entity 2'));
});
