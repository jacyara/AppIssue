import axios from "axios";
import { Cell, Grid, Select, VFlow } from "bold-ui";
import React, { useEffect, useState } from "react";
import { Projeto } from "./Equipes";
import Modulo from "./Modulo";

type Open = {
  count: number;
};

type Fechadas = {
  count: number;
};

interface ColunaProps {
  projeto: Projeto;
}

export type Label = {
  id: number;
  nome: string;
};

export const ModuloEscolha = (props: ColunaProps) => {
  const [label, setLabel] = useState<Label[]>();
  const [labelSelecionada, setLabelSelecionada] = useState<Label>();

  useEffect(() => {
    axios.get("/labels").then(resp => {
      console.log("Labels", resp.data.result.rows);
      setLabel(resp.data.result.rows);
    });
  }, [props.projeto]);

  if (!props || !label) {
    return null;
  }
  const itemToString = (item: Label | null) => {
    if (!item) return "";
    return item.nome;
  };
  const handleOnChange = (item: Label) => {
    setLabelSelecionada(item);
  };

  return (
    <>
      <VFlow>
        <h3>Porcentagem do módulo pronto</h3>
        <Grid>
          <Cell size={4}>
            <Select<Label>
              items={label}
              onChange={handleOnChange}
              itemToString={itemToString}
              name="modulo"
              clearable={false}
            />
          </Cell>
          <Cell size={8} />
        </Grid>
      </VFlow>
      {labelSelecionada && <Modulo nome={labelSelecionada} />}
    </>
  );
};

export default ModuloEscolha;
