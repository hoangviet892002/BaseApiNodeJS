export interface ILoginResponseDto {
  /** User ID */
  id: string;
  /** User Name */
  name: string;
  /** User Email */
  email: string;
  /** User Token */
  token: string;
  /** User Refresh token */
  refreshToken: string;
}
