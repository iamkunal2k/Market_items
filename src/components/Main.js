import React, { Component } from 'react';

class Main extends Component {

    render() {
        return (
            <div id='content'>
                <h1>Add Product</h1>
                <form >
                    <div className="form-group mr-sm-2">
                        <input
                            id="productName"
                            type="text"
                            className="form-control"
                            placeholder="Product Name"
                            required />
                    </div>
                    <div className="form-group mr-sm-2">
                        <input
                            id="productPrice"
                            type="text"
                            className="form-control"
                            placeholder="Product Price"
                            required />
                    </div>
                    <button type="submit" className="btn btn-primary">Add Product</button>
                </form>
            </div>

        );
    }
}

export default Main;
