
const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');
const Mongo_URL ="";


main()
.then(()=>{
    console.log("connnected to db");
    
})
.catch( (err) =>{
    console.log(err);  
})

  async function main()
  {
     await mongoose.connect(Mongo_URL);
  } 

const initDB = async() =>{
    await Listing.deleteMany({});

    initData.data = initData.data.map((obj) =>({
        ...obj,
        owner:"66ebe67533072a0bc09b0abd",
        
    }));

    await Listing.insertMany(initData.data);

    console.log("data was initilized");
}

initDB();

  
