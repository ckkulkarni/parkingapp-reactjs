import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { paymentComplete } from "./redux/reducer/parkingSlice";
import { useDispatch } from "react-redux";
const PaymentScreen = () => {
  const location = useLocation();
  const { spaceDetails, space } = location.state;
  const dispatch = useDispatch();
  const navigation = useNavigate();

  const [hoursParked, setHoursParked] = useState<number | null>(null);

  useEffect(() => {
    const [parkingHours, parkingMinutes] = spaceDetails.parkingTime.split(":");
    const parkedTime = new Date();
    parkedTime.setHours(Number(parkingHours), Number(parkingMinutes), 0, 0);
    const hoursParked = Math.ceil(
      (new Date().getTime() - parkedTime.getTime()) / (1000 * 60 * 60) - 1
    );
    setHoursParked(hoursParked);
  }, [spaceDetails.parkingTime]);
  const calculateParkingCharges = (parkingTime: any) => {
    const [parkingHours, parkingMinutes] = parkingTime.split(":");
    const parkedTime = new Date();
    parkedTime.setHours(Number(parkingHours), Number(parkingMinutes), 0, 0);
    const hoursParked = Math.ceil(
      (new Date().getTime() - parkedTime.getTime()) / (1000 * 60 * 60)
    );
    let parkingCharge = 10;
    if (hoursParked > 2) {
      parkingCharge += (hoursParked - 2) * 10 - 10;
    }
    return parkingCharge;
  };

  const [payment, setPayment] = useState(
    calculateParkingCharges(spaceDetails.parkingTime)
  );
  const handleSubmit = async () => {
    const reg = spaceDetails.registration;
    const charges = payment;
    try {
      const result = await fetch(`https://httpstat.us/200`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "car-registration": reg,
          charge: charges,
        }),
      });
      if (result.ok) {
        alert("Payment Successful!");
        dispatch(paymentComplete(space));
        navigation("/spaces");
      } else {
        alert("Payment Failed");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="paymentScreen">
      <p data-testid="reg">Vehicle Registration: {spaceDetails.registration}</p>
      <p data-testid="parkingHours">Hours Parked: {hoursParked}</p>
      <p data-testid="payment">Parking Charge: ${payment}</p>
      <button
        className="btn btn-primary"
        onClick={handleSubmit}
        data-testid="paymentButton"
      >
        Make Payment
      </button>
      <Link to="/spaces">
        <button className="btn btn-secondary">Go Back</button>
      </Link>
    </div>
  );
};

export default PaymentScreen;
