import React from "react";
import Equipes from "./Equipes";

interface Projeto {
  id: number;
  nome: string;
}

export default function App() {
  return (
    <>
      <Equipes />
    </>
  );
}
