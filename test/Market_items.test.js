const { assert } = require("chai");

require('chai')
.user(require('chai-as-promised'))
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
        
        //FAILURE
        })
        
    })








})

