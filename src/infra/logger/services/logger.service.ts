import { Injectable, LoggerService } from '@nestjs/common';
import * as kleur from 'kleur';

@Injectable()
export class AppLoggerService implements LoggerService {
  log(message: string) {
    const { dateStr, timeStr } = this.getTimestamp();
    console.log(
      `${kleur.green(`[Nest] ${process.pid}  -`)} ${dateStr}, ${timeStr}     ${kleur.green('LOG')} ${kleur.green(message)}`,
    );
  }
  error(message: string, trace?: string) {
    const { dateStr, timeStr } = this.getTimestamp();
    console.error(
      `${kleur.red(`[Nest] ${process.pid}  -`)} ${dateStr}, ${timeStr}     ${kleur.red('ERROR')} ${kleur.red(message)} ${kleur.red(
        trace ?? '',
      )}`,
    );
  }
  warn(message: string) {
    const { dateStr, timeStr } = this.getTimestamp();
    console.warn(
      `${kleur.yellow(`[Nest] ${process.pid}  -`)} ${dateStr}, ${timeStr}     ${kleur.yellow('WARN')} ${kleur.yellow(message)}`,
    );
  }
  debug(message: string) {
    const { dateStr, timeStr } = this.getTimestamp();
    console.debug(
      `${kleur.blue(`[Nest] ${process.pid}  -`)} ${dateStr}, ${timeStr}      ${kleur.blue('DEBUG')} ${kleur.blue(message)}`,
    );
  }
  verbose(message: string) {
    const { dateStr, timeStr } = this.getTimestamp();
    console.info(
      `${kleur.gray(`[Nest] ${process.pid}  -`)} ${dateStr}, ${timeStr}     ${kleur.gray('VERBOSE')} ${kleur.gray(message)}`,
    );
  }

  private getTimestamp(): { dateStr: string; timeStr: string } {
    const date = new Date();
    // Formato da data DD/MM/YYYY
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const dateStr = `${day}/${month}/${year}`;

    // Formato da hora HH:MM:SS
    const timeStr = date.toLocaleTimeString('pt-BR', { hour12: false });

    return { dateStr, timeStr };
  }
}
