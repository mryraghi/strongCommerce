import {Product} from "../objects/product.object";

export class User {
  name: string;
  nickname: string;
  email: string;
  emailVerified: boolean;
  picture: string;
  updatedAt: string;
  sub: string;
  user_metadata: {
    fav: Product[],
    cart: Product[]
  };

  constructor(user: User) {
    this.name = user.name;
    this.nickname = user.nickname;
    this.email = user.email;
    this.emailVerified = user.emailVerified;
    this.picture = user.picture;
    this.updatedAt = user.updatedAt;
    this.sub = user.sub;
  }
}
