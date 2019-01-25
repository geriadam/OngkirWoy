import React from 'react';
import NumberFormat from 'react-number-format';

const Result = ({data,loadingPost}) => {
	const loading = loadingPost;
	const costs = data.results[0].costs.map((cost, index) => {
		return (
			<tbody key={index}>
				<tr>
					<td>{ cost.service }</td>
					<td>{ cost.description }</td>
					<td>{ cost.cost[0].etd } Hari</td>
					<td><NumberFormat value={cost.cost[0].value} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} renderText={value => <div>{value}</div>} /></td>
				</tr>
			</tbody>
		)
	});

	return (
		<div>
			{
				!loading && 
				<div className="card">
					<div className="card-header">
						<p className="card-header-title">Detail Pengiriman : { data.results[0].name }</p>
					</div>
					<div className="card-body">
						<div className="table table-responsive">
							<table className="table table-striped">
								<thead>
									<tr>
										<th width="25%">Layanan</th>
										<th width="35%">Deskripsi</th>
										<th width="20%">Estimasi</th>
										<th width="20%">Biaya</th>
									</tr>
								</thead>
								{costs}
							</table>
						</div>
					</div>
				</div>
			}
			{
				loading && 
				<div className="card">
					<div className="card-body">
						<i className="fa fa-spinner fa-spin fa-3x"></i>
					</div>
				</div>
			}
		</div>
	)
}

export default Result;