import React from "react";
import {
  render,
  fireEvent,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PaymentScreen from "../../PaymentScreen";
import { configureStore } from "@reduxjs/toolkit";
import parkingSlice, {
  paymentComplete,
} from "./../../redux/reducer/parkingSlice";
import { Provider } from "react-redux";
import "@testing-library/jest-dom/extend-expect";
import { loadFeature, defineFeature } from "jest-cucumber";

const feature = loadFeature("src/components/features/paymentscreen.feature");

defineFeature(feature, (test) => {
  test("User pays for occupied parking spot", ({ given, when, then, and }) => {
    const postMock = jest.fn().mockResolvedValueOnce({ ok: true });
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({}),
    });
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
    const state = {
      spaceDetails: {
        registration: "ABC",
        parkingTime: "10:00",
      },
      space: 1,
    };
    const store = configureStore({
      reducer: {
        parkingSpaces: parkingSlice,
      },
    });
    const screen = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: "/payment", state }]}>
          <Routes>
            <Route path="/payment" element={<PaymentScreen />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    given("I am on the Payment Screen", () => {
      expect(screen).toBeDefined();
    });
    and(
      "I see the vehicle registration and hours parked for the occupied parking spot",
      () => {
        const regElement = screen.getByTestId("reg");
        expect(regElement).toHaveTextContent("Vehicle Registration: ABC");

        const parkingHoursElement = screen.getByTestId("parkingHours");
        expect(parkingHoursElement).toHaveTextContent("Hours Parked: 9");
      }
    );
    and("I see the parking charge for the occupied parking spot", () => {
      const paymentElement = screen.getByTestId("payment");
      expect(paymentElement).toHaveTextContent("Parking Charge: $80");
    });
    when("I click on the Make Payment button", () => {
      const paymentButton = screen.getByTestId("paymentButton");
      act(() => {
        fireEvent.click(paymentButton);
      });
    });
    and("the payment is successfully processed", () => {
      const postMock = jest.fn().mockResolvedValueOnce({ ok: true });
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({}),
      });
      const paymentButton = screen.getByTestId("paymentButton");
      act(() => {
        fireEvent.click(paymentButton);
      });
      expect(fetch).toHaveBeenCalledWith("https://httpstat.us/200", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "car-registration": state.spaceDetails.registration,
          charge: 80,
        }),
      });
    });
    then(
      "I see an alert indicating that the payment was successful",
      async () => {
        const postMock = jest.fn().mockResolvedValueOnce({ ok: true });
        global.fetch = jest.fn().mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValueOnce({}),
        });
        const paymentButton = screen.getByTestId("paymentButton");
        act(() => {
          fireEvent.click(paymentButton);
        });
        expect(fetch).toHaveBeenCalledWith("https://httpstat.us/200", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "car-registration": state.spaceDetails.registration,
            charge: 80,
          }),
        });
        await waitFor(() => {
          expect(alertMock).toHaveBeenCalledWith("Payment Successful!");
        });
      }
    );
    and("the occupied parking spot is marked as unoccupied", async () => {
      const postMock = jest.fn().mockResolvedValueOnce({ ok: true });
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({}),
      });
      const alertMock = jest
        .spyOn(window, "alert")
        .mockImplementation(() => {});
      const state = {
        spaceDetails: {
          registration: "ABC",
          parkingTime: "10:00",
        },
        space: 1,
      };
      const store = configureStore({
        reducer: {
          parkingSpaces: parkingSlice,
        },
      });
      const screen = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[{ pathname: "/payment", state }]}>
            <Routes>
              <Route path="/payment" element={<PaymentScreen />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({}),
      });
      const paymentButton = screen.getByTestId("paymentButton");
      act(() => {
        fireEvent.click(paymentButton);
      });
      expect(fetch).toHaveBeenCalledWith("https://httpstat.us/200", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "car-registration": state.spaceDetails.registration,
          charge: 80,
        }),
      });
      store.dispatch(paymentComplete(state.space));
    });
  });
});
