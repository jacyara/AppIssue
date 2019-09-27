import axios from "axios";
import { Cell, Grid, Select, VFlow } from "bold-ui";
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

  if (!projetos) {
    return null;
  }

  const itemToString = (item: Projeto | null) => {
    if (!item) return "";
    return item.nome;
  };
  const handleOnChange = (item: Projeto) => {
    setstatusSelecionado(item);
  };

  return (
    <Grid>
      <Cell size={12}>
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
      </Cell>
    </Grid>
  );
}
