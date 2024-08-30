# User View Report

## Setup 
```
$ git clone 
$ npm install 
```
#### Database Connection
Update DB_CONNECTION_STRING variable in configs/db.js file
```
const  DB_CONNECTION_STRING  =  'mongodb://localhost:27017/reports';
```

## Seeding
It will create userView collection with 500000 records.
```
$ npm run seed
```

## Run
```
$ npm run start
```
Open the browser `http://localhost:8100/getViewReport?startDate=2019-10-10&endDate=2019-11-10` 
It will get all record view & user count between start and end date.

## Output
```
[
	{
		"_id":  "998",            // Product Id
		"viewCount":  370,
		"uniqueUsers":['1','232'] // Unique user Ids
		"uniqueUserCount":2,
		"totalUser":6
	}
	...
]
```

## Basic functionality
Following mongodb Query we used to get user view report
```
db.getCollection('userviews').aggregate([
    
   { $match:{'viewDate':{ $gte:ISODate("2019-05-10"), $lt:ISODate("2019-12-28")}} },
   {
     $group:{_id:'$productId', viewCount:{$sum:1}, uniqueUsers:{$addToSet:"$userId"}}
   },{
       $addFields:{uniqueUserCount:{$size:'$uniqueUsers'}}
   }
])
```

We have test this query with 1 millon records and it's taking **0.867 sec** to get records.
[https://prnt.sc/q2q5bu](https://prnt.sc/q2q5bu)