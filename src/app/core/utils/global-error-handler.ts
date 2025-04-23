import { HttpErrorResponse } from "@angular/common/http";
import { Injectable, ErrorHandler, NgZone } from "@angular/core";
import { AppSweetAlert } from "./app-sweet-alert";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private zone: NgZone
  ) {}

  handleError(error: any) {
    // Check if it's an error from an HTTP response
    if (!(error instanceof HttpErrorResponse)) {
      error = error.rejection; // get the error object
    }
    this.zone.run(() =>
    AppSweetAlert.simpleAlert(`${error?.status} - ${error?.message}`)
      
    );

    console.error('Error from global error handler', error);
  }
}