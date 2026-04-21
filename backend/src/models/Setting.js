const { mongoose } = require('../config/db');

const settingSchema = new mongoose.Schema(
  {
    setting_key: { type: String, required: true, unique: true },
    setting_value: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Setting', settingSchema);
