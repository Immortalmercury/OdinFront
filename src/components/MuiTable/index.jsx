import React from "react";
import MUIDataTable from "mui-datatables";


const MuiTable = ({
  download,
  filter,
  print,
  selectableRowsHideCheckboxes,
  selectableRowsHeader,
  noMatch,
  onRowsDelete,
  search,
  viewColumns,
  options,
  style=null,
  ...props
}) => {
  var defaultOptions = {
    download: false,
    draggable: false,
    filter: false,
    print: false,
    selectableRowsHideCheckboxes: true,
    selectableRowsHeader: false,
    textLabels: {
      body: {
        noMatch: "Совпадений нет",
        toolTip: "Сортировать",
        columnHeaderTooltip: (column) => `Сортировать ${column.label}`,
      },
      pagination: {
        next: "Следующая страница",
        previous: "Предыдущая страница",
        rowsPerPage: "Показывать по:",
        displayRows: "из",
      },
      toolbar: {
        search: "Поиск",
        downloadCsv: "Загрузить CSV",
        print: "Распечатать",
        viewColumns: "Отображать столбцы",
        filterTable: "Фильтрация данных",
      },
      filter: {
        all: "Все",
        title: "Фильтры",
        reset: "Сбросить",
      },
      viewColumns: {
        title: "Показывать только",
        titleAria: "Показать/Скрыть столбцы",
      },
      selectedRows: {
        text: "строк выбрано",
        delete: "Удалить",
        deleteAria: "Удалить выбранные строки",
      },
    },
  };
  if (!options) {
    if (download!==undefined) defaultOptions.download = download;
    if (filter!==undefined) defaultOptions.filter = filter;
    if (print!==undefined) defaultOptions.print = print;
    if (selectableRowsHideCheckboxes!==undefined) defaultOptions.selectableRowsHideCheckboxes = selectableRowsHideCheckboxes;
    if (selectableRowsHeader!==undefined) defaultOptions.selectableRowsHeader = selectableRowsHeader;
    if (search!==undefined) defaultOptions.search = search;
    if (viewColumns!==undefined) defaultOptions.viewColumns = viewColumns;
    if (noMatch!==undefined) defaultOptions.textLabels.body.noMatch = noMatch;
    if (onRowsDelete!==undefined) defaultOptions.onRowsDelete = onRowsDelete;
  }
  return (<>
      <div style={style ? style : {}}>
        <MUIDataTable options={options ? options : defaultOptions} {...props} />
      </div>
    </>
  );
};

export default MuiTable;
