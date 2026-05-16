
const mongoose = require('mongoose');

const mongoUrl = 'mongodb://sandygogoing_proxy:aA0_123654@43.140.245.169:12456/proxy';

const orderSchema = new mongoose.Schema({
    orderNo: String,
    type: String
}, { versionKey: false });

const billSchema = new mongoose.Schema({
    orderNo: String,
    recordWay: Number,
    type: String
}, { versionKey: false });

const Order = mongoose.model('Order', orderSchema);
const Bill = mongoose.model('Bill', billSchema);

async function fixBillRecordWay() {
    try {
        await mongoose.connect(mongoUrl);
        console.log('Connected to MongoDB');

        const bills = await Bill.find({});
        console.log(`Total bills to process: ${bills.length}`);

        let updated = 0;
        for (const bill of bills) {
            if (bill.orderNo.startsWith('VIPCODE_')) {
                if (bill.recordWay !== 3) {
                    await Bill.updateOne({ _id: bill._id }, { $set: { recordWay: 3 } });
                    updated++;
                    console.log(`Updated bill ${bill.orderNo} to recordWay = 3 (激活码)`);
                }
            } else {
                const order = await Order.findOne({ orderNo: bill.orderNo });
                if (order) {
                    const newRecordWay = order.type === 'wechat' ? 1 : 2;
                    if (bill.recordWay !== newRecordWay) {
                        await Bill.updateOne({ _id: bill._id }, { $set: { recordWay: newRecordWay } });
                        updated++;
                        const paymentName = newRecordWay === 1 ? '微信支付' : '支付宝';
                        console.log(`Updated bill ${bill.orderNo} to recordWay = ${newRecordWay} (${paymentName})`);
                    }
                }
            }
        }

        console.log(`\nTotal bills updated: ${updated}`);

        const stats = await Bill.aggregate([
            { $group: { _id: '$recordWay', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        console.log('\nBill stats by recordWay:');
        stats.forEach(stat => {
            const name = stat._id === 1 ? '微信支付' : (stat._id === 2 ? '支付宝' : '激活码');
            console.log(`  ${name} (${stat._id}): ${stat.count} bills`);
        });

        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

fixBillRecordWay();
