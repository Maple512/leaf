import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { ChangePassword, GetProfile, UpdateProfile } from '../actions';
import { ProfileModel } from '../models';
import { ProfileService } from '../services/profile.service';

@State<ProfileModel.State>({
  name: 'ProfileState',
  defaults: {} as ProfileModel.State,
})
@Injectable()
export class ProfileState {
  @Selector()
  static getProfile({ profile }: ProfileModel.State): ProfileModel.Response {
    return profile;
  }

  constructor(private profileService: ProfileService) { }

  @Action(GetProfile)
  getProfile({ patchState }: StateContext<ProfileModel.State>) {
    return this.profileService.get().pipe(
      tap(profile =>
        patchState({
          profile,
        }),
      ),
    );
  }

  @Action(UpdateProfile)
  updateProfile({ patchState }: StateContext<ProfileModel.State>, { payload }: UpdateProfile) {
    return this.profileService.update(payload).pipe(
      tap(profile =>
        patchState({
          profile,
        }),
      ),
    );
  }

  @Action(ChangePassword)
  changePassword(_, { payload }: ChangePassword) {
    return this.profileService.changePassword(payload, true);
  }
}
