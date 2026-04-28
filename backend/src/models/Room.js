const { mongoose } = require('../config/db');

const roomSchema = new mongoose.Schema(
  {
    _id: { type: String },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    image_url: { type: String, default: '' },
    features: { type: [String], default: [] },
    gallery_urls: { type: [String], default: [] },
    available: { type: Boolean, default: true },
    total: { type: Number, default: 1 },
    booked: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    _id: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model('Room', roomSchema);
