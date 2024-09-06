const nano = require("nano")("http://admin:angusd3i@127.0.0.1:5984");

const username = "admin";
const userpass = "angusd3i";

const QuovadisDb = {};

QuovadisDb.StoreDocument = async (doc) => {
  db.insert(doc, "foobar", function (error, foo) {
    if(err) {
      return console.log("I failed");
    }
    db.insert({foo: "bar", "_rev": foo.rev}, "foobar", 
    function (error, response) {
      if(!error) {
        console.log("it worked");
      } else {
        console.log("sad panda");
      }
    });
  });
}; 

QuovadisDb.saveDocument = async (doc) => {
    try {
      const db = nano.db.use("cbot");
      const document = await db.insert(doc);
      console.log(document);
      return document;
    } catch (error) {
       console.log("Unable to save ",error);
    } 
  }; 

 QuovadisDb.getDocument = async (docId)=>{
    try {
      // Attempt to fetch the document
      const db = nano.db.use("cbot");
      const doc = await db.get(docId);
      console.log(doc)
      return doc; // Document exists, return it
    } catch (err) {
      if (err.error === 'not_found') {
        // Document does not exist
      //  console.error('Error fetching document:', err);
     //   throw err;
        return false;
      } else {
        // Some other error occurred
        console.error('Error fetching document:', err);
        throw err;
      }
    }
  }
 
module.exports = QuovadisDb;
  