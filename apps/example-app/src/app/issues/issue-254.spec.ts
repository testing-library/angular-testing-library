/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Inject, OnInit } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { createMock } from '@testing-library/angular/jest-utils';

interface Division {
  JobType: string;
  JobBullets: string[];
  Description: string;
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
    <li class="text-dark" *ngFor="let bullet of dedicated.JobBullets">
      {{ bullet }}
    </li>
  </ul>`,
})
class CareerOportunitiesComponent implements OnInit {
  dedicated = {} as Division;
  intermodal = {} as Division;
  noCdl = {} as Division;
  otr = {} as Division;

  constructor(private jobsService: JobsService) {}

  ngOnInit(): void {
    this.jobsService.divisions().then((apiDivisions) => {
      this.dedicated = apiDivisions.find((c) => c.JobType === 'DEDICATED');
      this.intermodal = apiDivisions.find((c) => c.JobType === 'INTERMODAL');
      this.noCdl = apiDivisions.find((c) => c.JobType === 'NO_CDL');
      this.otr = apiDivisions.find((c) => c.JobType === 'OVER_THE_ROAD');
    });
  }
}

test('Render Component', async () => {
  const divisions2: Division[] = [
    {
      JobType: 'INTERMODAL',
      JobBullets: ['Local Routes', 'Flexible Schedules', 'Competitive Pay'],
      Description: '',
    },
    { JobType: 'NO_CDL', JobBullets: ['We Train', 'We Hire', 'We Pay'], Description: '' },
    {
      JobType: 'OVER_THE_ROAD',
      JobBullets: ['Great Miles', 'Competitive Pay', 'Explore the Country'],
      Description: '',
    },
    {
      JobType: 'DEDICATED',
      JobBullets: ['Regular Routes', 'Consistent Miles', 'Great Pay'],
      Description: '',
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
