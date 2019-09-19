import axios from "axios";
import { Select, VFlow } from "bold-ui";
import React, { useEffect, useState } from "react";
import Colunas from "./Colunas";

export type Projeto = {
  id: string;
  nome: string;
};

export default function Equipes() {
  const [projetos, setProjetos] = useState<Projeto[]>();
  const [statusSelecionado, setstatusSelecionado] = useState<Projeto>();

  useEffect(() => {
    axios.get("/kkk").then(resp => {
      setProjetos(resp.data.res.rows);
    });
  }, []);

  console.log(projetos);

  if (!projetos) {
    return null;
  }

  //console.log("Projetos " + projetos.map(item => item.nome || null));
  const itemToString = (item: Projeto | null) => {
    if (!item) return "";
    return item.nome;
  };
  const handleOnChange = (item: Projeto) => {
    //console.log("handle", item);
    setstatusSelecionado(item);
  };

  //console.log("selectionado", statusSelecionado);
  return (
    <>
      <VFlow>
        <Select<Projeto>
          items={projetos}
          onChange={handleOnChange}
          itemToString={itemToString}
          name="equipes"
          clearable={false}
        />
        {statusSelecionado && <Colunas projeto={statusSelecionado} />}
      </VFlow>
    </>
  );
}
