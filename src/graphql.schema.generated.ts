
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class AddHotelInput {
    hotelName: string;
    title: string;
    pricePerNight: number;
    price: number;
    contactNumber: number;
    extraBed?: boolean;
}

export class LoginInput {
    email: string;
    password: string;
}

export class PostInput {
    title: string;
    body?: string;
}

export class SignUpInput {
    email: string;
    password: string;
}

export class AuthPayload {
    id: string;
    email: string;
}

export class Hotel {
    id: string;
    hotelName: string;
    title: string;
    price: number;
    contactNumber: number;
    extraBed?: boolean;
}

export class HotelPhotos {
    url: string;
}

export class Location {
    url: string;
}

export abstract class IMutation {
    abstract signup(signUpInput?: SignUpInput): AuthPayload | Promise<AuthPayload>;

    abstract login(loginInput?: LoginInput): AuthPayload | Promise<AuthPayload>;

    abstract createPost(postInput?: PostInput): Post | Promise<Post>;

    abstract createHotel(addHotelInput?: AddHotelInput): Hotel | Promise<Hotel>;
}

export class Post {
    id: string;
    title: string;
    body?: string;
    author: User;
}

export abstract class IQuery {
    abstract post(id: string): Post | Promise<Post>;

    abstract posts(): Post[] | Promise<Post[]>;
}

export class User {
    id: string;
    email: string;
    post: Post[];
    createdAt: string;
    updatedAt: string;
}
