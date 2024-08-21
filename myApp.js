const mongoose = require('mongoose');
require('dotenv').config();

const clientOptions = {
  useNewUrlParser: true,             // Handle URL parsing deprecation
  useUnifiedTopology: true,          // Handle Server Discovery and Monitoring engine deprecation
  writeConcern: { w: 'majority' },   // Properly set write concern options
  appName: "Cluster0",               // Explicitly set the application name
};

async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI, clientOptions);
    console.log(`Successfully connected to MongoDB!! Connected to database: ${connectionInstance.connection.name}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectDB()

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number
  },
  favoriteFoods: {
    type: [String]
  }
})

const Person = mongoose.model("Person", personSchema)

const createAndSavePerson = (done) => {
  const person = new Person({
    name: "yashh",
    age: 21,
    favoriteFoods: ["paneer", "eggs"]
  })

  person.save((err, data) => {
    if(err) return console.error(err)
    done(null, data)
  })
};

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, people) => {
    if(err) return console.error(err)
    done(null, people)
  })
};

const findPeopleByName = (personName, done) => {
  Person.find({name : personName}, (err, personFound) => {
    if(err) return console.error(err)
    done(null, personFound)
  })
};

const findOneByFood = (food, done) => {
  Person.findOne({favoriteFoods: food}, (err, foodFound) => {
    if(err) return console.error(err)
    done(null, foodFound)
  })
};

const findPersonById = (personId, done) => {
  Person.findById(personId, (err, data) => {
    if(err) return console.error(err)
    done(null, data)
  })
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  Person.findById(personId, (err, person) => {
    if(err) return console.log(err)

    person.favoriteFoods.push(foodToAdd)

    person.save((err, updatedPerson) => {
      if(err) return console.log(err)

      done(null, updatedPerson)
    })
  })
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate(
    {name: personName},
    {age: ageToSet},
    {new: true},
    (err, updatedDoc) => {
      if(err) return console.log(err)
      done(null, updatedDoc)
    }
  )
};

const removeById = (personId, done) => {
  Person.findByIdAndDelete(personId, (err, data) => {
    if(err) return console.log(err)
    
    done(null, data)
  })
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";

  Person.remove({name: nameToRemove}, (err, data) => {
    if(err) return console.log(err)
    
    done(null, data)
  })
};

const queryChain = (done) => {
  const foodToSearch = "burrito";

  Person
    .find({favoriteFoods: foodToSearch})
    .sort({name : 1})
    .limit(2)
    .select({name: 1})
    .exec((err, data) => {
      if(err) return console.log(err)
      
      done(null, data)
    })
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
