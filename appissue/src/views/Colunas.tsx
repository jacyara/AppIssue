import axios from "axios";
import { DataTable } from "bold-ui";
import React, { useEffect, useState } from "react";
import { Projeto } from "./Equipes";

type Coluna = {
  nome: string;
};

interface ColunaProps {
  projeto: Projeto;
}

export const Colunas = (props: ColunaProps) => {
  const [coluna, setColuna] = useState<Coluna[]>();

  console.log("Projeto: ", props);

  useEffect(() => {
    axios.get("/col", { params: { id: props.projeto.id } }).then(resp => {
      console.log("resp", resp.data.result.rows);
      setColuna(resp.data.result.rows);
    });
  }, [props.projeto]);

  if (!props || !coluna || !coluna[0]) {
    return null;
  }

  console.log("colunas", coluna);
  return (
    <DataTable<Coluna>
      rows={coluna}
      columns={[{ name: "equipe", render: item => item.nome }]}
    />

    // <>
    //   <Button>{coluna[2].nome}</Button>
    // </>
  );
};

export default Colunas;
