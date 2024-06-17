import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || ' ', {
	//@ts-ignore
	apiVersion: '2022-11-15', // Use a valid API version
	typescript: true,
});
