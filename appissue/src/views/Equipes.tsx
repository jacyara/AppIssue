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
    <>
      <VFlow>
        <Grid>
          <Cell size={2} />
          <Cell size={8}>
            <Select<Projeto>
              items={projetos}
              label="Selecione a equipe ágil"
              onChange={handleOnChange}
              itemToString={itemToString}
              name="equipes"
              clearable={false}
            />
          </Cell>
          <Cell size={2} />
        </Grid>
        {statusSelecionado && <Colunas projeto={statusSelecionado} />}
      </VFlow>
    </>
  );
}
