import axios from "axios";
import { DataTable } from "bold-ui";
import React, { useEffect, useState } from "react";
import Colunas from "./Colunas";

interface Projeto {
  id: number;
  nome: string;
}

export default function Equipes() {
  //var oi = "";
  const [projetos, setProjetos] = useState<Projeto[]>();
  useEffect(() => {
    axios.get("/kkk").then(resp => {
      // console.log(resp.data);
      //setState(resp.data.n);
      setProjetos(resp.data.res.rows);
      // console.log("data", resp.data);
      // console.log("state", projetos);
      // projetos && projetos.map(item => console.log(item.nome));

      //console.log(state.projetos.map())
    });
  }, []);

  if (!projetos) {
    return null;
  }
  console.log(projetos);
  return (
    <>
      <DataTable
        rows={projetos}
        columns={[{ name: "equipe", render: item => item.nome }]}
      />
      <Colunas />
    </>
  );
}
