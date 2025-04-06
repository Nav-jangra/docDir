// query.pipe.ts
import { validate } from '@nestjs/class-validator';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class QueryPipe implements PipeTransform {
  async transform(value: any) {
    const obj = {
      filters: {},
      pagination: {
        offset: 0,
        limit: 50,
      },
      sorting: { sortBy: 'id', order: 'DESC' },
    };

    if (value.offset !== undefined) {
      obj.pagination.offset = +value.offset;
    }
    if (value.limit !== undefined) {
      obj.pagination.limit = Math.min(+value.limit, 50);
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
        if (value[key] === true || value[key] === false) {
          obj.filters[key] = value[key];
        } else {
          obj.filters[key] = value[key];
        }
      }
    }

    const errors = await validate(obj);

    if (errors.length) {
      throw new BadRequestException(errors);
    }
    return obj;
  }
}
