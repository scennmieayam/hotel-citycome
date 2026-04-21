const { mongoose } = require('../config/db');

const bookingSchema = new mongoose.Schema(
  {
    _id: { type: String },
    guest_name: { type: String, required: true },
    guest_email: { type: String, default: '' },
    guest_phone: { type: String, default: '' },
    room_id: { type: String, default: null },
    room_type: { type: String, default: '' },
    check_in: { type: Date, required: true },
    check_out: { type: Date, required: true },
    total_price: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'paid', 'rejected', 'request_cancel'],
      default: 'pending',
    },
    notes: { type: String, default: '' },
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

module.exports = mongoose.model('Booking', bookingSchema);
