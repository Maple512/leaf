import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { ChangePassword, GetProfile, UpdateProfile } from '../actions';
import { ProfileState } from '../states';

@Injectable({
  providedIn: 'root',
})
export class ProfileStateService {
  constructor(private store: Store) { }

  getProfile() {
    return this.store.selectSnapshot(ProfileState.getProfile);
  }

  dispatchGetProfile() {
    return this.store.dispatch(new GetProfile());
  }

  dispatchUpdateProfile(...args: ConstructorParameters<typeof UpdateProfile>) {
    return this.store.dispatch(new UpdateProfile(...args));
  }

  dispatchChangePassword(...args: ConstructorParameters<typeof ChangePassword>) {
    return this.store.dispatch(new ChangePassword(...args));
  }
}
