import React, { useState, useEffect } from 'react';
import Moment from "moment";
import DatePicker from "react-datepicker";
import { withTracker } from 'meteor/react-meteor-data';
import Noty from 'noty';
import { Content, ContentHeader, Box, BoxHeader, BoxBody, BoxFooter } from '../../components/adminlte';
import Images from "../../../startup/both/Images";
import Expenses from "../../../startup/both/Expenses";

import "react-datepicker/dist/react-datepicker.css";
import "noty/lib/noty.css";
import "noty/lib/themes/mint.css";

const app = (props) => {

	let fileSelector = null;
	const [date, setDate] = useState(Moment().toDate());
	const [amount, setAmount] = useState("");
	const [desc, setDesc] = useState("");
	const [type, setType] = useState("");
	const [loading, setLoading] = useState(false);
	const [expenseThisMonth, setExpenseThisMonth] = useState([]);
	const resetForm = () => {
		setDate('');
		setAmount('');
		setDesc('');
	}

	const onFormSubmit = () => {
		let pass = true;
		if(!amount) pass = false;
		if(!date) pass = false;
		if(!type) pass = false;
		if(pass){
			setLoading(true);
			if(fileSelector.files.length > 0){
				uploadFile(fileSelector.files[0], (err, fileId) => {
					Meteor.call("form.insert", amount, date, fileId._id, desc, type, (err, res) => {
						setLoading(false);
						if(!err){
							new Noty({ text: 'Success', type: 'success', timeout: 2000 }).show();
							resetForm();
						} else {
							console.log(err);
						}
					});
				});
			} else {
				Meteor.call("form.insert", amount, date, "", desc, (err, res) => {
					setLoading(false);
					if(!err){
						new Noty({ text: 'Success', type: 'success', timeout: 2000 }).show();
						resetForm(); 
					} else {
						console.log(err);
					}
				});
			}
		} else {
			new Noty({ text: 'Complete the form', type: 'error', timeout: 2000 }).show();
		}
	}

	const uploadFile = (file, callback) => {
		const upload = Images.insert({
			file: file,
			streams: 'dynamic',
			chunkSize: 'dynamic'
		}, false);
		const _fileSelector = fileSelector;
		upload.on('start', () => {
			console.log("Started Upload");
		});
		upload.on('end', (error, fileObj) => {
			if (error) {
				callback(error, null);
			} else {
				callback(null, fileObj);
			}
		});
		upload.on('uploaded', function (error, fileObj) {
			_fileSelector.value = '';
		});
		upload.start();
	}
	const showAttachment = (e) => {
		const path = e.currentTarget.dataset.path;
		const newWindow = window.open();
		newWindow.location.href = "/file/" + path;
	}
	const fetchExpense = () => {
		return expenseThisMonth.map((data,index) => {
			let formatTime = function(datetime){
				return Moment(datetime).format('M月份');
			}
			return (<tr key={index}>
				<td>
					<button className="btn btn-default" data-path={(data.image && data.image.length) ? data.image[0]._id + data.image[0].extensionWithDot : ""} onClick={showAttachment}>
						<i className="fa fa-file"></i>
					</button>
				</td>
				<td>${data.amount}</td>
				<td>{data.type}</td>
				<td>{data.desc}</td>
				<td>{formatTime(data.date)}</td>
				<td className="text-right">
					<button onClick={()=>{
						removeExpense(data._id);
					}} className="btn btn-default">
						<i className="fa fa-trash"></i>
					</button>
				</td>
			</tr>);
		});
	}

	const removeExpense = (id) => {
		Meteor.call("form.remove", id, (err, res) => {
			if(err) new Noty({ text: 'Error', type: 'error', timeout: 2000 }).show();
		});
	}
	
	useEffect(() => {
		setExpenseThisMonth(props.expense);
	}, [props.expense]);

	return(
		<div className="statistic-content">
			<ContentHeader
				name="Expense"
				description="new expense"
				breadcrumb="New Expense"
				breadcrumbIcon="fa fa-dashboard"
			/>
			<Content>
				<Box>
					<BoxHeader>Expense</BoxHeader>
					<BoxBody>
						<div className="form-group">
							<label className="control-label">Amount</label>
							<input type="tel" id="amount" name="amount" className="form-control" value={amount} onChange={(e) => { setAmount(e.currentTarget.value); }} />
						</div>
						<div className="form-group">
							<label className="control-label">Description</label>
							<input type="text" id="desc" name="desc" className="form-control" value={desc} onChange={(e) => { setDesc(e.currentTarget.value); }} />
						</div>
						<div className="form-group">
								<label>Date:</label>
								<div className="input-group date">
									<div className="input-group-addon">
										<i className="fa fa-calendar"></i>
									</div>
									<DatePicker
										className="form-control pull-right"
										selected={date}
										onChange={(value) => { setDate(value) }}
									/>
								</div>
						</div>
						<div className="form-group">
							<label>Type:</label>
							<select className="form-control" value={type} onChange={(e) => { setType(e.currentTarget.value); }}>
								<option value="">---- Please Select Expense Type ----</option>
								<option value="transport">Transport</option>
								<option value="meal">Meal</option>
								<option value="travel">Travel</option>
								<option value="office_supplies">Office Supplies</option>
								<option value="event">Event</option>
							</select>
						</div>
						<div className="form-group">
							<label className="control-label">Receipt</label>
							<input ref={(input)=>{ fileSelector = input; }} className="form-control" type="file" id="receipt" name="receipt" />
						</div>
					</BoxBody>
					<BoxFooter>
						<button disabled={loading} onClick={onFormSubmit} className="btn btn-primary">Submit</button>
					</BoxFooter>
				</Box>
				<Box>
					<BoxHeader>Expenses - This Month</BoxHeader>
					<BoxBody>
						<table className="table table-condensed" width="100%">
							<tbody>
								<tr>
									<th>Receipt</th>
									<th>Amount</th>
									<th>Type</th>
									<th>Description</th>
									<th>Date</th>
									<th className="text-right">Action</th>
								</tr>
								{ fetchExpense() }
							</tbody>
						</table>
					</BoxBody>
				</Box>
			</Content>
		</div>
	)
};

export default withTracker(() => {
	
	Meteor.subscribe('expense.this_month');
	
	return {
		expense: Expenses.find().fetch()
	};

})(app);