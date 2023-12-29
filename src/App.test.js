import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";

test("renders the landing page", () => {
  render(<App />);
});

test("select, display, reset and check goes to landing page", async () => {
  render(<App />);

  // select option
  const select = screen.getByRole("combobox");
  expect(
    await screen.findByRole("option", { name: "akita" })
  ).toBeInTheDocument();
  userEvent.selectOptions(select, "akita");
  expect(select).toHaveValue("akita");

  const searchBtn = screen.getByRole("button", { name: "Search" });
  expect(searchBtn).not.toBeDisabled();
  userEvent.click(searchBtn);

  await waitForElementToBeRemoved(() => screen.queryByText(/Loading/i));

  // check all images displayed
  const dogImages = screen.getAllByRole("img");
  expect(dogImages).toHaveLength(9);
  expect(screen.getByText(/9 results/i)).toBeInTheDocument();
  expect(dogImages[0]).toHaveAccessibleName("akita 1 of 9");
  expect(dogImages[1]).toHaveAccessibleName("akita 2 of 9");

  // click reset Button
  const resetBtn = screen.getByRole("button", { name: "Reset" });
  userEvent.click(resetBtn);

  // check landing page is diplayed
  expect(screen.getByRole("heading")).toHaveTextContent(/Doggy Directory/);
  expect(screen.getByRole("combobox")).toHaveDisplayValue("Select a breed");
  expect(
    await screen.findByRole("option", { name: "husky" })
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Search" })).toBeDisabled();
  expect(screen.getByRole("img")).toBeInTheDocument();
});
