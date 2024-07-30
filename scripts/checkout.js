import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts, loadProductsFetch } from "../data/products.js";
import { loadCart } from "../data/cart.js";
// import "../data/cart-class.js";
// import '../data/backend-practice.js'

async function loadPage() {
  // makes a function return a promise, and only works with promises
  try {
    //throw 'error1'; manually creates an error

    await loadProductsFetch();

    const value = await new Promise((resolve, reject) => { // reject lets us create an error in the future
      // throw 'error2'; directly goes to catch
      loadCart(() => {
        // reject('error3') creates error in future 
        resolve("val3"); // using this returns the value so we can save it in a variable
      });
    });
  } catch (error) {
    console.log("Unexpected Error. Please try again later.");
  }

  renderOrderSummary();
  renderPaymentSummary();
}
loadPage();

/*
Promise.all([
  loadProductsFetch(),
  new Promise((resolve) => {
    loadCart(() => {
      resolve();
    });
  })

]).then(()=>{
  renderOrderSummary();
  renderPaymentSummary()
});
*/
/* 
new Promise((resolve) => {
  // resolve lets us control when to go to the next step

  loadProducts(() => {
    resolve();
  });
})
  .then(() => {
    return new Promise((resolve) => {
      loadCart(() => {
        resolve();
      });
    });
  })
  .then(() => {
    renderOrderSummary();
    renderPaymentSummary();
  });
*/

/*
loadProducts(() => {
  loadCart(() => {
    renderOrderSummary();
    renderPaymentSummary();
  });
});
*/
