import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
import { HttpException } from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    response.status(status).json({
      statusCode: status,
      message: errorResponse["message"] || errorResponse,
      timestamp: new Date().toISOString(),
    });
  }
}
