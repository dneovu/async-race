import { Car } from './shared';

export default function isCar(object: any): object is Car {
  return (
    object && typeof object === 'object' && 'name' in object && 'color' in object && 'id' in object
  );
}
