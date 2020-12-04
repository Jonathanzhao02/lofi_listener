import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default mongoose.model('server', new Schema(
    {
        id: {
            type: String,
            required: true
        },
        settings: {
            type: Object,
            required: true
        }
    },
    {
        minimize: false
    }
));
