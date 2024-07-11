import carIcon from '../../public/icons/carIcon';

export default function getCarSvg(color: string): string {
  const params = carIcon.split(' ');
  const fillIndex = params.findIndex((_, index) => params[index].includes('fill'));

  params[fillIndex] = `fill="${color}"`;
  return params.join(' ');
}
