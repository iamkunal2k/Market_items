const { assert } = require("chai");

const Market_items = artifacts.require("./Market_items.sol");

contract('Market_items', (accounts) => {
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
})

