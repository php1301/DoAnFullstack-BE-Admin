
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
    rooms?: number;
    price?: number;
    hotelPhotos?: ImageInput[];
    location?: LocationInput[];
    locationDescription?: string;
    contactNumber?: string;
    propertyType?: string;
    isNegotiable?: boolean;
    wifiAvailability?: boolean;
    airCondition?: boolean;
    parking?: boolean;
    poolAvailability?: boolean;
    extraBed?: boolean;
}

export class AmenitiesSearchInput {
    wifiAvailability?: boolean;
    poolAvailability?: boolean;
    parkingAvailability?: boolean;
    airCondition?: boolean;
    rooms?: number;
    guest?: number;
}

export class CategoriesInput {
    slug?: string;
    name?: string;
    image?: ImageInput;
}

export class ContactInput {
    subject: string;
    message?: string;
    email?: string;
    cellNumber?: string;
}

export class CouponCheckedPayload {
    couponId?: string;
    couponName?: string;
    couponValue?: number;
    couponType?: number;
}

export class CouponInput {
    couponName: string;
    couponDescription?: string;
    couponType?: number;
    couponValue?: number;
    couponQuantity?: number;
    couponStartDate?: string;
    couponEndDate?: string;
    couponRange?: number;
}

export class DeletePhotosInput {
    id: string;
}

export class ImageInput {
    url?: string;
}

export class LocationInput {
    lat?: number;
    lng?: number;
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

export class MockInput {
    title?: string[];
}

export class ReviewFieldInput {
    rating?: number;
    ratingFieldName?: string;
}

export class ReviewInput {
    reviewOverall?: number;
    reviewTitle?: string;
    reviewTips?: string;
    reviewText?: string;
    sortOfTrip?: string;
    reviewFieldInput?: ReviewFieldInput[];
    reviewOptionals?: ReviewOptionalsInput[];
    reviewPics?: ImageInput[];
}

export class ReviewOptionalsInput {
    option?: string;
    optionField?: string;
}

export class SearchInput {
    minPrice?: number;
    maxPrice?: number;
}

export class SignUpInput {
    username?: string;
    first_name?: string;
    last_name?: string;
    email: string;
    password: string;
    profile_pic_main?: string;
    cover_pic_main?: string;
}

export class SocialInput {
    facebook?: string;
    instagram?: string;
    twitter?: string;
}

export class TransactionInput {
    transactionHotelName?: string;
    transactionHotelManagerId?: string;
    transactionHotelType?: string;
    transactionPrice?: number;
    transactionAuthorName?: string;
    transactionAuthorEmail?: string;
    transactionAuthorContactNumber?: string;
    transactionAuthorSpecial?: string;
    transactionAuthorNote?: string;
    transactionLocationFormattedAddress?: string;
    transactionLocationLat?: number;
    transactionLocationLng?: number;
    transactionRoom?: number;
    transactionGuest?: number;
    transactionRange?: number;
    transactionStartDate?: string;
    transactionEndDate?: string;
    transactionStripeId?: string;
}

export class UpdatePassword {
    confirmPassword: string;
    oldPassword: string;
    newPassword: string;
}

export class UpdatePhotosInput {
    url?: string;
    uid?: string;
    signedRequest?: string;
}

export class UpdateProfileInput {
    first_name?: string;
    last_name?: string;
    date_of_birth?: string;
    gender?: string;
    email?: string;
    content?: string;
    agent_location?: LocationInput;
    cellNumber?: string;
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
    id?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    profile_pic_main?: string;
    cover_pic_main?: string;
    role?: string;
}

export class Categories {
    id: string;
    slug?: string;
    name?: string;
    image?: Image;
}

export class Coupon {
    couponId: string;
    couponName: string;
    couponDescription?: string;
    couponAuthor?: User;
    couponAuthorId?: string;
    couponType?: number;
    couponValue?: number;
    couponQuantity?: number;
    couponStartDate?: string;
    couponEndDate?: string;
    couponRange?: number;
    couponTarget?: Hotel[];
    createdAt: string;
    updatedAt: string;
}

export class Gallery {
    id: string;
    uid?: string;
    url?: string;
    signedRequest?: string;
}

export class Hotel {
    id: string;
    peopleLiked?: User[];
    peopleReviewed?: User[];
    couponsAvailable?: Coupon[];
    connectId?: User;
    agentId?: string;
    agentEmail?: string;
    agentName?: string;
    title?: string;
    slug?: string;
    status?: string;
    content?: string;
    price?: number;
    isNegotiable?: boolean;
    propertyType?: string;
    condition?: string;
    rating?: number;
    ratingCount?: number;
    contactNumber?: string;
    termsAndCondition?: string;
    amenities?: Amenities[];
    image?: Image;
    location?: Location[];
    gallery?: Gallery[];
    categories?: Categories[];
    reviews?: Reviews[];
    createdAt: string;
    updatedAt: string;
}

export class HotelPhotos {
    url: string;
}

export class Image {
    id: string;
    url?: string;
    thumb_url?: string;
}

export class Location {
    id: string;
    lat?: number;
    lng?: number;
    formattedAddress?: string;
    zipcode?: string;
    city?: string;
    state_long?: string;
    state_short?: string;
    country_long?: string;
    country_short?: string;
}

export class Message {
    reviewAuthorName?: string;
    reviewAuthorId?: string;
    reviewedHotelId?: Hotel;
    reviewedHotelName?: string;
    hotelManagerId?: string;
    reviewTitle?: string;
    reviewText?: string;
    peopleReviewedQuanity?: number;
    peopleReviewedArr?: User[];
}

export abstract class IMutation {
    abstract signup(signUpInput?: SignUpInput): AuthPayload | Promise<AuthPayload>;

