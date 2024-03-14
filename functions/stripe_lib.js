const Stripe = require('stripe');

module.exports = {
    createStripeSubscription: async (payloadReceived, STRIPE_SECRET, APP_DOMAIN_CUSTOM, APP_NAME) => {
        const userEmail = payloadReceived.email;
        const userId = payloadReceived.uid;
        const currency = payloadReceived.currency;
        const price = payloadReceived.price;

        const period = payloadReceived.period;
        const upgradePeriod = payloadReceived.upgradePeriod;

        const customer_email = userEmail;
        const mode = 'payment';
        //DEV
        // const success_url = `http://127.0.0.0:5000/${process.env.SUCCESS_URL}`;
        // const cancel_url = `http://127.0.0.0:5000/${process.env.CANCEL_URL}`;
        //PROD
        const success_url = `${APP_DOMAIN_CUSTOM}/${process.env.SUCCESS_URL}`;
        const cancel_url = `${APP_DOMAIN_CUSTOM}/${process.env.CANCEL_URL}`;
        const automatic_tax = { enabled: true };

        if (!period || !currency) {
            return ({ error: 'Internal Server Error.', code: 500, status: 'Error' })
        };

        let session = null;

        let objectToCreateSession = (isUpgrade) => {
            let DESCRIPTION_STRING = `${APP_NAME} subscription for ${period}.`;
            let METADATA_TO_ADD = { uid: userId, period };

            if (isUpgrade == true) {
                DESCRIPTION_STRING = `${APP_NAME} subscription upgrade to Premium.`;
                METADATA_TO_ADD = { uid: userId, period, upgradePeriod }
            }
            return ({
                line_items: [
                    {
                        price_data: {
                            currency: currency,
                            product_data: {
                                name: DESCRIPTION_STRING,
                            },
                            unit_amount: Math.trunc(price * 100),
                        },
                        quantity: 1,
                    },
                ],
                metadata: { ...METADATA_TO_ADD },
                customer_email,
                mode,
                success_url,
                cancel_url,
                automatic_tax
            })
        }

        try {
            const stripe = new Stripe(STRIPE_SECRET);
            if (upgradePeriod != null || upgradePeriod != undefined) {
                // upgrade a plan
                session = await stripe.checkout.sessions.create(objectToCreateSession(true))

            } else {
                // crete a new subscription 
                session = await stripe.checkout.sessions.create(objectToCreateSession(false))
            }
        } catch (error) {

            return ({ status: 'Error', message: error.raw.message ? error.raw.message : 'unable to create stripe session', error: 'Internal Server Error.', code: 500 })
        }

        //stripe-hosted page
        if (session?.url) {
            return ({ payload: session.url, status: 'Success', code: 200 });
        } else {
            return ({ error: 'Internal Server Error.', status: 'Error', code: 500 });
        }
    },

    webhookStr: async (STRIPE_SECRET, STRIPE_WHSEC, sig, payloadBody, start) => {
        let event;

        try {
            const stripe = new Stripe(STRIPE_SECRET);
            event = stripe.webhooks.constructEvent(payloadBody, sig, STRIPE_WHSEC);
        } catch (err) {

            return ({ message: `Event.object Error: ${err.message}`, status: 'Error', code: 400 });
        }
        if (!event) {
            return ({ message: `Event.object Error: Event is Null`, status: 'Error', code: 400 });
        }
        if (!event.type) {
            return ({ message: `Event.object Error: no Event.type`, status: 'Error', code: 400 });
        }
        if (event.type === 'checkout.session.completed') {

            if (event.data.object.metadata.uid && event.data.object.metadata.uid !== undefined && event.data.object.metadata.period && event.data.object.metadata.period != undefined) {
                let subscriptionPeriod;
                let type;
                if (event.data.object.metadata.upgradePeriod != null || event.data.object.metadata.upgradePeriod != undefined) {
                    type = 'Premium';
                    subscriptionPeriod = Number(event.data.object.metadata.upgradePeriod);
                } else {

                    const year = 31536000000;
                    const halfYear = 15768000000;

                    if (event.data.object.metadata.period === '1 year') {
                        subscriptionPeriod = start + year;
                        type = 'Premium';
                    } else {
                        type = 'Basic';
                        subscriptionPeriod = start + halfYear;
                    }
                }
                return ({ payload: { type, subscriptionPeriod, id: event.data.object.metadata.uid }, status: 'Success', code: 200 })
            }
        } else {
            return ({ status: 'Error', message: 'Session incomplete successfully', code: 400 })
        }
    }
}