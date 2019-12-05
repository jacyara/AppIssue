import axios from "axios";
import {
  Button,
  Cell,
  DataTable,
  DateField,
  Grid,
  HFlow,
  VFlow
} from "bold-ui";
import { TableColumnConfig } from "bold-ui/lib/components/Table/DataTable/DataTable";
import React, { useEffect, useState } from "react";
import { Abertas } from "./Abertas";
import CFD from "./CFD";
import { Projeto } from "./Equipes";
import { Fechadas } from "./Fechadas";
import LeadTime from "./LeadTime";
import ModuloEscolha from "./ModuloEscolha";
import Throughput from "./Throughput";

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

interface PeriodoColetado {
  dataInicio: Date;
  dataFim: Date;
}

interface Atualizar {
  atualizar: boolean;
}

export const Colunas = (props: ColunaProps) => {
  const [coluna, setColuna] = useState<Coluna[]>();

  const [icp, setIcp] = useState<Icp[]>();

  const [periodo, setPeriodo] = useState<Periodo>({
    dataInicio: "09/09/2019",
    dataFim: "16/09/2019"
  });

  const [atualizar, setAtualizar] = useState<Atualizar>({
    atualizar: false
  });

  console.log("Botao", atualizar);

  const [periodoColetado, setPeriodoColetado] = useState<PeriodoColetado>({
    dataInicio: new Date("09/09/2019"),
    dataFim: new Date("09/16/2019")
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
    if (atualizar.atualizar.valueOf()) {
      axios.get("/eventos").then(resp => {});
    }
  }, [props.projeto, periodo, atualizar]);

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
      dataInicio: dateToString(selectedDate),
      dataFim: periodo.dataFim
    });
    console.log("handleChangeDataInicio()", periodoColetado);
    setPeriodoColetado({
      dataInicio: selectedDate,
      dataFim: periodoColetado.dataFim
    });
  };

  const handleChangeDataFim = (selectedDate: Date) => {
    setPeriodo({
      dataInicio: periodo.dataInicio,
      dataFim: dateToString(selectedDate)
    });
    setPeriodoColetado({
      dataInicio: periodoColetado.dataInicio,
      dataFim: selectedDate
    });
  };

  function dateToString(date: Date) {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "numeric",
      year: "numeric"
    }).format(date);
  }
  function onClickHandle() {
    setAtualizar({
      atualizar: true
    });
  }
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
                  value={periodoColetado.dataInicio}
                  onChange={handleChangeDataInicio}
                />
                <DateField
                  label="Data Fim"
                  name="fim"
                  value={periodoColetado.dataFim}
                  onChange={handleChangeDataFim}
                />
              </HFlow>
              <DataTable rows={[renderIssue()]} columns={c} />
            </VFlow>
          </Cell>
          <Cell size={2} />
        </Grid>
        <Grid>
          <Cell size={9} />
          <Button
            skin="outline"
            size="medium"
            kind="primary"
            onClick={onClickHandle}
          >
            {" "}
            Atualizar!{" "}
          </Button>
        </Grid>
        <Abertas projeto={props.projeto} />
        <Fechadas projeto={props.projeto} />
        <Grid>
          <Cell size={3} />
          <Cell size={6}>{<LeadTime projeto={props.projeto} />}</Cell>
          <Cell size={3} />
        </Grid>
        <Grid>
          <Cell size={3} />
          <Cell size={6}>{<CFD projeto={props.projeto} />}</Cell>
          <Cell size={3} />
        </Grid>
        <Grid>
          <Cell size={3} />
          <Cell size={6}>
            <Throughput projeto={props.projeto}></Throughput>
          </Cell>
          <Cell size={3} />
        </Grid>
        <Grid>
          <Cell size={3} />
          <Cell size={6}>
            <ModuloEscolha projeto={props.projeto} />
          </Cell>
          <Cell size={3} />
        </Grid>
      </VFlow>
    </>
  );
};

export default Colunas;
