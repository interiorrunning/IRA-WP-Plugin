iraok.search.columns = {};

iraok.search.columns.name = {
  header: "Name",
  data_column: "Name",
  getContent: function (row) {
    let td = document.createElement("td");
    let a = document.createElement("a");
    a.href = "/athlete/" + row.urlname + "/";
    a.innerText = row[this.data_column];
    td.appendChild(a);
    td.setAttribute("data-column", this.data_column);
    return td;
  },
};

iraok.search.columns.city = {
  header: "City",
  data_column: "City",
  getContent: function (row) {
    return iraok.create_text(row[this.data_column], null, this.data_column);
  },
};

iraok.search.columns.div = {
  header: "Div",
  title: "Age Group",
  data_column: "AgeGroup",
  getContent: function (row) {
    return iraok.create_text(
      iraok.get_division(row[this.data_column]),
      null,
      this.data_column
    );
  },
};

iraok.search.columns.races = {
  header: "Races",
  data_column: "Races",
  getContent: function (row) {
    return iraok.create_text(row[this.data_column], null, this.data_column);
  },
};

iraok.search.table_columns = [];
iraok.search.table_columns.push(iraok.search.columns.name);
iraok.search.table_columns.push(iraok.search.columns.city);
iraok.search.table_columns.push(iraok.search.columns.div);
iraok.search.table_columns.push(iraok.search.columns.races);

iraok.search.populate_years = function () {
  if (!iraok.search.years_group) {
    iraok.search.years_group = document.getElementById(
      "iraok-age-grade-years"
    ).firstElementChild;
    let group = iraok.search.years_group;

    let selected_year = iraok.search.info[0].Year;
    let select = document.createElement("select");
    for (let i = 0; i < iraok.search.years.length; i++) {
      let year = iraok.search.years[i];
      let option = document.createElement("option");
      select.appendChild(option);
      option.value = year;
      option.innerText = year;
      if (selected_year == year) option.setAttribute("selected", "");
    }

    iraok.search.years_group.appendChild(select);
    select.onchange = function () {
      window.location.href = "/age-grade-scoring/" + this.value + "/";
    };

    group.appendChild(select);
  }
};

iraok.search.set_table_caption = function () {
  let caption = "";
  let sp = iraok.search.search_parameters;

  if (sp) {
    if (!sp.q) caption = "Start searching";
    else if (iraok.search.results.length == 0) caption = "No results found";
  }

  if (iraok.search.table_caption)
    iraok.search.table_caption.innerText = caption;
};

iraok.search.populate_table = function () {
  if (!iraok.search.figure)
    iraok.search.figure = document.getElementById("iraok-search-table");
  if (iraok.search.figure)
    iraok.search.table = iraok.search.figure.firstElementChild;

  if (!iraok.search.bar)
    iraok.search.bar = document.getElementById("iraok-search-bar");

  if (iraok.search.bar)
    iraok.search.bar_div = iraok.search.bar.firstElementChild;

  if (iraok.search.bar_div)
    iraok.search.bar_div.appendChild(iraok.search.create_search_bar());

  if (iraok.search.results) iraok.clear_table(iraok.search.table);

  if (iraok.search.table && !iraok.search.table_caption) {
    iraok.search.table_caption = document.createElement("caption");
    iraok.search.table.appendChild(iraok.search.table_caption);
    iraok.search.set_table_caption();
  }

  if (iraok.search.results)
    iraok.set_table(
      iraok.search.table,
      iraok.search.table_columns,
      iraok.search.results,
      null,
      [iraok.search.figure, iraok.search.bar],
      null
    );
};

iraok.search.create_search_bar = function () {
  let form = document.createElement("form");
  form.role = "search";
  form.method = "get";
  form.action = "";
  form.className =
    "wp-block-search__button-outside wp-block-search__icon-button wp-block-search";

  let div = document.createElement("div");
  div.className = "wp-block-search__inside-wrapper";

  let input = document.createElement("input");
  input.type = "search";
  input.className = "wp-block-search__input";
  input.name = "q";
  if (iraok.search.search_parameters && iraok.search.search_parameters.q)
    input.value = iraok.search.search_parameters.q;
  input.placeholder = "";
  input.required = "";

  let button = document.createElement("button");
  button.type = "submit";
  button.className = "wp-block-search__button has-icon";

  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "search-icon");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");

  let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "M13.5 6C10.5 6 8 8.5 8 11.5c0 1.1.3 2.1.9 3l-3.4 3 1 1.1 3.4-2.9c1 .9 2.2 1.4 3.6 1.4 3 0 5.5-2.5 5.5-5.5C19 8.5 16.5 6 13.5 6zm0 9.5c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"
  );

  form.appendChild(div);
  div.appendChild(input);
  div.appendChild(button);
  button.appendChild(svg);
  svg.appendChild(path);

  return form;
};