    abstract login(loginInput?: LoginInput): AuthPayload | Promise<AuthPayload>;

    abstract facebookLogin(email?: string, accessToken?: string, socialInfo?: string, socialId?: string, socialProfileLink?: string): AuthPayload | Promise<AuthPayload>;

    abstract googleLogin(email?: string, accessToken?: string, socialInfo?: string, socialId?: string, profileImage?: string): AuthPayload | Promise<AuthPayload>;

    abstract createHotel(addHotelInput?: AddHotelInput, location?: LocationInput[], image?: ImageInput[], categories?: CategoriesInput[]): Hotel | Promise<Hotel>;

    abstract sortHotel(type?: string): Hotel[] | Promise<Hotel[]>;

    abstract likeHotel(id: string): Hotel | Promise<Hotel>;

    abstract dislikeHotel(id: string): Hotel | Promise<Hotel>;

    abstract filterHotels(search?: SearchInput, amenities?: AmenitiesSearchInput): Hotel[] | Promise<Hotel[]>;

    abstract createLocation(location?: LocationInput): Location | Promise<Location>;

    abstract updateProfile(profile?: UpdateProfileInput, location?: LocationInput, social?: SocialInput): User | Promise<User>;

    abstract updatePhotos(photos?: UpdatePhotosInput[]): User | Promise<User>;

    abstract deletePhotos(photos?: DeletePhotosInput[]): User | Promise<User>;

    abstract setProfilePic(url?: string): User | Promise<User>;

    abstract setCoverPic(url?: string): User | Promise<User>;

    abstract updatePassword(password?: UpdatePassword): User | Promise<User>;

    abstract forgetPassword(email?: string): User | Promise<User>;

    abstract changePasswordFromForgetPassword(email?: string, password?: string): User | Promise<User>;

    abstract sendContact(contact?: ContactInput): User | Promise<User>;

    abstract makeReviews(reviews?: ReviewInput, hotelId?: string): Hotel | Promise<Hotel>;

    abstract likeOrDislikeReview(id: string, type?: number): Reviews | Promise<Reviews>;

    abstract checkNotification(id: string): User | Promise<User>;

    abstract readNotification(query?: string): User | Promise<User>;

    abstract deleteAllNotifications(id: string): User | Promise<User>;

    abstract createTransaction(transaction?: TransactionInput, hotelId?: string, userId?: string, coupon?: CouponCheckedPayload): Transaction | Promise<Transaction>;

    abstract createCoupon(coupon?: CouponInput, hotelsId?: string[], type?: number): Coupon[] | Promise<Coupon[]>;

    abstract checkCoupon(hotelId?: string, couponName?: string): Coupon | Promise<Coupon>;

    abstract processTransactions(id?: string[], type?: number): Transaction | Promise<Transaction>;

    abstract updateTotalUnreadTransactions(): User | Promise<User>;

    abstract deleteCoupons(id?: string[]): Coupon[] | Promise<Coupon[]>;

    abstract updateStripeId(stripeId?: string, type?: string): User | Promise<User>;
}

export class Notification {
    id: string;
    reviewAuthorName?: string;
    reviewedHotelName?: string;
    reviewTitle?: string;
    reviewText?: string;
    userNotificationId?: string;
    peopleReviewedQuantity?: number;
    query?: string;
    reviewAuthorProfilePic?: string;
    read?: boolean;
    old?: boolean;
    createdAt: string;
    updatedAt: string;
}

export abstract class IQuery {
    abstract allAmenities(): Amenities[] | Promise<Amenities[]>;

    abstract imageId(id: string): Hotel | Promise<Hotel>;

    abstract locationId(id: string): Location | Promise<Location>;

    abstract locations(): Location[] | Promise<Location[]>;

    abstract galleryId(id: string): Gallery | Promise<Gallery>;

    abstract galleries(): Gallery[] | Promise<Gallery[]>;

    abstract categoryId(id: string): Categories | Promise<Categories>;

    abstract allCategories(): Categories[] | Promise<Categories[]>;

    abstract userPosts(id: string): User | Promise<User>;

    abstract favouritePosts(id: string): User | Promise<User>;

    abstract favouritePostsHeart(id: string): User | Promise<User>;

    abstract getUserInfo(id: string): User | Promise<User>;

    abstract getUserGallery(id: string): User | Promise<User>;

    abstract getUserReviews(id: string): User | Promise<User>;

    abstract getUserNotification(id: string): Notification[] | Promise<Notification[]>;

