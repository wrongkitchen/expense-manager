import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import SideBar from '../components/sidebar/sidebar';
import AppHeader from '../components/app/app_header';
import AppFooter from '../components/app/app_footer';

import { GlobalProvider } from "../../startup/client/context";

const member_layout = (props) => {
    const { currentUser } = props;
    const contentMinHeight = {
        minHeight: `${window.innerHeight - 101}px`,
    };
    return (
        <GlobalProvider>
            <div className="wrapper">

                <AppHeader user={currentUser} history={props.history} />
                <SideBar user={props.currentUser} path={props.path} />
                
                <div className="content-wrapper" style={contentMinHeight} >
                    {props.children}
                </div>

                <AppFooter />
                <div className="control-sidebar-bg" />
                
            </div>
        </GlobalProvider>
    );
}

export default withTracker(() => {
	/**
	 * Add subscriptions here
	 */
	Meteor.subscribe('users');

	return {
		currentUser: Meteor.user()
	};
})(member_layout);