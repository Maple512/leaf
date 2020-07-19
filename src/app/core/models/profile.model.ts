export namespace ProfileModel {

  export interface State {
    profile: Response;
  }

  export interface Response {
    userName: string;
    email: string;
    name: string;
  }

  export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
  }
}
