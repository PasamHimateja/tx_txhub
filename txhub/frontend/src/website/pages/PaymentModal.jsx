import React, { useState } from "react";
import { X, Smartphone, CreditCard, Landmark, Wallet, CheckCircle } from "lucide-react";

const PaymentModal = ({ amount, onClose, onSuccess }) => {
  const [method, setMethod] = useState("upi");
  const [paid, setPaid] = useState(false);

  const handlePay = () => {
    setPaid(true);
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 1500);
  };

  if (paid) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-10 rounded-xl text-center">
          <CheckCircle size={60} className="text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold mt-3 text-green-600">
            Payment Successful
          </h2>
          <p className="text-gray-500">Amount Paid ₹{amount}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[800px] rounded-xl shadow-lg">

        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-bold text-lg">Complete Payment</h2>
          <button onClick={onClose}><X /></button>
        </div>

        <div className="flex">

          {/* Left Menu */}
          <div className="w-1/3 border-r p-4 space-y-4">
            <div onClick={() => setMethod("upi")} className="cursor-pointer flex items-center gap-2">
              <Smartphone /> UPI
            </div>
            <div onClick={() => setMethod("card")} className="cursor-pointer flex items-center gap-2">
              <CreditCard /> Cards
            </div>
            <div onClick={() => setMethod("netbanking")} className="cursor-pointer flex items-center gap-2">
              <Landmark /> Net Banking
            </div>
            <div onClick={() => setMethod("wallet")} className="cursor-pointer flex items-center gap-2">
              <Wallet /> Wallet
            </div>
          </div>

          {/* Right Content */}
          <div className="w-2/3 p-6">

            {method === "upi" && (
              <div>
                <h3 className="font-bold mb-2">Pay using UPI</h3>
                <img
                  src="https://static.vecteezy.com/system/resources/previews/002/557/391/large_2x/qr-code-for-scanning-free-vector.jpg"
                  className="w-40 mx-auto"
                />
                <button
                  onClick={handlePay}
                  className="mt-4 w-full bg-blue-500 text-white py-2 rounded"
                >
                  I Paid ₹{amount}
                </button>
              </div>
            )}

            {method === "card" && (
              <div>
                <h3 className="font-bold mb-3">Pay using Card</h3>
                <input className="w-full border p-2 mb-2 rounded" placeholder="Card Number" />
                <input className="w-full border p-2 mb-2 rounded" placeholder="Name on Card" />
                <div className="flex gap-2">
                  <input className="w-1/2 border p-2 rounded" placeholder="MM/YY" />
                  <input className="w-1/2 border p-2 rounded" placeholder="CVV" />
                </div>
                <button onClick={handlePay} className="mt-4 w-full bg-blue-500 text-white py-2 rounded">
                  Pay ₹{amount}
                </button>
              </div>
            )}

            {method === "netbanking" && (
              <div>
                <h3 className="font-bold mb-3">Select Bank</h3>
                <select className="w-full border p-2 rounded">
                  <option>SBI</option>
                  <option>HDFC</option>
                  <option>ICICI</option>
                  <option>Axis Bank</option>
                </select>
                <button onClick={handlePay} className="mt-4 w-full bg-blue-500 text-white py-2 rounded">
                  Pay ₹{amount}
                </button>
              </div>
            )}

            {method === "wallet" && (
              <div>
                <h3 className="font-bold mb-3">Select Wallet</h3>
                <div className="space-y-2">
                  <div className="border p-2 rounded">Paytm</div>
                  <div className="border p-2 rounded">Amazon Pay</div>
                  <div className="border p-2 rounded">PhonePe Wallet</div>
                </div>
                <button onClick={handlePay} className="mt-4 w-full bg-blue-500 text-white py-2 rounded">
                  Pay ₹{amount}
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;