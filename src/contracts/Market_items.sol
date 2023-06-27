pragma solidity ^0.5.0;

contract Market_items {
    string public name;

    //Initial count of Product is set to 0
    uint public productCount = 0;
    mapping(uint => Product) public products;

    // product params
    struct Product {
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
    }

    event ProductCreated(
        uint id, 
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    event ProductPurchased(
        uint id, 
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    //Constructor
    constructor() public {
        name = "Market items";
    }

    function createProduct(string memory _name, uint _price) public {

        //Require a name
        require(bytes(_name).length > 0);

        //Require a valid price
        require(_price > 0);
        //Increment productCount
        productCount ++;
        
        //create the product
        products[productCount] = Product(productCount, _name, _price, msg.sender, false);
        
        //trigger an event
        emit ProductCreated(productCount, _name, _price, msg.sender, false);
    }

    function purchaseProduct(uint _id) public payable{
        //Fetch the product
        Product memory _product = products[_id];

        //Fetch the owner
        address payable _seller = _product.owner;
 
        //make sure product is valid
        
 
        //Transfer ownership to the buyer
        _product.owner = msg.sender;
 
        //Mark as purchased
        _product.purchased = true;
 
        //update the product
        products[_id] = _product;
        //Pay the seller sending them Ether
        address(_seller).transfer(msg.value);

        //Trigger an event
        emit ProductPurchased(productCount, _product.name, _product.price, msg.sender, true);

    }
}



