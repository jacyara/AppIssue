import axios from "axios";
import { DataTable } from "bold-ui";
import { TableColumnConfig } from "bold-ui/lib/components/Table/DataTable/DataTable";
import React, { useEffect, useState } from "react";
import { Abertas } from "./Abertas";
import { Projeto } from "./Equipes";
import { Fechadas } from "./Fechadas";

type Coluna = {
  nome: string;
};

type Icp = {
  coluna: string;
  count: number;
};

interface ColunaProps {
  projeto: Projeto;
}

export const Colunas = (props: ColunaProps) => {
  const [coluna, setColuna] = useState<Coluna[]>();

  const [icp, setIcp] = useState<Icp[]>();

  useEffect(() => {
    axios.get("/col", { params: { id: props.projeto.id } }).then(resp => {
      console.log("resp", resp.data.result.rows);
      setColuna(resp.data.result.rows);
    });
    axios
      .get("/ipc", {
        params: {
          id: props.projeto.id
        }
      })
      .then(resp => {
        console.log("ipc: ", resp.data);
        setIcp(resp.data.result.rows);
      });
  }, [props.projeto]);

  if (!props || !coluna || !coluna[0] || !icp) {
    return null;
  }

  let cols: [TableColumnConfig] = [
    {
      name: "",
      header: "",
      render: () => <span></span>
    }
  ];
  let c = [
    {
      name: "",
      header: "",
      render: () => <span></span>
    },
    {
      name: "",
      header: "",
      render: () => <span></span>
    },
    ...cols
  ];

  c[0] = {
    name: "Data Início",
    header: "Data Início",
    render: a => "09/09/2019"
  };
  c[1] = {
    name: "Data Fim",
    header: "Data Fim",
    render: a => "16/09/2019"
  };

  coluna.forEach((item, index) => {
    c[index + 2] = {
      name: item.nome,
      header: item.nome,
      render: a => <span>{a.get(item.nome)}</span>
    };
  });

  const renderIssue = () => {
    let issues = new Map();
    coluna.map(item => issues.set(item.nome, countIssue(item.nome)));
    console.log(issues);
    return issues;
  };

  const countIssue = (name: string) => {
    var col = icp.filter(x => x.coluna === name);
    if (col.length === 0) {
      return 0;
    }
    return col[0].count;
  };

  return (
    <>
      <DataTable rows={[renderIssue()]} columns={c} />

      <Abertas projeto={props.projeto} />
      <Fechadas projeto={props.projeto} />
    </>
  );
};

export default Colunas;
