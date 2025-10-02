import { Logger } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

export const tapLogEvent =
  <T>(logger: Logger) =>
  (source: Observable<T>): Observable<T> => {
    return source.pipe(
      tap((event: T) => {
        logger.debug('An event was received: ' + JSON.stringify(event));
      }),
    );
  };

export const tapLogCommand =
  <T>(logger: Logger) =>
  (source: Observable<T>): Observable<T> => {
    return source.pipe(
      tap((command: T) => {
        logger.debug('A command was created: ' + JSON.stringify(command));
      }),
    );
  };
