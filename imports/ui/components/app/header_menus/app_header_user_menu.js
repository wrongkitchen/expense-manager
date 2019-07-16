import { Meteor } from 'meteor/meteor';
import React from 'react';

export default AppHeaderUserMenu = (props) => {

	const logout = () => {
		Meteor.logout(() => {
			window.location.href = "/";
		});
	}

	const userDisplayName = () => {
		const currentUser = props.user;
		let name = 'Alexander Pierce';

		if (currentUser) {
			name = currentUser.emails[0].address;
		}

		return name;
	}

	return (
		<li className="dropdown user user-menu">
			<a href="#" className="dropdown-toggle" data-toggle="dropdown">
				<img
					src="/img/user2-160x160.jpg"
					className="user-image"
					alt="User"
				/>
				<span className="hidden-xs">{userDisplayName()}</span>
			</a>

			<ul className="dropdown-menu">

				<li className="user-header">
					<img
						src="/img/user2-160x160.jpg"
						className="img-circle"
						alt="User"
					/>
					<p>
						{userDisplayName()} - Admin <small>Admin since Jun. 2016</small>
					</p>
				</li>

				<li className="user-body">
					<div className="row">
						<div className="col-xs-4 text-center">
							<a href="#">Followers</a>
						</div>
						<div className="col-xs-4 text-center">
							<a href="#">Sales</a>
						</div>
						<div className="col-xs-4 text-center">
							<a href="#">Friends</a>
						</div>
					</div>
				</li>

				<li className="user-footer">
					<div className="pull-left">
						<a href="#" className="btn btn-default btn-flat">Profile</a>
					</div>
					<div className="pull-right">
						<a href="#" className="btn btn-default btn-flat" onClick={logout}>Sign out</a>
					</div>
				</li>

			</ul>
		</li>
	);

}