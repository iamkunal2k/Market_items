import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import Market_items from '../abis/Market_items.json'
import Navbar from './Navbar'
import Main from './Main';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3

    // Steps to load the smart Contract in your webpage
    //load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Market_items.networks[networkId]

    if (networkData) {
      const market_items = web3.eth.Contract(Market_items.abi, networkData.address)
      this.setState({ market_items })
      const ProductCount = await market_items.methods.productCount().call()    // call() to read data
      this.setState({  ProductCount })
      // Load products
      for (var i = 1; i <= ProductCount; i++) {
        const product = await market_items.methods.products(i).call()
        this.setState({
          products: [...this.state.products, product]
        })
    }
      this.setState({ loading: false })
    }
    else {
      window.alert("Market_item contract not deployed to detected network.")
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      ProductCount: 0,
      products: [],
      loading: true
    }
    this.createProduct = this.createProduct.bind(this)    // ** Important (1)
  }

  createProduct(name, price) {
    this.setState({ loading : true })
    this.state.market_items.methods.createProduct(name, price).send({ from : this.state.account })  
    .once('receipt', (receipt) => {
      this.setState({ loading : false })
    })
  }


  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              { this.state.loading ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div> 
              : <Main 
              products={this.state.products}
              createProduct={this.createProduct}/> }    {/* Important (1) */} 
            </main>            
          </div>
        </div>
      </div>
    );
  }
}

export default App;
