import { getCars } from './api/garage/get';

async function main() {
  const cars = await getCars();
  console.log(cars);
}

main();
