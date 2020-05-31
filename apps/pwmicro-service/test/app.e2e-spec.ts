import { Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { PWModule } from '../src/pw.module';
import { PWService } from '../src/pw.service';

describe('AppController (e2e)', () => {
  let app;
  let pwService: PWService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PWModule],
    }).compile();

    app = moduleFixture.createNestMicroservice({
      transport: Transport.TCP,
      options:{
        host :process.env.PW_MICRO_SERVICE_HOST || 'localhost',
        port: parseInt(process.env.PW_MICRO_SERVICE_PORT) || 3004
      }
    });
    pwService = moduleFixture.get<PWService>(PWService);
    await app.init();
     
    
  });

  afterAll( async ()=>{
    await app.close();
  })

  

  it('pw service should be defined', () => {
    expect(pwService).toBeDefined();
  });
});
