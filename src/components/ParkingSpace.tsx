import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  addToParkingSpace,
  removeParkingSpace,
  occupyParkingLots,
} from "./redux/reducer/parkingSlice";
const ParkingSpace = () => {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const [displayForm, setDisplayForm] = useState<boolean>(false);
  const [registration, setReg] = useState<string>("");
  const [parkingTime, setTime] = useState<string>("");
  const [selectedSpace, setSelected] = useState<number>(0);
  const [activatePayment, setActivation] = useState<boolean>(false);
  const numspaces = useSelector((state: any) => state.parkingSpaces.numSpaces);
  const spaces = useSelector((state: any) => state.parkingSpaces.spaces);
  const [displaySpaces, setDisplay] = useState(() => {
    const renderSpaces = [];
    for (let i = 1; i <= numspaces; i++) {
      renderSpaces.push(i);
    }
    return renderSpaces;
  });
  useEffect(() => {
    const renderSpaces = [];
    for (let i = 1; i <= numspaces; i++) {
      renderSpaces.push(i);
    }
    setDisplay(renderSpaces);
  }, [numspaces]);
  const handleIncrement = () => {
    dispatch(addToParkingSpace());
  };
  const handleDecrement = () => {
    dispatch(removeParkingSpace());
  };
  const handlePaymentScreen = (space: number) => {
    navigation("/payment", { state: { spaceDetails: spaces[space], space } });
  };
  const handleSpaceClick = (space: number) => {
    if (spaces[space]) {
      setActivation(true);
    }
    setSelected(space);
  };
  const handleRegistration = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReg(event.target.value);
  };
  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTime(event.target.value);
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(
      occupyParkingLots({
        spaceNum: selectedSpace,
        registration: registration,
        parkingTime: parkingTime,
      })
    );
    setSelected(0);
    setReg("");
    setTime("");
  };
  const handleRegisterClick = () => {
    setDisplayForm(true);
  };
  return (
    <div className="container">
      <div className="buttonsContainer">
        <button
          style={{ marginRight: 10, marginLeft: 10 }}
          onClick={handleIncrement}
          data-testid="addSpace"
        >
          Add Space
        </button>
        <button
          style={{ marginRight: 10, marginLeft: 10 }}
          onClick={handleDecrement}
          disabled={numspaces <= 1}
          data-testid="decreaseSpace"
        >
          Remove Space
        </button>
        <Link to="/">
          <button style={{ marginRight: 10, marginLeft: 10 }}>
            Input Again?
          </button>
        </Link>
        <button
          style={{ marginRight: 10, marginLeft: 10 }}
          onClick={handleRegisterClick}
          disabled={selectedSpace <= 0}
        >
          {selectedSpace > 0 ? `Register Lot ${selectedSpace}` : "Register Lot"}
        </button>
        <button
          style={{ marginRight: 10, marginLeft: 10 }}
          onClick={() => handlePaymentScreen(selectedSpace)}
          disabled={!spaces[selectedSpace]}
          data-testid="paymentButton"
        >
          {!spaces[selectedSpace]
            ? `Make Payment`
            : `Make Payment For Lot ${selectedSpace}`}
        </button>
      </div>
      <div className="spacesContainer">
        {displaySpaces.map((space) => (
          <div
            data-testid="space"
            key={space}
            className={`spaceNumber ${
              selectedSpace === space ? "selected" : ""
            }`}
            onClick={() => handleSpaceClick(space)}
          >
            {space}
            {spaces[space] && (
              <div className="spaceDetails">
                <p data-testid="regID">
                  Registration: {spaces[space].registration}
                </p>
                <p data-testid="timeID">
                  Parking Time: {spaces[space].parkingTime}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      {displayForm && (
        <div className="formContainer">
          <form onSubmit={handleSubmit} data-testid="registerForm">
            <label style={{ color: "white" }}>
              Registration for lot {selectedSpace}
            </label>
            <input
              type="text"
              className="form-control"
              onChange={handleRegistration}
              placeholder="Enter Registration"
            />
            <br />
            <label style={{ color: "white" }}>Parking Time: </label>
            <input
              type="time"
              className="form-control"
              placeholder="Enter Time"
              onChange={handleTimeChange}
            />
            <br />
            <button
              type="submit"
              disabled={registration.length < 1}
              data-testid="submitButton"
            >
              Submit
            </button>
            <button
              style={{ marginTop: 10 }}
              onClick={() => setDisplayForm(false)}
            >
              Close
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ParkingSpace;
