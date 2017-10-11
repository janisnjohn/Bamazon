var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Artesia1!",
  database: "bamazon"
});
start();
function start(){

inquirer.prompt([
	{
		name: "action",
		message: "Choose a management function.",
		choices: ["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product"],
		type: "list",
    	validate: function(choice){
      	  	if(choices === ''){
        	console.log('Try again!')
        	return false;
      		}
      		else {
        	return true;
      		}
		}
	}
	
	]).then(function(answer){
	switch (answer.action) {
        case "View Products for Sale":
          viewProduct();
          break;

        case "View Low Inventory":
          viewInventory();
          break;

        case "Add to Inventory":
          addInventory();
          break;

        case "Add New Product":
          addProduct();
          break;
      }
	})
};

function viewProduct(){
	connection.connect(function(err) {
  	if (err) throw err;
	connection.query("SELECT * FROM products", function(err, result, fields) {
	if (err) throw err;
		console.log("----------------------------------------------------------------------");
		console.log("Items Available for SALE.");
	for (var i = 0; i<result.length; i++){
		console.log("Id: " +result[i].id + "\r\nProduct Name:  " + result[i].product_name + "\r\nDepartment: " +result[i].department_name + "\r\nPrice: $"+result[i].price+".00"+ "\r\nQTY: " + result[i].stock_quantity);
		}
	})
})
	start();
};

function viewInventory(){
	connection.connect(function(err) {
  	if (err) throw err;
	connection.query("SELECT * FROM products", function(err, result, fields) {
		if (err) throw err;
			console.log("----------------------------------------------------------------------");
			console.log("These are items that have fewer than 5 in inventory.");
		for (var i = 0; i<result.length; i++){
			if(result[i].stock_quantity < 5) {
			console.log("Id: " +result[i].id + "\r\nProduct Name:  " + result[i].product_name + "\r\nDepartment: " +result[i].department_name + "\r\nPrice: $"+result[i].price+".00"+ "\r\nQTY: " + result[i].stock_quantity);
			}
		}
	})
	})
	start();
};

function addInventory(){

inquirer.prompt([
	{
		name: "action",
		message: "Which Inventory ID would you like to add?",
		type: "input",
    	validate: function(input){
      	  	if(input === ''){
        	console.log('Try again!')
        	return false;
      		}
      		else {
        	return true;
      		}
		}
	},
	{
		name: "qty",
		message: "How many more would you like to add?",
		type: "input",
    	validate: function(input){
      	  	if(input === ''){
        	console.log('Try again!')
        	return false;
      		}
      		else {
        	return true;
      		}
		}
	}
	
	]).then(function(answer){
	let id = answer.action;
	let qty = answer.qty;
	connection.query("SELECT * FROM products WHERE id = '" + id +"'", function(err, result, fields) {
	if (err) throw err;	
	
	console.log("this is sum" + sum);
	for (var i=0; i<result.length; i++){
	let sum = qty + result[i].stock_quantity;
	connection.query("UPDATE products SET? WHERE? ", [
			{      			
      			stock_quantity: sum
      		},
      		{
      			id: id
      		}
      		],
            function(error) {
              if (error) throw err;
              console.log("Inventory was successfully updated!");
              console.log("New Inventory for ID " + id + " is "+ sum);
      		}
      		);
}
});
});
};