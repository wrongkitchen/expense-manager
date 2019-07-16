import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { withTracker } from 'meteor/react-meteor-data';
import Moment from "moment";
import { Content, ContentHeader, Box, BoxHeader, BoxBody } from '../../../../components/adminlte';
import Expense from "../../../../../startup/both/Expenses";

const StatisticView = (props) => {
	const current_date = Moment().endOf('month').endOf('day').month() + 1;
	const expenses = props.expense;
	const [currnetTotal, setCurrentTotal] = useState(0);
	const [total_1, setTotal_1] = useState(0);
	const [total_2, setTotal_2] = useState(0);
	const [total_3, setTotal_3] = useState(0);
	const [total_4, setTotal_4] = useState(0);
	const [total_5, setTotal_5] = useState(0);
	
	useEffect(() => {
		let _current = 0, _total_1 = 0, _total_2 = 0, _total_3 = 0, _total_4 = 0, _total_5 = 0;
		for(let i=0; i<expenses.length; i++){
			const expenseMonth = Moment(expenses[i].date).month() + 1;
			if(expenseMonth == current_date) _current += parseFloat(expenses[i].amount);
			if(expenseMonth == current_date - 1) _total_1 += parseFloat(expenses[i].amount);
			if(expenseMonth == current_date - 2) _total_2 += parseFloat(expenses[i].amount);
			if(expenseMonth == current_date - 3) _total_3 += parseFloat(expenses[i].amount);
			if(expenseMonth == current_date - 4) _total_4 += parseFloat(expenses[i].amount);
			if(expenseMonth == current_date - 5) _total_5 += parseFloat(expenses[i].amount);
		}
		setCurrentTotal(_current);
		setTotal_1(_total_1);
		setTotal_2(_total_2);
		setTotal_3(_total_3);
		setTotal_4(_total_4);
		setTotal_5(_total_5);
	}, [expenses]);

	return(
		<div className="statistic-content">
			<ContentHeader
				name="Overview"
				description="overview"
				breadcrumb="overview"
				breadcrumbIcon="fa fa-dashboard"
			/>
			<Content>
				<div className="row">
					<div className="col-sm-6">
					<Box>
						<BoxHeader>Expense Chart</BoxHeader>
						<BoxBody>
							<div className="chart">
								<Line options={{
									elements: {
										line: {
											tension: 0 // disables bezier curves
										}
									}
								}} data={{
										labels: [
											(((current_date - 5 + 12) % 12) || 12) + "月",
											(((current_date - 4 + 12) % 12) || 12) + "月",
											(((current_date - 3 + 12) % 12) || 12) + "月",
											(((current_date - 2 + 12) % 12) || 12) + "月",
											(((current_date - 1 + 12) % 12) || 12) + "月",
											current_date+"月"
										],
										datasets: [{
											label: 'Expenses',
											data: [ total_5, total_4, total_3, total_2, total_1, currnetTotal ]
										}]
									}}>
								</Line>
							</div>
						</BoxBody>
					</Box>
					</div>
					<div className="col-sm-6">
						<Box>
							<BoxHeader>Expense List</BoxHeader>
							<BoxBody>
								<table className="table table-condensed text-center" width="100%">
									<tbody>
										<tr>
											<td>{((current_date - 5 + 12) % 12) || 12}月</td>
											<td>{((current_date - 4 + 12) % 12) || 12}月</td>
											<td>{((current_date - 3 + 12) % 12) || 12}月</td>
											<td>{((current_date - 2 + 12) % 12) || 12}月</td>
											<td>{((current_date - 1 + 12) % 12) || 12}月</td>
											<td>{current_date}月</td>
										</tr>
										<tr>
											<td>{total_5}</td>
											<td>{total_4}</td>
											<td>{total_3}</td>
											<td>{total_2}</td>
											<td>{total_1}</td>
											<td>{currnetTotal}</td>
										</tr>
									</tbody>
								</table>
							</BoxBody>
						</Box>
					</div>
				</div>
			</Content>
		</div>
	)
};

export default withTracker(() => {
	
	Meteor.subscribe('expense.six_month');
	
	return {
		expense: Expense.find().fetch()
	};

})(StatisticView);