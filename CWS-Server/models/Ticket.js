const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    ticketId: { type: String, unique: true },

    // ✅ ADD THIS
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    employeeName: String,
    category: String,
    priority: String,
    description: String,
    // attachment: String,
    attachment: {
      type: [String], // ✅ ARRAY
      default: [],
    },

    status: { type: String, default: "Open" },
    assignedTo: { type: String, default: "IT Support" },
    raisedDate: { type: Date, default: Date.now },
    closedDate: Date,
    comments: [{ message: String, role: String }],


    notifications: [
      {
        receiverRole: String,
        message: String,
        isRead: { type: Boolean, default: false },
      },
    ],
   
  },
  { timestamps: true },
);

module.exports = mongoose.model("Ticket", ticketSchema);
