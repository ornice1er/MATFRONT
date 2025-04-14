import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class ModalLoaderService {
    private link = new Subject<any>();

    setLink(path: any) {
        this.link.next(path);
    }

    getLink(): Observable<any> {
        return this.link.asObservable();
    }
}