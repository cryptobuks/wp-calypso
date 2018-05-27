/** @format */

export const purchasesRoot = '/me/purchases';

export const addCreditCard = purchasesRoot + '/add-credit-card';

export const billingHistory = purchasesRoot + '/billing';

export function billingHistoryReceipt( receiptId = ':receiptId' ) {
	return `${ billingHistory }/${ receiptId }`;
}

export function managePurchase( _, purchaseId = ':purchaseId' ) {
	return `${ purchasesRoot }/${ purchaseId }`;
}

export function cancelPurchase( _, purchaseId ) {
	return managePurchase( null, purchaseId ) + '/cancel';
}

export function confirmCancelDomain( _, purchaseId ) {
	return managePurchase( null, purchaseId ) + '/confirm-cancel-domain';
}

export function cancelPrivacyProtection( _, purchaseId ) {
	return managePurchase( null, purchaseId ) + '/cancel-privacy-protection';
}

export function addCardDetails( _, purchaseId ) {
	return managePurchase( null, purchaseId ) + '/payment/add';
}

export function editCardDetails( _, purchaseId, cardId = ':cardId' ) {
	return `${ managePurchase( null, purchaseId ) }/payment/edit/${ cardId }`;
}
