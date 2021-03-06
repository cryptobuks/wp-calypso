/** @format */

/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get, unionBy } from 'lodash';

/**
 * Internal dependencies
 */
import { getPluginsWithUpdates } from 'state/plugins/installed/selectors';
import { requestSiteAlerts } from 'state/data-getters';
import config from 'config';

const emptyList = [];

export default WrappedComponent => {
	class ToUpdate extends Component {
		static propTypes = {
			siteId: PropTypes.number,

			// Connected
			plugins: PropTypes.arrayOf( PropTypes.object ),
			themes: PropTypes.arrayOf( PropTypes.object ),
		};

		state = {
			// Plugins already updated + those with pending updates
			plugins: emptyList,
			siteId: this.props.siteId,
		};

		static getDerivedStateFromProps( nextProps, prevState ) {
			return {
				plugins:
					nextProps.siteId === prevState.siteId
						? unionBy( nextProps.plugins, prevState.plugins, 'slug' )
						: emptyList,
				siteId: nextProps.siteId,
			};
		}

		render() {
			return (
				<WrappedComponent
					{ ...this.props }
					siteId={ this.props.siteId }
					plugins={ this.state.plugins }
					themes={ this.props.themes }
				/>
			);
		}
	}
	return connect( ( state, { siteId } ) => {
		return {
			plugins: getPluginsWithUpdates( state, [ siteId ] ),
			themes: config.isEnabled( 'activity-log-theme-update' )
				? get( requestSiteAlerts( siteId ), 'data.updates.themes', emptyList )
				: emptyList,
		};
	} )( ToUpdate );
};
