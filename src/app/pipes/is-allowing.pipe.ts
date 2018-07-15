import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isAllowing'
})
export class IsAllowingPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value._id !== args._id && (
      args.type === 'admin' || (args.type === 'manager' && value.type !== 'admin')
    );
  }

}
