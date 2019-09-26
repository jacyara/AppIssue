import axios from "axios";
import { DataTable } from "bold-ui";
import React, { useEffect, useState } from "react";
import { DateTime } from "./DateTime";
import { Projeto } from "./Equipes";

type Abertas = {
  id: number;
  nome: string;
  created: Date;
};
interface AbertasProps {
  projeto: Projeto;
}

export const Abertas = (props: AbertasProps) => {
  const [abertas, setAbertas] = useState<Abertas[]>();

  useEffect(() => {
    axios.get("/abertas", { params: { id: props.projeto.id } }).then(resp => {
      console.log("abertas: ", resp.data.result.rows);
      setAbertas(resp.data.result.rows);
    });
  }, [props.projeto]);

  if (!props || !abertas) {
    return null;
  }

  return (
    <DataTable<Abertas>
      rows={abertas}
      columns={[
        {
          name: "issue",
          header: "#Issue",
          render: item => item.id
        },
        {
          name: "nome",
          header: "Título da Issue",
          render: item => item.nome
        },
        {
          name: "nome",
          header: "Data de criação",
          render: item => <DateTime value={item.created} format="DD/MM/YYYY" />
        }
      ]}
    />
  );
};
