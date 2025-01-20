import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react";
import Table from "../components/Table";
import DATA from "../../frontend-assignment.json";
import "@testing-library/jest-dom";

global.fetch = jest.fn(() => {
  return Promise.resolve({
    json: () => {
      return Promise.resolve(DATA);
    },
  });
});

it("Should check if Headings are present on the Screen", async () => {
  await act(async () => {
    render(<Table />);
  });

  expect(screen.getByText("S.No")).toBeInTheDocument();
  expect(screen.getByText("Percentage Funded")).toBeInTheDocument();
  expect(screen.getByText("Amount Pledged")).toBeInTheDocument();
});

it("Should check if pagination are rendered properly", async () => {
  await act(async () => {
    render(<Table />);
  });

  expect(screen.getByText("Prev")).toBeInTheDocument();
  expect(screen.getByText("Next")).toBeInTheDocument();
});

it("Should check if data is rendered properly", async () => {
  await act(() => {
    render(<Table />);
  });
  expect(screen.getByText("0")).toBeInTheDocument();
  expect(screen.getByText("186")).toBeInTheDocument();
  expect(screen.getByText("15823")).toBeInTheDocument();
});

it("Should check page buttons functionality", async () => {
  await act(async () => {
    render(<Table />);
  });

  const nextButton = screen.getByText("Next");
  expect(nextButton).toBeInTheDocument();

  await fireEvent.click(nextButton);

  expect(screen.getByText("153")).toBeInTheDocument();
  expect(screen.queryByText("45959")).toBeInTheDocument();
});
