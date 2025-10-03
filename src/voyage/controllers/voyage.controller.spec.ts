import { Test, TestingModule } from '@nestjs/testing';
import { VoyageService } from '@app/voyage/services/voyage.service';
import { VoyageController } from './voyage.controller';

describe('VoyageController', () => {
  let controller: VoyageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoyageController],
      providers: [VoyageService],
    }).compile();

    controller = module.get<VoyageController>(VoyageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
