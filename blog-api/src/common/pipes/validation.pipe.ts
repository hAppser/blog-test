import { ValidationPipe } from "@nestjs/common";

export const globalValidationPipe = new ValidationPipe({
  enableDebugMessages: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  forbidUnknownValues: true,
  transform: true,
  stopAtFirstError: true,
});
