import { useContext, useActionState } from "react";
import Modal from "./UI/Modal";
import CartContext from "../store/CartContext";
import { currenyFormatter } from "../util/formatter";
import Input from "./UI/Input";
import Button from "./UI/Button";
import UserProgressContext from "../store/UserProgressContext";
import useHttp from "../hooks/useHttp";
import Error from "./Error";

const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const { data, error, sendRequest, clearData } = useHttp(
    "http://localhost:3000/orders",
    requestConfig
  );

  const cartTotal = cartCtx.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price,
    0
  );

  function handleClose() {
    userProgressCtx.hideCheckout();
  }

  function handleFinish() {
    userProgressCtx.hideCheckout();
    cartCtx.clearCart();
    clearData();
  }

  async function checkoutAction(prevState, fd) {
    const customerData = Object.fromEntries(fd.entries());

    await sendRequest(
      JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: customerData,
        },
      })
    );
  }

  const [formState, formAction, isSending] = useActionState(checkoutAction, null);

  let actions = (
    <>
      <Button textOnly type="button" onClick={handleClose}>
        Close
      </Button>
      <Button>Submit Order</Button>
    </>
  );

  if (isSending) {
    actions = <span>Sending data...</span>;
  }

  if (data && !error) {
    return (
      <Modal open={userProgressCtx.progress === "checkout"} onClose={handleFinish}>
        <h2>Success</h2>
        <p>Your order was submitted successfully</p>
        <p>We will get back to you with the details on your mail you provided</p>
        <div className="modal-actions">
          <Button onClick={handleFinish}>Okay</Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={userProgressCtx.progress === "checkout"}>
      <form action={formAction}>
        <h2>Checkout</h2>
        <p>Total Amount: {currenyFormatter.format(cartTotal)}</p>
        <Input label="Full Name" id="name" type="text" />
        <Input label="Email" id="email" type="email" />
        <Input label="Street" id="street" type="text" />
        <div className="control-row">
          <Input label="Postal Code" id="postal-code" type="text" />
          <Input label="City" id="city" type="text" />
        </div>
        {error && <Error title="Failed to submit order" message={error} />}
        <div className="modal-actions">{actions}</div>
      </form>
    </Modal>
  );
}
