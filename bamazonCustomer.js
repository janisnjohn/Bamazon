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

connection.connect(function(err) {
  if (err) throw err;
connection.query("SELECT * FROM products", function(err, result, fields) {
	if (err) throw err;
		console.log("----------------------------------------------------------------------");
		console.log("Items Available for SALE.");
	for (var i = 0; i<result.length; i++){
		console.log("Id: " +result[i].id + "\r\nProduct Name:  " + result[i].product_name + "\r\nDepartment: " +result[i].department_name + "\r\nPrice: $"+result[i].price+".00"+ "\r\nQTY: " + result[i].stock_quantity);
	}
		start();

})
});

function start(){
	inquirer.prompt([
	{
		name: "id",
		message: "What ID of the product do you like to buy?",
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
		message: "How many would you like to buy?",
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
	let id = answer.id;
	let qty = answer.qty;
    connection.query("SELECT * FROM products WHERE id = '" + id +"'", function(err, result, fields){
      if(err){
        throw err;
      }
      console.log("ID: " + answer.id + "\r\nQTY to buy: " + answer.qty);
      for (var i=0; i<result.length; i++){
      	console.log(result[i].stock_quantity);
      	if (result[i].stock_quantity >= qty){
      		var sum = result[i].stock_quantity- qty;
      		var sumCost = result[i].price*qty;
      		console.log(sum);
      		connection.query("UPDATE products SET? WHERE? ", [{      			
      			stock_quantity: sum
      		},
      		{
      			id: id
      		}

      		],
            function(error) {
              if (error) throw err;
              console.log("Order was placed successfully!");
              console.log("Total Cost for order is: " + "$"+sumCost+".00");
      		}
      	);

      } else {
      	console.log("QTY available is: " + result[i].stock_quantity + " You can only buy as much as what is available.  Please choose another ID and quantity.");
      	start();
      }

};

});
});
}
