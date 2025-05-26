import { ConsoleLogger, Injectable } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'
import { promises as fsPromises } from 'fs'

@Injectable()
export class LoggerService extends ConsoleLogger {
  async logToFile(entry) {
    const formattedEntry = `${Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
      timeStyle: 'short',
      timeZone: 'Asia/Seoul',
    }).format(new Date())}\t${entry}\n`

    const logDir = path.join(__dirname, '..', '..', 'logs')
    const logFile = path.join(logDir, 'app.log')

    try {
      if (!fs.existsSync(logDir)) {
        await fsPromises.mkdir(logDir)
      }
      await fsPromises.appendFile(logFile, formattedEntry)
    } catch (e) {
      if (e instanceof Error) console.error(e.message)
    }
  }

  log(message: any, context?: string) {
    const entry = `${context}\t${message}`
    this.logToFile(entry)
    super.log(message, context)
  }

  error(message: any, stackOrContext?: string) {
    const entry = `${stackOrContext}\t${message}`
    this.logToFile(entry)
    super.error(message, stackOrContext)
  }
}
