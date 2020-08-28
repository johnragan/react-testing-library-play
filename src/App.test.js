import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";

import App from "./App";

describe("App", () => {
  test("renders App component", () => {
    render(<App />);

    expect(screen.getByText("Search:")).toBeInTheDocument();
    expect(screen.getByText(/Search:/)).toBeInTheDocument();
  });

  test("test selecting via role for test approach", () => {
    render(<App />);

    screen.getByRole("textbox");
  });

  test("renders App component", () => {
    act(() => {
      render(<App />);
    });

    //screen.debug();

    // getByText would fail before the toBeNull() check
    expect(screen.queryByText(/Searches for JavaScript/)).toBeNull();
  });

  test("renders App component", async () => {
    render(<App />);

    expect(screen.queryByText(/Signed in as/)).toBeNull();

    //screen.debug();

    expect(await screen.findByText(/Signed in as/)).toBeInTheDocument();

    //screen.debug();
  });

  test("renders App component", async () => {
    render(<App />);

    // wait for the user to resolve
    // needs only be used in our special case
    await screen.findByText(/Signed in as/);

    //screen.debug();

    expect(screen.queryByText(/Searches for JavaScript/)).toBeNull();

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "JavaScript" },
    });

    expect(screen.getByText(/Searches for JavaScript/)).toBeInTheDocument();

    //screen.debug();
  });

  test("renders App component", async () => {
    render(<App />);

    // wait for the user to resolve
    await screen.findByText(/Signed in as/);

    expect(screen.queryByText(/Searches for JavaScript/)).toBeNull();

    // A fireEvent.change() triggers only a change event whereas
    // userEvent.type triggers a change event, but also keyDown, keyPress,
    // and keyUp events.
    await userEvent.type(screen.getByRole("textbox"), "JavaScript");

    expect(screen.getByText(/Searches for JavaScript/)).toBeInTheDocument();
  });
});

// There are other search types which are more element specific:

// LabelText: getByLabelText: <label for="search" />
// PlaceholderText: getByPlaceholderText: <input placeholder="Search" />
// AltText: getByAltText: <img alt="profile" />
// DisplayValue: getByDisplayValue: <input value="JavaScript" />

// And there is the last resort search type TestId with getByTestId where
// one needs to assign data-testid attributes in the source code's HTML.

// https://www.robinwieruch.de/react-testing-library
