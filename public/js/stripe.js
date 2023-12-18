/*eslint-disable*/
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  const stripe = Stripe(
    'pk_test_51OKDqOIiDgAuwlSLkiD7L2tsItLYrigVKFqIyewvTvYHLBpusgJ3tsELxyn390cnoM1UjyVdVX2AIQUhJrowFpd50010JQoQQI',
  );

  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // console.log(session);

    // 2) Create checkout form + charge credit card
    // await stripe.redirectToCheckout({
    //     sessionId: session.data.session.id
    // });
    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
