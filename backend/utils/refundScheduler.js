// utils/refundScheduler.js
// Add ONE line to app.js to start this:
//   require("./utils/refundScheduler");

const Order = require("../models/Order");
const User = require("../models/User");

async function processScheduledRefunds() {
  try {
    const due = await Order.find({
      refundStatus: "processing",
      paymentMethod: "Khalti",
      refundScheduledAt: { $lte: new Date() }, // scheduled time has passed
    });

    for (const order of due) {
      const user = await User.findById(order.user.id);
      if (user) {
        user.khaltiBalance += order.total;
        await user.save();
        console.log(
          `[Refund] Rs ${order.total} credited to user ${order.user.id}`,
        );
      }

      order.refundStatus = "refunded";
      order.refundScheduledAt = null;
      order.refundNote = order.refundNote || "Refund processed automatically.";
      await order.save();

      console.log(`[Refund] Order ${order._id} marked as refunded`);
    }
  } catch (err) {
    console.error("[Refund scheduler error]", err.message);
  }
}

// Run once immediately on startup (catches anything missed while server was down)
processScheduledRefunds();

// Then check every 5 minutes
setInterval(processScheduledRefunds, 5 * 60 * 1000);

console.log("[Refund scheduler] Started — checking every 5 minutes");

module.exports = { processScheduledRefunds };
