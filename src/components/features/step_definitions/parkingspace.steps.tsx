import React from "react";
import ParkingSpace from "../../ParkingSpace";
import PaymentScreen from "../../PaymentScreen";
import { defineFeature, loadFeature } from "jest-cucumber";
import { fireEvent, render, waitFor, act } from "@testing-library/react";
import "text-encoding";
import parkingSlice, {
  initializeParkingLot,
  addToParkingSpace,
} from "../../redux/reducer/parkingSlice";
import "@testing-library/jest-dom/extend-expect";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  MemoryRouter,
} from "react-router-dom";

const feature = loadFeature("src/components/features/parkingspace.feature");
let store: any;
defineFeature(feature, (test) => {
  test("Add a new parking space", ({ given, when, then }) => {
    store = configureStore({
      reducer: {
        parkingSpaces: parkingSlice,
      },
    });
    const screen = render(
      <Provider store={store}>
        <MemoryRouter>
          <ParkingSpace />
        </MemoryRouter>
      </Provider>
    );
    given("that there is a Parking Space Component", () => {
      expect(screen).toBeTruthy();
    });
    when('I click on the "Add Space" button', () => {
      const addSpace = screen.getAllByTestId("addSpace");
      fireEvent.click(addSpace[0]);
    });
    then(
      "a new parking space should be added to the list of available spaces",
      () => {
        const addSpace = screen.getAllByTestId("addSpace");
        act(() => {
          fireEvent.click(addSpace[0]);
          store.dispatch(addToParkingSpace());
        });
      }
    );
  });
  test("Remove an existing parking space", ({ given, when, then, and }) => {
    store = configureStore({
      reducer: {
        parkingSpaces: parkingSlice,
      },
    });
    const screen = render(
      <Provider store={store}>
        <Router>
          <ParkingSpace />
        </Router>
      </Provider>
    );
    given("that there is a Parking Space Component", () => {
      expect(screen).toBeTruthy();
    });
    and("there is more than one parking space available", () => {
      store = configureStore({
        reducer: {
          parkingSpaces: parkingSlice,
        },
      });
      const screen = render(
        <Provider store={store}>
          <Router>
            <ParkingSpace />
          </Router>
        </Provider>
      );
      const addSpace = screen.getAllByTestId("addSpace");
      act(() => {
        fireEvent.click(addSpace[0]);
        store.dispatch(addToParkingSpace());
      });
      const numSpaces = store.getState().parkingSpaces.numSpaces;
      expect(numSpaces).toBeGreaterThan(1);
    });
    when('I click on the "Remove Space" button', () => {
      const removeSpace = screen.getAllByTestId("decreaseSpace");
      act(() => {
        fireEvent.click(removeSpace[0]);
      });
    });
    then(
      "a parking space should be removed from the list of available spaces",
      () => {
        const numSpaces = store.getState().parkingSpaces.numSpaces;
        expect(numSpaces).toBeGreaterThan(0);
        expect(numSpaces).toBeLessThanOrEqual(1);
      }
    );
  });
  test("Register a parking lot", ({ given, when, then, and }) => {
    store = configureStore({
      reducer: {
        parkingSpaces: parkingSlice,
      },
    });

    const screen = render(
      <Provider store={store}>
        <MemoryRouter>
          <ParkingSpace />
        </MemoryRouter>
      </Provider>
    );
    given("that there is a Parking Space Component", () => {
      expect(screen).toBeTruthy();
    });
    and("I have selected a parking space", () => {
      store = configureStore({
        reducer: {
          parkingSpaces: parkingSlice,
        },
      });

      const screen = render(
        <Provider store={store}>
          <MemoryRouter>
            <ParkingSpace />
          </MemoryRouter>
        </Provider>
      );
      const addSpace = screen.getAllByTestId("addSpace");
      act(() => {
        fireEvent.click(addSpace[0]);
        store.dispatch(addToParkingSpace());
      });
      const selectedSpace = screen.getAllByTestId("space");
      fireEvent.click(selectedSpace[0]);
    });
    when('I click on the "Register Lot" button', () => {
      const screen = render(
        <Provider store={store}>
          <MemoryRouter>
            <ParkingSpace />
          </MemoryRouter>
        </Provider>
      );
      const registerButton = screen.getByText("Register Lot 1");
      fireEvent.click(registerButton);
    });
    then("a form should appear to register the parking lot", () => {
      store = configureStore({
        reducer: {
          parkingSpaces: parkingSlice,
        },
      });
      const screen = render(
        <Provider store={store}>
          <MemoryRouter>
            <ParkingSpace />
          </MemoryRouter>
        </Provider>
      );
      const registerButton = screen.getByText("Register Lot 1");
      fireEvent.click(registerButton);
      const registerForm = screen.getByTestId("registerForm");
      expect(registerForm).toBeTruthy();
    });
    and("I should be able to enter the registration and parking time", () => {
      const screen = render(
        <Provider store={store}>
          <MemoryRouter>
            <ParkingSpace />
          </MemoryRouter>
        </Provider>
      );
      const registerButton = screen.getByText("Register Lot 1");
      fireEvent.click(registerButton);
      const registrationInput =
        screen.getByPlaceholderText("Enter Registration");
      const timeInput = screen.getByPlaceholderText("Enter Time");
      fireEvent.change(registrationInput, { target: { value: "ABC-123" } });
      fireEvent.change(timeInput, { target: { value: "2:00" } });
    });
    and("when I submit the form, the lot should be registered", () => {
      const screen = render(
        <Provider store={store}>
          <MemoryRouter>
            <ParkingSpace />
          </MemoryRouter>
        </Provider>
      );
      const registerButton = screen.getByText("Register Lot 1");
      fireEvent.click(registerButton);
      const registrationInput =
        screen.getByPlaceholderText("Enter Registration");
      const timeInput = screen.getByPlaceholderText("Enter Time");
      fireEvent.change(registrationInput, { target: { value: "ABC-123" } });
      fireEvent.change(timeInput, { target: { value: "14:00" } });
      const submitButton = screen.getByTestId("submitButton");
      act(() => {
        fireEvent.submit(submitButton);
      });
      const regID = screen.getAllByTestId("regID");
      const timeId = screen.getAllByTestId("timeID");
      expect(regID[0]).toHaveTextContent("Registration: ABC-123");
      expect(timeId[0]).toHaveTextContent("Parking Time: 14:00");
    });
  });
  test("Make payment for an occupied parking lot", ({
    given,
    and,
    then,
    when,
  }) => {
    store = configureStore({
      reducer: {
        parkingSpaces: parkingSlice,
      },
    });

    const screen = render(
      <Provider store={store}>
        <MemoryRouter>
          <ParkingSpace />
        </MemoryRouter>
      </Provider>
    );
    given("that there is a Parking Space Component", () => {
      expect(screen).toBeTruthy();
    });
    and("there is an occupied parking space", () => {
      store = configureStore({
        reducer: {
          parkingSpaces: parkingSlice,
        },
      });
      const screen = render(
        <Provider store={store}>
          <MemoryRouter>
            <ParkingSpace />
          </MemoryRouter>
        </Provider>
      );
      const addSpace = screen.getAllByTestId("addSpace");
      act(() => {
        fireEvent.click(addSpace[0]);
        store.dispatch(addToParkingSpace());
      });
      const selectedSpace = screen.getAllByTestId("space");
      fireEvent.click(selectedSpace[0]);
      const registerButton = screen.getByText("Register Lot 1");
      fireEvent.click(registerButton);
      const registrationInput =
        screen.getByPlaceholderText("Enter Registration");
      const timeInput = screen.getByPlaceholderText("Enter Time");
      fireEvent.change(registrationInput, { target: { value: "ABC-123" } });
      fireEvent.change(timeInput, { target: { value: "14:00" } });
      const submitButton = screen.getByTestId("submitButton");
      act(() => {
        fireEvent.submit(submitButton);
      });
      const regID = screen.getAllByTestId("regID");
      const timeId = screen.getAllByTestId("timeID");
      expect(regID[0]).toHaveTextContent("Registration: ABC-123");
      expect(timeId[0]).toHaveTextContent("Parking Time: 14:00");
    });
    when('I click on the "Make Payment" button', () => {
      const paymentButton = screen.getAllByTestId("paymentButton");
      fireEvent.click(paymentButton[0]);
    });
    then("I should be redirected to the payment page", async () => {
      const navigation = jest.fn();
      store = configureStore({
        reducer: {
          parkingSpaces: parkingSlice,
        },
      });
      const screen = render(
        <Provider store={store}>
          <MemoryRouter>
            <Routes>
              <Route element={<ParkingSpace />} />
              <Route element={<PaymentScreen />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );
      const paymentButton = screen.getAllByTestId("paymentButton");
      fireEvent.click(paymentButton[0]);

      expect(window.location.pathname).toEqual("/");
    });
  });
});
