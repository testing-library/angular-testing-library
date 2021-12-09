import { Component, Inject, OnInit } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { createMock } from '@testing-library/angular/jest-utils';

interface Division {
  jobType?: string;
  jobBullets?: string[];
  description?: string;
}

@Inject({
  providedIn: 'root',
})
class JobsService {
  divisions(): Promise<Division[]> {
    throw new Error('Method not implemented.');
  }
}

@Component({
  selector: 'app-home-career-oportunities',
  template: ` <ul class="popu-category-bullets">
    <li class="text-dark" *ngFor="let bullet of dedicated?.jobBullets">
      {{ bullet }}
    </li>
  </ul>`,
})
class CareerOportunitiesComponent implements OnInit {
  dedicated?: Division;
  intermodal?: Division;
  noCdl?: Division;
  otr?: Division;

  constructor(private jobsService: JobsService) {}

  ngOnInit(): void {
    this.jobsService.divisions().then((apiDivisions) => {
      this.dedicated = apiDivisions.find((c) => c.jobType === 'DEDICATED');
      this.intermodal = apiDivisions.find((c) => c.jobType === 'INTERMODAL');
      this.noCdl = apiDivisions.find((c) => c.jobType === 'NO_CDL');
      this.otr = apiDivisions.find((c) => c.jobType === 'OVER_THE_ROAD');
    });
  }
}

test('Render Component', async () => {
  const divisions2: Division[] = [
    {
      jobType: 'INTERMODAL',
      jobBullets: ['Local Routes', 'Flexible Schedules', 'Competitive Pay'],
      description: '',
    },
    { jobType: 'NO_CDL', jobBullets: ['We Train', 'We Hire', 'We Pay'], description: '' },
    {
      jobType: 'OVER_THE_ROAD',
      jobBullets: ['Great Miles', 'Competitive Pay', 'Explore the Country'],
      description: '',
    },
    {
      jobType: 'DEDICATED',
      jobBullets: ['Regular Routes', 'Consistent Miles', 'Great Pay'],
      description: '',
    },
  ];
  const jobService = createMock(JobsService);
  jobService.divisions = jest.fn(() => Promise.resolve(divisions2));

  await render(CareerOportunitiesComponent, {
    componentProviders: [
      {
        provide: JobsService,
        useValue: jobService,
      },
    ],
  });
  await screen.findAllByRole('listitem');
});
