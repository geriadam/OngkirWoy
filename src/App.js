import React, { Component } from 'react';
import SearchForm from './SearchForm';

class App extends Component {
    render() {
        return (
        	<div>
        		<div className="col-sm-12 col-md-12 col-lg-12">
	        		<div className="card card-primary">
	        			<div className="card-body">
	        				<h1 className="card-title">
	        					Selamat datang
	        				</h1>
							<h2 className="card-text">di OngkirWoy
									<i className="fa fa-truck"></i>
							</h2>
	        			</div>
	        		</div>
	        	</div>
	        	<br />
	            <div className="container">
            		<div className="row">
	                	<SearchForm />
	                </div>
	            </div>
        	</div>
        );
    }
}

export default App;
