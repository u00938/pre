declare global {
  namespace Express {
    export interface Request {
      currentUser: object;
      token: string;
    }
  }
}
