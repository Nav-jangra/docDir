import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class QueryPipe implements PipeTransform {
  async transform(value: any) {
    const obj = {
      filters: {},
      pagination: {
        offset: 0,
        limit: 20,
      },
      sorting: { sortBy: 'createdAt', order: 'DESC' },
    };

    if (value.offset !== undefined) {
      obj.pagination.offset = +value.offset;
    }
    if (value.limit !== undefined) {
      obj.pagination.limit = Math.min(+value.limit, 20);
    }
    if (value.sortBy) obj.sorting.sortBy = value.sortBy;
    if (value.order) obj.sorting.order = value.order;

    for (const key in value) {
      if (
        key != 'sortBy' &&
        key != 'order' &&
        key != 'offset' &&
        key != 'limit'
      ) {
        obj.filters[key] = value[key];
      }
    }
    return obj;
  }
}
