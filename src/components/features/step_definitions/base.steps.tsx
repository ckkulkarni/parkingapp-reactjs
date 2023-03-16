import { defineFeature, loadFeature } from "jest-cucumber";
import { fireEvent, render, waitFor } from "@testing-library/react";
import Base from "../../Base";
import React from "react";
import "text-encoding";
import parkingSlice, {
  initializeParkingLot,
} from "../../redux/reducer/parkingSlice";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ParkingSpace from "../../ParkingSpace";
const feature = loadFeature("src/components/features/base.feature");
let store: any;
defineFeature(feature, (test) => {
  test("User enters the number of spaces", ({ given, when, then, and }) => {
    store = configureStore({
      reducer: {
        parkingSpaces: parkingSlice,
      },
    });
    const screen = render(
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<Base />} />
            <Route path="/spaces" element={<ParkingSpace />} />
          </Routes>
        </Router>
      </Provider>
    );
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
    given("the user is on the home page", () => {
      expect(screen).toBeTruthy();
    });
    when("the user enters some input in the input field and submits", () => {
      const input = screen.getAllByTestId("input");
      const button = screen.getAllByText("Submit");
      fireEvent.change(input[0], { target: { value: 10 } });
      fireEvent.click(button[0]);
    });
    then('an alert is displayed with "10 Spaces selected"', async () => {
      const input = screen.getAllByTestId("input");
      const button = screen.getAllByText("Submit");
      fireEvent.change(input[0], { target: { value: 10 } });
      fireEvent.click(button[0]);
      await waitFor(() => {
        expect(alertMock).toHaveBeenCalledWith("10 Spaces selected");
      });
    });
    and("the parking lot should be initialized with 10 spaces", async () => {
      const input = screen.getAllByTestId("input");
      const button = screen.getAllByText("Submit");
      fireEvent.change(input[0], { target: { value: 10 } });
      fireEvent.click(button[0]);
      await waitFor(() => {
        expect(alertMock).toHaveBeenCalledWith("10 Spaces selected");
      });
      store.dispatch(initializeParkingLot(10));
    });
    when(
      'the user clicks the "Start App" button, the user should be taken to the spaces page',
      async () => {
        const input = screen.getAllByTestId("input");
        const button = screen.getAllByText("Submit");
        fireEvent.change(input[0], { target: { value: 10 } });
        fireEvent.click(button[0]);

        const startAppButton = screen.getByText("Start App");
        fireEvent.click(startAppButton);

        await waitFor(() => {
          expect(window.location.pathname).toEqual("/spaces");
        });
      }
    );
  });
});
