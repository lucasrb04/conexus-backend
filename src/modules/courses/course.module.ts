import { Module } from '@nestjs/common';
import { CourseService } from './courses.service';
import { CourseController } from './courses.controller';

@Module({
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
