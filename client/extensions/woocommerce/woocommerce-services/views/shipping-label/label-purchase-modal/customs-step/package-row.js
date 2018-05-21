/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import { map, uniq } from 'lodash';

/**
 * Internal dependencies
 */
import ItemRow, { Header as ItemRowHeader } from './item-row';
import TextField from 'woocommerce/woocommerce-services/components/text-field';
import Dropdown from 'woocommerce/woocommerce-services/components/dropdown';
import Checkbox from 'woocommerce/woocommerce-services/components/checkbox';
import {
	setContentsType,
	setContentsExplanation,
	setRestrictionType,
	setRestrictionExplanation,
	setAbandonOnNonDelivery,
	setITN,
} from 'woocommerce/woocommerce-services/state/shipping-label/actions';
import {
	getShippingLabel,
	isLoaded,
	getFormErrors,
} from 'woocommerce/woocommerce-services/state/shipping-label/selectors';

const PackageRow = ( props ) => {
	const {
		siteId,
		orderId,
		errors,
		packageId,
		translate,
		contentsType,
		contentsExplanation,
		restrictionType,
		restrictionExplanation,
		abandonOnNonDelivery,
		itn,
		items,
	} = props;
	const abandonHandler = () => props.setAbandonOnNonDelivery( ! abandonOnNonDelivery );

	return <div className="customs-step__package">
		<label htmlFor={ packageId + '_abandonOnNonDelivery' }>
			<Checkbox
				id={ packageId + '_abandonOnNonDelivery' }
				checked={ ! abandonOnNonDelivery }
				onChange={ abandonHandler } />
			<span>{ translate( 'Return to sender if package is unable to be delivered' ) }</span>
		</label>

		<div className="customs-step__restrictions-row">
			<div className="customs-step__contents-type">
				<Dropdown
					id={ packageId + '_contentsType' }
					title={ translate( 'Contents type' ) }
					value={ contentsType || 'merchandise' }
					updateValue={ props.setContentsType }
					valuesMap={ {
						merchandise: translate( 'Merchandise' ),
						documents: translate( 'Documents' ),
						gift: translate( 'Gift' ),
						sample: translate( 'Sample' ),
						other: translate( 'Other…' ),
					} } />
				{ 'other' === contentsType && <TextField
					id={ packageId + '_contentsExplanation' }
					title={ translate( 'Details' ) }
					value={ contentsExplanation || '' }
					updateValue={ props.setContentsExplanation }
					error={ errors.contentsExplanation } /> }
			</div>

			<div className="customs-step__restriction-type">
				<Dropdown
					id={ packageId + '_restrictionType' }
					title={ translate( 'Restriction type' ) }
					value={ restrictionType || 'none' }
					updateValue={ props.setRestrictionType }
					valuesMap={ {
						none: translate( 'None' ),
						quarantine: translate( 'Quarantine' ),
						sanitary_phytosanitary_inspection: translate( 'Sanitary / Phytosanitary inspection' ),
						other: translate( 'Other…' ),
					} } />
				{ 'other' === restrictionType && <TextField
					id={ packageId + '_restrictionExplanation' }
					title={ translate( 'Details' ) }
					value={ restrictionExplanation || '' }
					updateValue={ props.setRestrictionExplanation }
					error={ errors.restrictionExplanation } /> }
			</div>
		</div>

		<TextField
			id={ packageId + '_itn' }
			title={
				<span>{ translate( 'ITN' ) } (<a href="https://pe.usps.com/text/imm/immc5_010.htm"
					target="_blank" rel="noopener noreferrer">{ translate( 'more info' ) }</a>)</span>
			}
			value={ itn || '' }
			updateValue={ props.setITN }
			error={ errors.itn } />

		<div className="customs-step__item-rows">
			<ItemRowHeader />
			{ uniq( map( items, 'product_id' ) ).map( productId => (
				<ItemRow
					key={ productId }
					productId={ productId }
					packageId={ packageId }
					siteId={ siteId }
					orderId={ orderId } />
			) ) }
		</div>
	</div>;
};

PackageRow.propTypes = {
	siteId: PropTypes.number.isRequired,
	orderId: PropTypes.number.isRequired,
	packageId: PropTypes.string.isRequired,
};

const mapStateToProps = ( state, { orderId, siteId, packageId } ) => {
	const loaded = isLoaded( state, orderId, siteId );
	const shippingLabel = getShippingLabel( state, orderId, siteId );

	return {
		...shippingLabel.form.packages.selected[ packageId ],
		errors: loaded ? getFormErrors( state, orderId, siteId ).customs.packages[ packageId ] : {},
	};
};

const mapDispatchToProps = ( dispatch, { orderId, siteId, packageId } ) => ( {
	setContentsType: ( value ) => dispatch( setContentsType( orderId, siteId, packageId, value ) ),
	setContentsExplanation: ( value ) => dispatch( setContentsExplanation( orderId, siteId, packageId, value ) ),
	setRestrictionType: ( value ) => dispatch( setRestrictionType( orderId, siteId, packageId, value ) ),
	setRestrictionExplanation: ( value ) => dispatch( setRestrictionExplanation( orderId, siteId, packageId, value ) ),
	setAbandonOnNonDelivery: ( value ) => dispatch( setAbandonOnNonDelivery( orderId, siteId, packageId, value ) ),
	setITN: ( value ) => dispatch( setITN( orderId, siteId, packageId, value ) ),
} );

export default connect( mapStateToProps, mapDispatchToProps )( localize( PackageRow ) );
