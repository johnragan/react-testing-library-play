import React from "react";
import axios from "axios";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App, { SearchNoSideEffectsOrState } from "./App";

jest.mock("axios");

// IGNORE THE RED CONSOLE WARNINGS - I JUST HAVE NOT HAD TIME TO LOOK INTO THIS
// Do a "yarn start" to see app itself - less important - App.js
// Uses "yarn test"  - App.test.js

// You can see that it leverages Jest for BDD and expectations; RTL is more
// focused on directly interrogating the actual DOM tree the user sees as
// opposed to the React component structure.
describe("App", () => {
  test("renders App component 1", () => {
    act(() => {
      render(<App />);
    });

    // Exact text or RegEx matching.  But if not found, will throw an exception
    expect(screen.getByText("Search:")).toBeInTheDocument();
    expect(screen.getByText(/Search:/)).toBeInTheDocument();
  });

  test("test selecting via role for test approach", () => {
    render(<App />);

    // If you have inputs with same label, it will throw an exception.  You can
    // try this by changing "Surch:" to "Search": in App.js line 57.
    screen.getByText("Search:");
  });

  test("renders App component 2", () => {
    act(() => {
      render(<App />);
    });

    // Screen works with the DOM structure the user sees on the screen, as opposed to
    // the React component structure.  Uncomment the next line to see that structure:

    // screen.debug();

    // getByText would fail before the toBeNull() check because this component does not exist.
    expect(screen.queryByText(/Searches for JavaScript/)).toBeNull();
  });

  test("renders App component 3", async () => {
    render(<App />);

    // queryByText will not fail if the item does not exist
    expect(screen.queryByText(/Signed in as/)).toBeNull();

    expect(await screen.findByText(/Signed in as/)).toBeInTheDocument();
  });

  // Here, we mimic searching for "Javascript"
  test("renders App component 4", async () => {
    render(<App />);

    // wait for the user to resolve, as it is a web call (async, await)
    // needs only be used in our special case
    await screen.findByText(/Signed in as/);

    // Have not searched for it yet
    expect(screen.queryByText(/Searches for JavaScript/)).toBeNull();

    // Fire searching for this as a Javascript event
    fireEvent.change(screen.getByLabelText("Search:"), {
      target: { value: "JavaScript" },
    });

    // Now, it should show up in search results
    expect(screen.getByText(/Searches for JavaScript/)).toBeInTheDocument();
  });

  test("renders App component 5", async () => {
    render(<App />);

    // wait for the user to resolve again
    await screen.findByText(/Signed in as/);

    expect(screen.queryByText(/Searches for JavaScript/)).toBeNull();

    // A fireEvent.change() triggers only a single change event whereas
    // userEvent.type triggers a change event, but also keyDown, keyPress,
    // and keyUp events.
    await userEvent.type(screen.getByLabelText("Search:"), "JavaScript");

    expect(screen.getByText(/Searches for JavaScript/)).toBeInTheDocument();
  });

  // Mocking examples in test
  describe("SearchNoSideEffectsOrState - fireEvent", () => {
    test("calls the onChange callback handler", () => {
      const onChange = jest.fn();

      render(
        <SearchNoSideEffectsOrState value="" onChange={onChange}>
          Search2:
        </SearchNoSideEffectsOrState>
      );

      fireEvent.change(screen.getByLabelText("Search2:"), {
        target: { value: "JavaScript" },
      });

      expect(onChange).toHaveBeenCalledTimes(1);
    });

    test("fetches stories from an API and displays them", async () => {
      const stories = [
        { objectID: "1", title: "Hello" },
        { objectID: "2", title: "React" },
      ];

      axios.get.mockImplementationOnce(() =>
        Promise.resolve({ data: { hits: stories } })
      );

      render(<App />);

      await userEvent.click(screen.getByRole("button"));

      const items = await screen.findAllByRole("listitem");

      expect(items).toHaveLength(2);
    });

    test("fetches stories from an API and fails", async () => {
      axios.get.mockImplementationOnce(() => Promise.reject(new Error()));

      render(<App />);

      await userEvent.click(screen.getByRole("button"));

      const message = await screen.findByText(/Something went wrong/);

      expect(message).toBeInTheDocument();
    });

    test("fetches stories from an API and displays them", async () => {
      const stories = [
        { objectID: "1", title: "Hello" },
        { objectID: "2", title: "React" },
      ];

      const promise = Promise.resolve({ data: { hits: stories } });

      axios.get.mockImplementationOnce(() => promise);

      render(<App />);

      await userEvent.click(screen.getByRole("button"));

      await act(() => promise);

      expect(screen.getAllByRole("listitem")).toHaveLength(2);
    });
  });

  describe("SearchNoSideEffectsOrState - userEvent", () => {
    test("calls the onChange callback handler", async () => {
      const onChange = jest.fn();

      render(
        <SearchNoSideEffectsOrState value="" onChange={onChange}>
          Search2:
        </SearchNoSideEffectsOrState>
      );

      await userEvent.type(screen.getByLabelText("Search2:"), "JavaScript");

      //  It is 10 times because each key press counts, unlike fireEvent
      expect(onChange).toHaveBeenCalledTimes(10);
    });
  });
});

// There are other search types which are more element specific:

// LabelText: getByLabelText: <label for="search" />
// PlaceholderText: getByPlaceholderText: <input placeholder="Search" />
// AltText: getByAltText: <img alt="profile" />
// DisplayValue: getByDisplayValue: <input value="JavaScript" />

// And there is the last resort search type TestId with getByTestId where
// one needs to assign data-testid attributes in the source code's HTML.

// Good article below:
// https://www.robinwieruch.de/react-testing-library
