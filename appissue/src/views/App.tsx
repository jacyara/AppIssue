import { ThemeProvider } from "bold-ui";
import React from "react";
import Equipes from "./Equipes";
import Header from "./Header";

export default function App() {
  return (
    <>
      <ThemeProvider>
        <Header />
        <Equipes />
      </ThemeProvider>
    </>
  );
}
