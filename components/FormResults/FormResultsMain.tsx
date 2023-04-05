import { Button } from "components/Button";
import { useRef, useState, useCallback, useMemo, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { trpc } from "utils/trpc";
import { Dropdown } from "components/Dropdown";
import { Spinner } from "components/Spinner";
import clsx from "clsx";

export type FormResultsMainProps = {
  formId: string;
};

export function FormResultsMain({ formId }: FormResultsMainProps) {
  const { data: form } = trpc.form.get.useQuery({ formId });
  const [version, setVersion] = useState(0);
  const gridRef = useRef<AgGridReact<any>>(null);

  const { data, isLoading } = trpc.form.listAnswers.useQuery(
    { formId, version },
    {
      enabled: version > 0,
    }
  );

  const [rowData, setRowData] = useState<any[]>([]);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);

  useEffect(() => {
    if (!data) {
      return;
    }
    setRowData(data.rowData);
    setColumnDefs(data.columnDefs);
  }, [data]);

  useEffect(() => {
    if (!form) return;
    setVersion(form.version);
  }, [form]);

  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  const downloadCSV = useCallback(() => {
    if (!gridRef.current) return;
    gridRef.current.api.exportDataAsCsv();
  }, [gridRef]);

  return (
    <section className="flex h-full flex-col overflow-hidden bg-slate-100 p-4">
      <div className="z-10 flex justify-between">
        <div className="flex items-center gap-2">
          <Dropdown
            label="Version"
            choices={new Array(form?.version ?? 0).fill(0).map((_, i) => i + 1)}
            value={version}
            onChange={setVersion}
          />
        </div>
        <div>
          <Button icon="download" onClick={downloadCSV} disabled={isLoading}>
            Download CSV
          </Button>
        </div>
      </div>
      <div className="ag-theme-alpine relative h-full w-full pt-2">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows
          className={clsx(isLoading && "opacity-50")}
        />
        {isLoading && (
          <div className="absolute top-2 bottom-0 right-0 left-0 flex items-center justify-center">
            <Spinner />
          </div>
        )}
      </div>
    </section>
  );
}
