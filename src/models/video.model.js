import mongoose,{Schema} from "mongoose";
import mongooseAggrigatePaginate from
"mongooseAggrigate-paginate-v2";
const videoSchema = new Schema(
    {
        id: {
            type: String,
            unique: true,
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        videofile: {
            type: String,
            required: true,
        },

        thumbnail: {
            type: String,
            required: true,
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        views: {

            type: Number,
            default: 0,

        },
        isPublished: {
            type: Boolean,
            default: false,
        },

        duration: {
            type: Number,
            required: true,
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },

        updatedAt: {
            type: Date,
            default: Date.now,
        },
         
    },
    {
        timestamps: true,
    }
);
videoSchema.plugin(mongooseAggrigatePaginate);
export const Video = mongoose.model("Video", videoSchema);
