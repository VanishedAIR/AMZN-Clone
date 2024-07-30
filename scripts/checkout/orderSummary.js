import {
  cart,
  removeFromCart,
  updateQuantity,
  updateDeliveryOption,
} from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { hello } from "https://unpkg.com/supersimpledev@1.0.1/hello.esm.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js"; // using no {} is used to import only one thing
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";

export function updateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  document.querySelector(".js-checkout").innerHTML = `${cartQuantity} items`;
  return cartQuantity;
}

export function renderOrderSummary() {
  updateCartQuantity();
  let cartSummaryHTML = "";

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionID;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    if (deliveryOption) {
      const today = dayjs();
      const deliveryDate = today
        .add(deliveryOption.deliveryDays, "days")
        .format("dddd, MMMM D");

      cartSummaryHTML += `
        <div class="cart-item-container js-cart-item-container js-cart-item-container-${
          matchingProduct.id
        }">
          <div class="delivery-date">
            Delivery date: ${deliveryDate}
          </div>

          <div class="cart-item-details-grid">
            <img class="product-image"
              src="${matchingProduct.image}">

            <div class="cart-item-details">
              <div class="product-name">
                ${matchingProduct.name}
              </div>
              <div class="product-price">
                ${matchingProduct.getPrice()}
              </div>
              <div class="product-quantity js-product-quantity-${
                matchingProduct.id
              }">
                <span>
                  Quantity: <span class="quantity-label js-quantity-label-${
                    matchingProduct.id
                  }">${cartItem.quantity}</span>
                </span>
                <span class="update-quantity-link link-primary js-update-link" data-product-id="${
                  matchingProduct.id
                }">
                  Update
                </span>
                <input class="quantity-input js-quantity-input-${
                  matchingProduct.id
                }">
                <span class="save-quantity-link link-primary js-save-link"
                  data-product-id="${matchingProduct.id}">
                  Save
                </span>
                <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${
                  matchingProduct.id
                }" data-product-id="${matchingProduct.id}">
                  Delete
                </span>
              </div>
            </div>

            <div class="delivery-options">
              <div class="delivery-options-title">
                Choose a delivery option:
              </div>
              ${deliveryOptionsHTML(matchingProduct, cartItem)}
            </div>
          </div>
        </div>
      `;
    }
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = "";
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today
        .add(deliveryOption.deliveryDays, "days")
        .format("dddd, MMMM D");
      const priceString =
        deliveryOption.priceCents === 0
          ? "FREE"
          : `$${(deliveryOption.priceCents / 100).toFixed(2)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionID;

      html += `
      <div class="delivery-option js-delivery-option" data-product-id="${
        matchingProduct.id
      }" data-delivery-option-id="${deliveryOption.id}">
        <input type="radio"
          ${isChecked ? "checked" : ""}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${deliveryDate}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
      `;
    });
    return html;
  }

  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.remove();
      updateCartQuantity();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll(".js-update-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.classList.add("is-editing-quantity");
    });
  });

  document.querySelectorAll(".js-save-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.classList.remove("is-editing-quantity");
      const quantityInput = document.querySelector(
        `.js-quantity-input-${productId}`
      );
      const newQuantity = Number(quantityInput.value);
      updateQuantity(productId, newQuantity);

      const quantityLabel = document.querySelector(
        `.js-quantity-label-${productId}`
      );
      quantityLabel.innerHTML = newQuantity;

      updateCartQuantity();
      renderPaymentSummary();
    });
  });

  updateCartQuantity();

  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const productId = element.dataset.productId;
      const deliveryOptionID = element.dataset.deliveryOptionId; // Note the corrected attribute name
      updateDeliveryOption(productId, deliveryOptionID);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
