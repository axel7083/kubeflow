import {
  PropertyValue,
  StatusValue,
  TableConfig,
  DateTimeValue,
  LinkValue,
  LinkType,
  ComponentValue,
  quantityToScalar,
} from 'kubeflow';
import { UsedByComponent } from './columns/used-by/used-by.component';

export const tableConfig: TableConfig = {
  columns: [
    {
      matHeaderCellDef: $localize`Name`,
      matColumnDef: 'name',
      style: { width: '25%' },
      value: new PropertyValue({ field: 'name' }),
      sort: true,
    },
    {
      matHeaderCellDef: $localize`Created at`,
      matColumnDef: 'age',
      textAlignment: 'right',
      style: { width: '10%' },
      value: new DateTimeValue({
        field: 'age',
      }),
      sort: true,
    },
    {
      matHeaderCellDef: $localize`Keys`,
      matColumnDef: 'keys',
      style: { width: '15%' },
      value: new ComponentValue({
        component: UsedByComponent,
      }),
      sort: true,
      sortingPreprocessorFn: element => element.keys,
      filteringPreprocessorFn: element => element.keys,
    },
    {
      matHeaderCellDef: $localize`Type`,
      matColumnDef: 'type',
      style: { 'max-width': '60px' },
      value: new PropertyValue({ field: 'type' }),
      sort: true,
    },

    // the apps should import the actions they want
  ],
};
