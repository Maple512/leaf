import { ProfileModel } from '../models';

export class GetProfile {
  static readonly type = '[Profile] Get';
}

export class UpdateProfile {
  static readonly type = '[Profile] Update';
  constructor(public payload: ProfileModel.Response) { }
}

export class ChangePassword {
  static readonly type = '[Profile] Change Password';
  constructor(public payload: ProfileModel.ChangePasswordRequest) { }
}
