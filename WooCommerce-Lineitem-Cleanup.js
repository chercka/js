/*
For use in Zapier.com's 'code action' which allows for manipulation of code via js.
Made for a project where new WooCommerce orders automatically create new events in a Google Calendar, specifically dropoff and pickup 
dates for a rental company that delivers/picks up equipment from customers. Since the customer wanted easy to read google cal descriptions,
we had to strip out unnecessary data from the order API.

The script takes WooCommerce's Abstract Order array 'line_items', which Zapier unfortunately converts to one long string, finds product names and quantities in it, and outputs only them.  
This is to avoid the unnecessary output of meta, price, tax, sku, etc as well as to remedy items and their quantities displaying in two different arrays, like so:
	
	sku:
	tax:
	etc:
	meta:
	etc:
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

//Setup regexp for finding name and quantity start and end indices
var nameregexp = /name/g; 
var quanregexp = /quantity/g;
var prodidregexp = /product_id/g; //this is where name always ends
var skuregexp = /sku/g; //this is where quantity always ends

var input = inputData.lineitems; //zapier formatting 

//setup our empty arrays
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
//Cleanup a specific HTML character and apostrophe coming from Woo
var text = text.replace(/&rarr;/g, "->");
var text = text.replace(/&#8217;/g, "\'");

//Zapier expects an object called 'output' back, even though it's overkill in this case. So we give it an object with only one item. Any added items will show up as their own fields within Zapier.

var output = {Products:text};
