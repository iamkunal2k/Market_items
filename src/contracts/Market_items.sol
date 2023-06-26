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
        address owner;
        bool purchase;
    }

    event ProductCreated(
        uint id, 
        string name,
        uint price,
        address owner,
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
}



