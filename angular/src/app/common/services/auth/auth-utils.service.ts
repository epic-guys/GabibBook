import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthUtilsService {

  public tokenExpiredEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  public tokenRefreshedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {}

}