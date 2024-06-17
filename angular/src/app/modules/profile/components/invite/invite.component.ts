import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InviteService } from 'src/app/common/services/invites/invite.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent {
  invites: any[];
  ajaxLoading: boolean = false;
  adding = false;

  constructor(
    private _snackBar: MatSnackBar,
    private inviteService: InviteService
  ) {
    this.invites = [];
  }

  ngOnInit(): void {
    const observer = {
      next: (data: any) => {
        this.invites = data;
        console.log(data);
      },
      error: (error: any) => {
        console.error(error);
      }
    };

    this.inviteService.getInvites().subscribe(observer);
    }
  

  copyCode(id: string){
    const el = document.createElement('textarea');

    let curr = window.location.href;
    curr = curr.substring(0, curr.indexOf('/profile/invite'));

    const url = curr + '/register?accesscode=' + id;

    el.value = url;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    this._snackBar.open('Code copied to clipboard', '', {
      duration: 2000,
    });
  }

  invite(){
    this.adding = true;
    const observer = {
      next: (data: any) => {
        this.invites.push(data);
        this.adding = false;
      },
      error: (error: any) => {
        console.error(error);
        this.adding = false;
      }
    };

    this.inviteService.createInvite({}).subscribe(observer);
  }

}
