import axios from "axios";
import { Cell, DataTable, DateField, Grid, HFlow, VFlow } from "bold-ui";
import { TableColumnConfig } from "bold-ui/lib/components/Table/DataTable/DataTable";
import React, { useEffect, useState } from "react";
import { Abertas } from "./Abertas";
import CFD from "./CFD";
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

interface Periodo {
  dataInicio: string;
  dataFim: string;
}

export const Colunas = (props: ColunaProps) => {
  const [coluna, setColuna] = useState<Coluna[]>();

  const [icp, setIcp] = useState<Icp[]>();

  const [periodo, setPeriodo] = useState<Periodo>({
    dataInicio: "09/09/2019",
    dataFim: "16/09/2019"
  });

  useEffect(() => {
    axios
      .get("/col", {
        params: {
          id: props.projeto.id
        }
      })
      .then(resp => {
        console.log("resp", resp.data.result.rows);
        setColuna(resp.data.result.rows);
      });
    axios
      .get("/ipc", {
        params: {
          id: props.projeto.id,
          dataInicio: periodo.dataInicio,
          dataFim: periodo.dataFim
        }
      })
      .then(resp => {
        console.log("ipc: ", resp.data);
        setIcp(resp.data.result.rows);
      });
  }, [props.projeto, periodo.dataInicio, periodo.dataFim]);

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
    render: a => periodo.dataInicio
  };
  c[1] = {
    name: "Data Fim",
    header: "Data Fim",
    render: a => periodo.dataFim
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

  const handleChangeDataInicio = (selectedDate: Date) => {
    setPeriodo({
      dataInicio: new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "numeric",
        year: "numeric"
      }).format(selectedDate),
      dataFim: periodo.dataFim
    });
  };

  const handleChangeDataFim = (selectedDate: Date) =>
    setPeriodo({
      dataInicio: periodo.dataInicio,
      dataFim: new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "numeric",
        year: "numeric"
      }).format(selectedDate)
    });

  return (
    <>
      <VFlow>
        <Grid>
          <Cell size={2} />
          <Cell size={8}>
            <VFlow>
              <HFlow>
                <DateField
                  label="Data Início"
                  name="inicio"
                  //value={new Date(periodo.dataInicio)}
                  onChange={handleChangeDataInicio}
                />
                <DateField
                  label="Data Fim"
                  name="fim"
                  //value={new Date(periodo.dataFim)}
                  onChange={handleChangeDataFim}
                />
              </HFlow>
              <DataTable rows={[renderIssue()]} columns={c} />
            </VFlow>
          </Cell>
          <Cell size={2} />
        </Grid>
        <Abertas projeto={props.projeto} />
        <Fechadas projeto={props.projeto} />
        <Grid>
          <Cell size={2} />
          <Cell size={8}>
            <CFD projeto={props.projeto} />
          </Cell>
          <Cell size={2} />
        </Grid>
      </VFlow>
    </>
  );
};

export default Colunas;
