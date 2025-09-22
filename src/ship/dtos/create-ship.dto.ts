import { Length } from 'class-validator';

export class CreateShipDto {
  @Length(3, 50)
  name: string;
}
