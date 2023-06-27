const { assert } = require("chai");

require('chai')
  .use(require('chai-as-promised'))
  .should()

const Market_items = artifacts.require("./Market_items.sol");

contract('Market_items', ([deployer, seller, buyer]) => {
    let market_items

    before(async () => {
        market_items = await Market_items.deployed()
    })

    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address = await market_items.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('has a name', async () => {
            const name = await market_items.name()
            assert.equal(name, 'Market items')
        })
    })

    describe('products', async () => {
        let result, productCount

        before(async () => {
            result = await market_items.createProduct('iPhone14', web3.utils.toWei('1', 'Ether'), {from: seller})  //Price is expressed in Wei, so for 1 ether = 1 followed by (0x18)
            productCount = await market_items.productCount()
        })

        it('creates products', async () => {
            //SUCCESS
            assert.equal(productCount, 1)
            // to fetch all details of the product >> console.log(result.logs)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), productCount.toNumber(), "id is correct")
            assert.equal(event.name, "iPhone14" , 'name is correct')
            assert.equal(event.price, 1000000000000000000 , 'price is correct')
            assert.equal(event.owner, seller, 'is correct')
            assert.equal(event.purchased, false, ' purchased is correct')
        
        //FAILURE :product must have a name
        await await market_items.createProduct('', web3.utils.toWei('1', 'Ether'), { from: seller }).should.be.rejected;

        // FAILURE: Product must have a price
        await await market_items.createProduct('iPhone14', 0, { from: seller }).should.be.rejected;
        })

        it('lists products', async () => {
            const product = await market_items.products(productCount)
            assert.equal(product.id.toNumber(), productCount.toNumber(), 'id is correct')
            assert.equal(product.name, 'iPhone14', 'name is correct')
            assert.equal(product.price, '1000000000000000000', 'price is correct')
            assert.equal(product.owner, seller, 'owner is correct')
            assert.equal(product.purchased, false, 'purchased is correct')
          })

        it('sells products', async () => {
            //Track the seller balance before purchase
            let oldSellerbalance
            oldSellerbalance = await web3.eth.getBalance(seller)
            oldSellerbalance = new web3.utils.BN(oldSellerbalance)

            //SUCCRSS: Buyer makes purchase
            result = await market_items.purchaseProduct(productCount, {from : buyer, value : web3.utils.toWei('1', 'Ether')})
            
            //Check logs
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), productCount.toNumber(), "id is correct")
            assert.equal(event.name, "iPhone14" , 'name is correct')
            assert.equal(event.price, 1000000000000000000 , 'price is correct')
            assert.equal(event.owner, buyer, 'is correct')
            assert.equal(event.purchased, true, ' purchased is correct')
        
            // Check that seller received funds
            let newSellerBalance
            newSellerBalance = await web3.eth.getBalance(seller)
            newSellerBalance = new web3.utils.BN(newSellerBalance)

            let price
            price = web3.utils.toWei('1', 'Ether')
            price = new web3.utils.BN(price)

            const expectedBalance = oldSellerbalance.add(price)
            assert.equal(newSellerBalance.toString(), expectedBalance.toString())
            
            //FAILURE : Tries to buy product that does not exist i.e., product must have valid id
            await market_items.purchaseProduct(99, { from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;      // FAILURE: Buyer tries to buy without enough ether
            
            // FAILURE: Buyer tries to buy without enough ether
            await market_items.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('0.5', 'Ether') }).should.be.rejected;
            
            // FAILURE: Deployer tries to buy the product, i.e., product can't be purchased twice
            await market_items.purchaseProduct(productCount, { from: deployer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
            
            // FAILURE: Buyer tries to buy again, i.e., buyer can't be the seller
            await market_items.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
      

        })

    })








})