    abstract getUserUnreadNotification(id: string): User | Promise<User>;

    abstract getHotelInfo(id: string): Hotel | Promise<Hotel>;

    abstract getHotelReviews(id: string): Reviews[] | Promise<Reviews[]>;

    abstract getHotelCoupons(id: string): Coupon[] | Promise<Coupon[]>;

    abstract getHotelManagerCoupons(): Coupon[] | Promise<Coupon[]>;

    abstract getReviewsLikeDislike(id: string): Reviews | Promise<Reviews>;

    abstract getAllHotels(location?: LocationInput, type?: string, search?: SearchInput, amenities?: AmenitiesSearchInput, property?: string[]): Hotel[] | Promise<Hotel[]>;

    abstract getFilteredHotels(location?: string, search?: SearchInput, amenities?: AmenitiesSearchInput, property?: string[]): Hotel[] | Promise<Hotel[]>;

    abstract getTransactionsHaving(orderBy?: string): Transaction[] | Promise<Transaction[]>;

    abstract getTransactionDetails(transactionSecretKey?: string): Transaction[] | Promise<Transaction[]>;

    abstract getTotalUnreadTransactions(): User | Promise<User>;

    abstract getVendorStripeId(id?: string): User | Promise<User>;
}

export class ReviewFields {
    id: string;
    rating?: number;
    ratingFieldName?: string;
}

export class ReviewOptionals {
    id: string;
    option?: string;
    optionField?: string;
}

export class Reviews {
    reviewID: string;
    reviewTitle?: string;
    reviewText?: string;
    peopleLiked?: User[];
    peopleDisliked?: User[];
    reviewTips?: string;
    sortOfTrip?: string;
    reviewAuthorId?: User;
    reviewAuthorFirstName?: string;
    reviewAuthorLastName?: string;
    reviewAuthorEmail?: string;
    reviewOverall?: number;
    reviewAuthorPic?: string;
    reviewedHotel?: Hotel;
    reviewedHotelId?: string;
    reviewPics?: Image[];
    reviewDate?: string;
    reviewOptional?: ReviewOptionals[];
    reviewFields?: ReviewFields[];
    createdAt: string;
    updatedAt: string;
}

export class Social {
    facebook?: string;
    twitter?: string;
    linkedIn?: string;
    instagram?: string;
}

export abstract class ISubscription {
    abstract unreadNotification(channelId?: string): Unread | Promise<Unread>;

    abstract notificationBell(channelId?: string): Notification | Promise<Notification>;

    abstract realtimeReviews(hotelId?: string): Reviews | Promise<Reviews>;

    abstract realtimeLikeDislike(reviewID?: string): Reviews | Promise<Reviews>;

    abstract realtimeNotificationTransaction(userId?: string): TransactionNotification | Promise<TransactionNotification>;
}

export class Transaction {
    TXID: string;
    transactionSecretKey?: string;
    transactionHotelName?: string;
    transactionHotelManager?: User;
    transactionHotelManagerId?: string;
    transactionHotelId?: string;
    transactionHotelType?: string;
    transactionPrice?: number;
    transactionAuthor?: User;
    transactionAuthorId?: string;
    transactionAuthorName?: string;
    transactionAuthorEmail?: string;
    transactionAuthorContactNumber?: string;
    transactionAuthorSpecial?: string;
    transactionAuthorNote?: string;
    transactionLocationLat?: number;
    transactionLocationLng?: number;
    transactionLocationFormattedAddress?: string;
    transactionRoom?: number;
    transactionGuest?: number;
    transactionRange?: number;
    transactionStatus?: string;
    transactionCoupon?: string;
    transactionCouponType?: number;
    transactionCouponValue?: number;
    transactionStartDate?: string;
    transactionEndDate?: string;
    transactionStripeId?: string;
    createdAt: string;
    updatedAt: string;
}

export class TransactionNotification {
    TXID: string;
    transactionPrice?: number;
}

export class UncheckTransactions {
    id: string;
    userUncheckTransactionsId?: string;
    userUncheckTransactions?: User;
    totalPrice?: number;
    totalTransactions?: number;
}

export class Unread {
    unreadNotification?: number;
}

export class User {
    id: string;
    first_name: string;
    last_name: string;
    username: string;
    stripeId?: string;
    password: string;
    email: string;
    role?: string;
    cellNumber?: string;
    profile_pic_main?: string;
    cover_pic_main?: string;
    profile_pic?: Image[];
    cover_pic?: Image[];
    date_of_birth?: string;
    gender?: string;
    content?: string;
    agent_location?: Location;
    gallery?: Gallery[];
    social_profile?: Social;
    reviews_maked?: ReviewFields[];
    listed_posts?: Hotel[];
    notification?: Notification[];
    unreadNotification?: number;
    favourite_post?: Hotel[];
    reviewed_post?: Hotel[];
    review_liked?: Reviews[];
    review_disliked?: Reviews[];
    transaction_had?: Transaction[];
    transaction_maked?: Transaction[];
    uncheckTransactions?: UncheckTransactions;
    coupons_maked?: Coupon[];
    createdAt: string;
    updatedAt: string;
}
