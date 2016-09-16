/*
This script takes WooCommerce's Abstract Order array 'line_items', which Zapier unfortunately converts to one long string, finds product names and quantities in it, and outputs only them.  
This is to avoid the unnecessary output of meta, price, tax, sku, etc as well as to remedy items and their quantities displaying in two different arrays, like so:
	
	name: Product1, Product2, Product3
	quantity: 2,1,4
	
Instead we get

	Product1
	2
	Product2
	1
	Product3
	4
	
*/

//Setup regexp for finding name and quantity start and end points
var nameregexp = /name/g;
var quanregexp = /quantity/g;
var prodidregexp = /product_id/g; //this is where name ends
var skuregexp = /sku/g; //this is where quantity ends

var input = inputData.lineitems;

var namematch, namematches = [];
var quanmatch, quanmatches = [];
var prodidmatch, prodidmatches = [];
var skumatch, skumatches = [];

//Find Product Name Indices and add to array
while (( namematch = nameregexp.exec( input ) ) != null ) {
  namematches.push( namematch.index );
}
//Find Quantity Indices and add to array
while ( ( quanmatch = quanregexp.exec( input ) ) != null ) {
  quanmatches.push( quanmatch.index );
}
//Find product_id Indices and add to array
while ( ( prodidmatch = prodidregexp.exec ( input ) ) != null ) {
  prodidmatches.push(prodidmatch.index);
}
//Find sku indices and add to array
while ( ( skumatch = skuregexp.exec ( input ) ) != null ) {
  skumatches.push( skumatch.index );
}

//Now loop through however many instances were found and add the name/quantity to a text string.
var i = 0;
var text = "";

while ( i < namematches.length ) {
	 text += input.substring(namematches[i]+6, prodidmatches[i]) + input.substring(quanmatches[i]+10, skumatches[i]);
	i++;
}
//Zapier wants an object called 'output' back even though it's overkill in this case. So we give it an object with only one item. Any added items will show up as their own fields within Zapier.

var output = {Products:text};