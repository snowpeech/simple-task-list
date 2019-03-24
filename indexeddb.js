//the database reference
let db;

//initializes the database
function initDatabase() {

  //create a unified variable for the browser variant
  window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

  window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;

  window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

    //if a variant wasn't found, let the user know
  if (!window.indexedDB) {
      window.alert("Your browser doesn't support a stable version of IndexedDB.")
  }

   //attempt to open the database
  let request = window.indexedDB.open("guest", 1);
  request.onerror = function(event) {
    console.log(event);
  };

   //map db to the opening of a database
  request.onsuccess = function(event) { 
    db = request.result;
    console.log("success: " + db);
      readAll();
  };

   //if no database, create one and fill it with data
  request.onupgradeneeded = function(event) {
      var db = event.target.result;
      var objectStore = db.createObjectStore("guest", {keyPath:"id",autoIncrement:true});
   }
}

//adds a record as entered in the form
function add() {

  //get a reference to the fields in html
  let First = document.querySelector("#FirstName").value;

  // alert(First);
   
   //create a transaction and attempt to add data
  var request = db.transaction(["guest"], "readwrite")
  .objectStore("guest")
  .add({ FirstName:First });

   //when successfully added to the database
  request.onsuccess = function(event) {
    // alert(`You're all set! `);
      readAll();

      document.querySelector("#FirstName").value ="";
      // document.querySelector("#LastName").value ="";
      // document.querySelector("#email").value ="";
      // document.querySelector("#Notes").value ="";
  };

   //when not successfully added to the database
  request.onerror = function(event) {
  alert(`already here! `);
  }
}

//reads all the data in the database
function readAll() {
   var objectStore = db.transaction("guest").objectStore("guest");
   
   document.querySelector("#display").innerHTML=" ";
   //creates a cursor which iterates through each record
   objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      
      if (cursor) {
         addEntry(cursor.value.FirstName, cursor.value.id);
         cursor.continue();
      }
   };
}

 function addEntry(firstname,id) {
     // Your existing code unmodified...
    var iDiv = document.createElement('div');
    iDiv.className = 'Guest'; //This is setting the class of the created div called Guest
    iDiv.innerHTML = firstname + `<button class="kill" onclick="remove(${id})">X</button>`;
    document.querySelector("#display").appendChild(iDiv);
 }

 function remove(item) {
    var request = db.transaction(["guest"], "readwrite").objectStore("guest").delete(item);

    console.log(item);
    
    request.onsuccess = function(event) {
       console.log("Entry has been removed from your database.");
    };
    readAll();
 }

initDatabase();