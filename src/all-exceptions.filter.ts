import { Catch, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { Request, Response } from 'express'
import { LoggerService } from './loggers/logger.service'
import { PrismaClientValidationError } from '@prisma/client/runtime/library'

type ResponseObj = {
  statusCode: number
  timestamp: string
  path: string
  response: string | object
}

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new LoggerService(AllExceptionsFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    this.logger.log(
      `Exception type: ${exception && typeof exception === 'object' && 'constructor' in exception ? exception.constructor.name : 'unknown'}`,
      AllExceptionsFilter.name,
    )
    this.logger.log(
      `Is HttpException: ${exception instanceof HttpException}`,
      AllExceptionsFilter.name,
    )
    this.logger.log(
      `Is PrismaClientValidationError: ${exception instanceof PrismaClientValidationError}`,
      AllExceptionsFilter.name,
    )

    if (
      exception &&
      typeof exception === 'object' &&
      'constructor' in exception
    ) {
      this.logger.log(
        `Exception constructor name: ${exception.constructor.name}`,
        AllExceptionsFilter.name,
      )
      if ('message' in exception) {
        this.logger.log(
          `Exception message: ${String(exception.message).substring(0, 100)}...`,
          AllExceptionsFilter.name,
        )
      }
    }

    const responseObj: ResponseObj = {
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: request.url,
      response: '',
    }

    if (exception instanceof HttpException) {
      this.logger.log('Processing as HttpException', AllExceptionsFilter.name)
      responseObj.statusCode = exception.getStatus()
      responseObj.response = exception.getResponse()
    } else if (
      exception instanceof PrismaClientValidationError ||
      (exception &&
        typeof exception === 'object' &&
        'constructor' in exception &&
        exception.constructor.name === 'PrismaClientValidationError')
    ) {
      this.logger.log(
        'Processing as PrismaClientValidationError',
        AllExceptionsFilter.name,
      )
      responseObj.statusCode = 422
      responseObj.response =
        exception &&
        typeof exception === 'object' &&
        'message' in exception &&
        typeof exception.message === 'string'
          ? exception.message.replaceAll(/\n/g, ' ')
          : 'Prisma validation error'
    } else {
      this.logger.log('Processing as unknown error', AllExceptionsFilter.name)
      responseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR
      responseObj.response = 'Internal Server Error'
    }

    response.status(responseObj.statusCode).json(responseObj)

    this.logger.error(responseObj.response, AllExceptionsFilter.name)
  }
}
