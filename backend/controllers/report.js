const UserView = require('../models/userView');

exports.userViewReport = async (req, res, next) => {
    try {
        const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date('0');
        const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();

        const report = await UserView.aggregate([
            { $match: { 'viewDate': { $gte: startDate, $lt: endDate } } },
            {
                $group: {
                    _id: '$productId',
                    totalUsers: { $sum: 1 },
                    uniqueUsers: { $addToSet: "$userId" }
                }
            },
            {
                $project: {
                    _id: 0,  // Exclude the _id field from the output
                    productId: '$_id',  // Rename _id to productId
                    totalUsers: '$totalUsers',
                    uniqueUsers: { $size: '$uniqueUsers' }  // Count unique users
                }
            }
        ]);

        res.status(200).json(report);
    } catch (error) {
        next(error);
    }
};
