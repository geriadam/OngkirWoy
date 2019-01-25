import React, { Component } from 'react';
import Result from './Result';
import config from './Config';
class SearchForm extends Component {

	constructor()
	{
		super()
		this.state = {
			origin: "",
			destination: "",
			weight: 1000,
			courier: "jne",
			provinceOrigin: '',
			provinceDestination: '',
			provinces: [],
			citiesOrigin: [],
			citiesDestination: [],
			finalResult: {},
			loadingProvinceOrigin: true,
			loadingProvinceDestination: true,
			loadingCitiesOrigin: true,
			loadingCitiesDestination: true,
			loadingPost: false,
			loading: true,
			limit: false
		}

		this.getCost = this.getCost.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount()
	{
		this.getProvince();
	}

	handleChange(event){
		const {name, value} = event.target;
		this.setState({
			[name]: value
		})

		if(name === "provinceOrigin"){
			this.getCity(value, null)
		} else if ( name === "provinceDestination") {
			this.getCity(null, value)
		}
	}

	getProvince()
	{
		this.setState({
            loadingProvinceOrigin: true,
            loadingProvinceDestination: true
        })

		fetch(`${config.path}provinsi.php`)
        .then((response) => response.json())
        .then((responseJson) => {
        	if ( responseJson.rajaongkir.status.code === 400 ) {
        		this.setState({
					loading : false,
					limit   : true
		        })
        	} else {
        		this.setState({
	                provinces: responseJson.rajaongkir.results,
	                provinceOrigin: responseJson.rajaongkir.results[0].province_id,
	                provinceDestination: responseJson.rajaongkir.results[0].province_id,
	                loadingProvinceOrigin : false,
	                loadingProvinceDestination : false,
	                loading: false
	            })

	            this.getCity(this.state.provinceOrigin, null)
				this.getCity(null, this.state.provinceDestination)
        	}
        })
        .catch((error) => {
            this.setState({
                loadingProvinceOrigin : false
            })

            alert('Terjadi error. Silahkan refresh halaman')
        });
	}

	getCity(province_id_origin, province_id_destination)
	{
		const province_id = province_id_origin ? province_id_origin : province_id_destination;

		if (province_id_origin) {
			this.setState({loadingCitiesOrigin : true})
		}

		if (province_id_destination) {
			this.setState({loadingCitiesDestination : true})
		}

		fetch(`${config.path}kota.php?provinsi_id=${province_id}`)
        .then((response) => response.json())
        .then((responseJson) => {
        	if (province_id_origin) {
        		this.setState({
        			provinceOrigin: responseJson.rajaongkir.query.province,
	                citiesOrigin: responseJson.rajaongkir.results,
	                origin: responseJson.rajaongkir.results[0].city_id,
	                loadingCitiesOrigin: false
	            })
			}
			if (province_id_destination) {
				this.setState({
					provinceDestination: responseJson.rajaongkir.query.province,
	                citiesDestination: responseJson.rajaongkir.results,
	                destination: responseJson.rajaongkir.results[0].city_id,
	                loadingCitiesDestination: false
	            })
			}
        })
        .catch((error) => {
            alert('Terjadi error. Silahkan refresh halaman')
        });
	}

	getCost(event)
	{
		event.preventDefault()
		this.setState({loadingPost : true})
		let cost = 'origin=' + this.state.origin + '&destination=' + this.state.destination + '&weight=' + this.state.weight + '&courier=' + this.state.courier
		return fetch(`${config.path}harga.php`, {
			method: 'POST',
			headers: {
		      'Content-Type': 'application/x-www-form-urlencoded'
		    },
		    body: cost,
		})
		.then((response) => response.json())
		.then((responseJson) => {
			this.setState({
				finalResult: responseJson.rajaongkir,
				loadingPost: false
			})

			this.renderResult();
		})
        .catch((error) => {
            this.setState({loadingPost : true})
            alert('Terjadi error. Silahkan refresh halaman')
        });
	}

	renderResult()
	{
		if (Object.keys(this.state.finalResult).length !== 0) {
		    return (
				<Result data={this.state.finalResult} loadingPost={this.state.loadingPost}/>
			)
		}
	}

	render (){

		return (
			<div className="col-sm-8 col-md-8 mx-auto">
				{
					this.state.loading && 
					<p className="title has-text-centered">
						<i className="fa fa-spinner fa-spin fa-3x"></i>
					</p>
				}

				{
					!this.state.loading && this.state.limit && 
					<div className="has-text-centered">
						<p className="title">
							<i className="fa fa-frown"></i>
						</p>
						<p className="subtitle">
							Maaf, Cek Ongkir sudah mencapai limit harian. <br/>
							Silahkan coba esok hari
						</p>
					</div>
				}

				<form>
					{
						!this.state.loading && !this.state.limit && <div className="card">
							<div className="card-header">
								<p className="card-header-title">Cek Ongkir Disini</p>
							</div>
							<div className="card-body">
								<div className="container">
									<div className="row">
										<div className="form-group">
											<label>Asal &nbsp; <i className="fa fa-plane"></i></label>
											{ 
												!this.state.loadingProvinceOrigin && <select
													name="provinceOrigin"
							 					 	value={this.state.provinceOrigin} 
											    	onChange={this.handleChange}
											    	className="form-control"
										    	>
											        {this.state.provinces.map((province) => 
											        	<option key={province.province_id} value={province.province_id}>{province.province}</option>
											        )}
												</select>
											}
											{
												this.state.loadingProvinceOrigin && <select className="form-control">
													<option>Memuat Provinsi</option>
												</select>
											}
										</div>
									</div>
									<div className="row">
										<div className="form-group">
											{
												!this.state.loadingCitiesOrigin && <select className="form-control" name="origin" value={this.state.origin} onChange={this.handleChange}>
											        {
											        	this.state.citiesOrigin.map(
											        		(city) => 
											        			<option key={city.city_id} value={city.city_id}>{city.city_name}</option>
											        	)
											        }
												</select>
											}
											{
												this.state.loadingCitiesOrigin && <select className="form-control">
													<option>Memuat Kota</option>
												</select>
											}
										</div>
									</div>
									<hr />
									<div className="row">
										<div className="form-group">
											<label>Tujuan &nbsp; <i className="fa fa-plane"></i></label>
											{
												!this.state.loadingProvinceDestination && <select
													name="provinceDestination"
													className="form-control"
							 					 	value={this.state.provinceDestination} 
											    	onChange={this.handleChange}
											    >
											        {this.state.provinces.map((province) => 
											        	<option key={province.province_id} value={province.province_id}>{province.province}</option>
											        )}
												</select>
											}
											{
												this.state.loadingProvinceDestination && <select className="form-control">
													<option>Memuat Provinsi</option>
												</select>
											}
										</div>
									</div>
									<div className="row">
										<div className="form-group">
											{
												!this.state.loadingCitiesDestination && <select className="form-control" name="destination" value={this.state.destination} onChange={this.handleChange}>
											        {
											        	this.state.citiesDestination.map(
											        		(city) => 
											        			<option key={city.city_id} value={city.city_id}>{city.city_name}</option>
											        	)
											        }
												</select>
											}
											{
												this.state.loadingCitiesDestination && <select className="form-control">
													<option>Memuat Kota</option>
												</select>
											}
										</div>
									</div>
									<hr />
									<div className="row col-md-12">
										<div className="col-md-6">
											<div className="form-group">
												<label>Jasa Pengiriman &nbsp; <i className="fa fa-truck"></i></label>
												<select
													className="form-control"
													name="courier"
							 					 	value={this.state.courier}
							 					 	onChange={this.handleChange}
											    >
											        <option value="jne">JNE</option>
													<option value="tiki">TIKI</option>
													<option value="pos">POS Indonesia</option>
												</select>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group">
												<label>Berat Barang &nbsp; <i className="fa fa-tags"></i></label>
												<div className="input-group mb-3">
													<input name="weight" value={this.state.weight} onChange={this.handleChange} type="text" className="form-control" />
												  	<div className="input-group-append">
												    	<span className="input-group-text" id="basic-addon2">gram</span>
												  	</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="card-footer">
								<button type="button" className="btn btn-primary" onClick={this.getCost}>
									Hitung
									{
										this.state.loadingPost && 
										<i className="fa fa-spinner fa-spin"></i>
									}
								</button>
							</div>
						</div>
					}
				</form>
				<br />
				{this.renderResult()}
			</div>
		)
	}
}

export default SearchForm;