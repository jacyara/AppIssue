import axios from "axios";
import { DataTable } from "bold-ui";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Projeto } from "./Equipes";

type Fechadas = {
  id: number;
  nome: string;
  fechada: Date;
  aberta: Date;
};
interface FechadaProps {
  projeto: Projeto;
}

export const Fechadas = (props: FechadaProps) => {
  const [fechadas, setFechadas] = useState<Fechadas[]>();

  useEffect(() => {
    axios.get("/fechadas", { params: { id: props.projeto.id } }).then(resp => {
      console.log("fechadas: ", resp.data.result.rows);
      setFechadas(resp.data.result.rows);
    });
  }, [props.projeto]);

  if (!props || !fechadas) {
    return null;
  }

  const renderLeadTime = (row: Fechadas) => {
    const date1 = moment(row.aberta, "");
    const date2 = moment(row.fechada);
    const diferenca = moment.duration(date2.diff(date1));
    const days = diferenca.asDays();
    return <span>{days}</span>;
  };

  return (
    <>
      <h2>Issues fechadas</h2>
      <DataTable<Fechadas>
        rows={fechadas}
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
            header: "Lead Time",
            render: renderLeadTime
          }
        ]}
      />
    </>
  );
};
