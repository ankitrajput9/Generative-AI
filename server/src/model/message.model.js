import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    convertaion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'auth',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
