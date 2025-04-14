import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { LocalStorageService } from "./local-stoarge-service";
import { GlobalName } from "./global-name";

@Injectable({
    providedIn: 'root'
  })

export class AppStudentSelected{

    private studentSelected = new Subject<any>();
    constructor(
        private lsService: LocalStorageService
    ) {
        this.studentSelected.next(null);
    }

    setStudentSelected(studentSelected: any) {
        this.studentSelected.next(studentSelected);
    }

    getStudentSelected(): Observable<any> {
        return this.studentSelected.asObservable();
    }
}