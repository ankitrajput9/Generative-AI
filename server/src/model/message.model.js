import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    convertaion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    author: {
      type: String,
      enum:["user","ai"],
      default:"user",
    },
    content: {
      type: String,
      required: true,
    //   trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
