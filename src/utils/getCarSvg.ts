import { Car } from './shared';
import carIcon from '../../public/icons/carIcon';

export default function getCarSvg(car: Car) {
  const { color } = car;

  return carIcon.replace(`fill="#000`, `fill="${color}`);
}
