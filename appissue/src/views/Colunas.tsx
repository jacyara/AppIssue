import axios from "axios";
import { Button } from "bold-ui";
import React, { useEffect, useState } from "react";

interface Projeto {
  id: number;
  nome: string;
}

export default function Colunas() {
  //var oi = "";
  const [projetos, setProjetos] = useState<Projeto[]>();
  console.log("sws");
  useEffect(() => {
    axios.get("/col", { params: { id: "2" } }).then(resp => {
      setProjetos(resp.data);
      console.log("swswsw" + resp);
    });
  }, []);

  if (!projetos) {
    return null;
  }
  console.log(projetos);
  console.log("swsw");
  return (
    <>
      <Button>sese</Button>
    </>
  );
}
