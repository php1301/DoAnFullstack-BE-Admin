
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class AddHotelInput {
    hotelName?: string;
    pricePerNight?: number;
    hotelDetails?: string;
    guest?: number;
    beds?: number;
    price?: number;
    hotelPhotos?: ImageInput[];
    location?: LocationInput[];
    locationDescription?: string;
    contactNumber?: string;
    wifiAvailability?: boolean;
    airCondition?: boolean;
    parking?: boolean;
    poolAvailability?: boolean;
    extraBed?: boolean;
}

export class CategoriesInput {
    slug?: string;
    name?: string;
    image?: ImageInput;
}

export class ImageInput {
    url?: string;
}

export class LocationInput {
    lat?: string;
    lng?: string;
    formattedAddress?: string;
    zipcode?: string;
    city?: string;
    state_long?: string;
    state_short?: string;
    country_long?: string;
    country_short?: string;
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

export class Amenities {
    id: string;
    guestRoom?: number;
    bedRoom?: number;
    wifiAvailability?: boolean;
    parkingAvailability?: boolean;
    poolAvailability?: boolean;
    airCondition?: boolean;
    extraBedFacility?: boolean;
}

export class AuthPayload {
    id: string;
    email: string;
}

export class Categories {
    id: string;
    slug?: string;
    name?: string;
    image?: Image;
}

export class Gallery {
    id: string;
    url?: string;
}

export class Hotel {
    id: string;
    hotelName?: string;
    title?: string;
    content?: string;
    slug?: string;
    price?: number;
    status?: boolean;
    isNegotiable?: boolean;
    propertyType?: string;
    condition?: string;
    contactNumber?: string;
    termsAndCondition?: string;
    amenities?: Amenities[];
    image?: Image[];
    location?: Location[];
    gallery?: Gallery[];
    categories?: Categories[];
    createdAt: string;
    updatedAt: string;
}

export class HotelPhotos {
    url: string;
}

export class Image {
    id: string;
    url?: string;
}

export class Location {
    id: string;
    lat?: string;
    lng?: string;
    formattedAddress?: string;
    zipcode?: string;
    city?: string;
    state_long?: string;
    state_short?: string;
    country_long?: string;
    country_short?: string;
}

export abstract class IMutation {
    abstract signup(signUpInput?: SignUpInput): AuthPayload | Promise<AuthPayload>;

    abstract login(loginInput?: LoginInput): AuthPayload | Promise<AuthPayload>;

    abstract createPost(postInput?: PostInput): Post | Promise<Post>;

    abstract createHotel(addHotelInput?: AddHotelInput, location?: LocationInput[], image?: ImageInput[], categories?: CategoriesInput[]): Hotel | Promise<Hotel>;

    abstract createLocation(location?: LocationInput): Location | Promise<Location>;
}

export class Post {
    id: string;
    title: string;
    body?: string;
    author: User;
}

export abstract class IQuery {
    abstract amenities(): Amenities[] | Promise<Amenities[]>;

    abstract image(id: string): Hotel | Promise<Hotel>;

    abstract location(id: string): Location | Promise<Location>;

    abstract locations(): Location[] | Promise<Location[]>;

    abstract gallery(id: string): Gallery | Promise<Gallery>;

    abstract galleries(): Gallery[] | Promise<Gallery[]>;

    abstract category(id: string): Categories | Promise<Categories>;

    abstract categories(): Categories[] | Promise<Categories[]>;
}

export class User {
    id: string;
    email: string;
    post: Post[];
    createdAt: string;
    updatedAt: string;
}
