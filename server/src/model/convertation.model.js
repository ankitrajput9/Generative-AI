import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'auth',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ConversationModel = mongoose.model('Conversation', ConversationSchema);

export default ConversationModel;
