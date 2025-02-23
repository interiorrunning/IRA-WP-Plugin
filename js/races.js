iraok.races.columns = {};

iraok.races.columns.date = {
  header: "Date",
  data_column: "Date",
  getContent: function (row) {
    return iraok.create_text(row[this.data_column], null, this.data_column);
  },
};

iraok.races.columns.type = {
  header: "",
  data_column: "Type",
  getContent: function (row) {
    let td = document.createElement("td");
    td.title = row.IsRoad == 1 ? "Road" : "Trail";
    td.setAttribute("data-column", this.data_column);

    if (row.IsRoad == 1) td.appendChild(iraok.get_svg_running());
    else td.appendChild(iraok.get_svg_landscape());

    return td;
  },
};

iraok.races.columns.name = {
  header: "Name",
  data_column: "Name",
  getContent: function (row) {
    let td = document.createElement("td");
    let a = document.createElement("a");
    a.href = "/race/" + row.Year + "/" + row.UrlName + "/";
    a.innerText = row[this.data_column];
    td.appendChild(a);
    td.setAttribute("data-column", this.data_column);
    return td;
  },
};

iraok.races.columns.city = {
  header: "City",
  data_column: "City",
  getContent: function (row) {
    return iraok.create_text(row[this.data_column], null, this.data_column);
  },
};

iraok.races.columns.top_female = {
  header: "Top Female",
  data_column: "FName",
  getContent: function (row) {
    let td = document.createElement("td");
    let a = document.createElement("a");
    a.href = "/athlete/" + row.Furlname + "/";
    a.innerText = row[this.data_column];
    td.appendChild(a);
    td.setAttribute("data-column", this.data_column);
    return td;
  },
};

iraok.races.columns.top_male = {
  header: "Top Male",
  data_column: "MName",
  getContent: function (row) {
    let td = document.createElement("td");
    let a = document.createElement("a");
    a.href = "/athlete/" + row.Murlname + "/";
    a.innerText = row[this.data_column];
    td.appendChild(a);
    td.setAttribute("data-column", this.data_column);
    return td;
  },
};

iraok.races.columns.finishers = {
  header: "Size",
  data_column: "Finishers",
  getContent: function (row) {
    return iraok.create_text(row[this.data_column], null, this.data_column);
  },
};

iraok.races.table_columns = [];
iraok.races.table_columns.push(iraok.races.columns.type);
iraok.races.table_columns.push(iraok.races.columns.date);
iraok.races.table_columns.push(iraok.races.columns.name);
iraok.races.table_columns.push(iraok.races.columns.city);
iraok.races.table_columns.push(iraok.races.columns.top_female);
iraok.races.table_columns.push(iraok.races.columns.top_male);
iraok.races.table_columns.push(iraok.races.columns.finishers);

iraok.races.populate_table = function () {
  if (!iraok.races.figure)
    iraok.races.figure = document.getElementById("iraok-races-table");
  if (iraok.races.figure)
    iraok.races.table = iraok.races.figure.firstElementChild;

  if (
    !iraok.races.year_group &&
    iraok.races.results &&
    iraok.races.results.length > 0
  ) {
    let years = [...new Set(iraok.races.results.map((x) => x.Year))]
      .sort()
      .reverse();
    years.unshift("All");
    iraok.races.year_group = document.getElementById("iraok-races-group");
    let select = document.createElement("select");
    for (let i = 0; i < years.length; i++) {
      let year = years[i];
      let option = document.createElement("option");
      select.appendChild(option);
      option.value = year;
      option.innerText = year;
    }
    iraok.races.year_group.appendChild(select);
    select.focus();
    select.onchange = function () {
      if (iraok.races.style) iraok.races.style.remove();
      if (this.value != "All") {
        iraok.races.style = document.createElement("style");
        iraok.races.style.textContent =
          "tr[data-year] { display: none; }" +
          'tr[data-year="' +
          this.value +
          '"] { display: table-row; }';
        document.head.appendChild(iraok.races.style);
      }
    };
  }

  if (iraok.races.results && iraok.races.results.length > 0)
    iraok.clear_table(iraok.races.table);

  if (iraok.races.results && iraok.races.results.length > 0)
    iraok.set_table(
      iraok.races.table,
      iraok.races.table_columns,
      iraok.races.results,
      null,
      [iraok.races.figure, iraok.races.year_group],
      function (tr, row) {
        tr.setAttribute("data-year", row.Year);
      }
    );
};
