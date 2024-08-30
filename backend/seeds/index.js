const mongoose = require('mongoose');
const UserView = require('../models/userView');
const connectDb = require('../configs/db');

// Connection Database 
connectDb();


const getRandomDate = function(from, to) {
    from = from.getTime();
    to = to.getTime();
    return new Date(from + Math.random() * (to - from));
}

// Insert record into userView Collections
const records=[];
const randomStartDate = new Date('2019-09');
const randomEndDate = new Date();

for(let productId=1; productId<=100; productId++){
    for(let userId=1; userId<=50; userId++){
        records.push({
            productId,
            userId,
            viewDate: getRandomDate(randomStartDate,randomEndDate)
        })
    }
}


console.time("Time spend on inserting:");
UserView.insertMany(records,function(error, docs) {
    console.timeEnd("Time spend on inserting:");
    if(error){
        console.log(`Error Occurs during inserting`);
    } else {
        console.log(`Docs inserted successfully`);
    }
    process.exit(0);
})

