import { InputType, Field } from "@nestjs/graphql";
import { Upload } from "./upload.scalar";

@InputType()
export class UploadUserProfilePicInput {
    @Field()
    file : Upload
}