iraok.award.previous_text = "";
iraok.award.is_first = 1;

iraok.award.columns = {};

iraok.award.results_and_headers = [];
for (let i = 0; i < iraok.award.results.length; i++) {
  let row = iraok.award.results[i];
  let text = row.Award;
  if (row.Subtitle) text += " - " + row.Subtitle;

  if (iraok.award.previous_text != text) {
    iraok.award.previous_text = text;

    if (iraok.award.is_first != 1) {
      let size = iraok.award.results_and_headers.length % 2;
      iraok.award.results_and_headers.push({ Blank: size });
      if (size === 0) iraok.award.results_and_headers.push({ Blank: size });
    }

    iraok.award.results_and_headers.push({ Header: text });
  }
  iraok.award.results_and_headers.push(row);

  iraok.award.is_first = 0;
}

console.log(iraok.award.results_and_headers);

iraok.award.columns.award = {
  header: "Award",
  data_column: "Award",
  getContent: function (row) {
    let text = row.Award;
    if (row.Subtitle) text += " - " + row.Subtitle;

    if (iraok.award.previous_text == text) {
      text = "";
    } else {
      iraok.award.previous_text = text;
    }
    return iraok.create_header(text, null, this.data_column);
  },
};

iraok.award.columns.winner = {
  header: "Name",
  data_column: "Name",
  getContent: function (row) {
    let td = document.createElement("td");
    td.setAttribute("data-column", this.data_column);

    let ul = document.createElement("ul");
    let li = document.createElement("li");
    let a = document.createElement("a");
    a.href = "/athlete/" + row.urlname + "/";
    a.innerText = row.Name;

    td.appendChild(ul);
    ul.appendChild(li);
    li.appendChild(a);

    return td;
  },
};

iraok.award.columns.city = {
  header: "City",
  data_column: "City",
  getContent: function (row) {
    return iraok.create_text(row.City, null, this.data_column);
  },
};

iraok.award.columns.combined = {
  header: "Award",
  data_column: "Award",
  getContent: function (row) {
    if (row.Header) {
      let th = iraok.create_header(row.Header, null, this.data_column);
      //th.colSpan = 2;
      return th;
    } else if (row.Blank === 0 || row.Blank === 1) {
      let td = document.createElement("td");
      if (row.Blank === 1) td.appendChild(document.createTextNode("\u00A0"));
      td.setAttribute("data-column", "Blank");
      return td;
    } else
      return [
        iraok.award.columns.winner.getContent(row),
        //iraok.award.columns.city.getContent(row),
      ];
  },
};

iraok.award.table_columns = [];
iraok.award.table_columns.push(iraok.award.columns.combined);
/*
iraok.award.table_columns.push(iraok.award.columns.award);
iraok.award.table_columns.push(iraok.award.columns.winner);
iraok.award.table_columns.push(iraok.award.columns.city);
*/

iraok.award.populate_table = function () {
  if (!iraok.award.figure)
    iraok.award.figure = document.getElementById("iraok-awards-table");
  if (iraok.award.figure)
    iraok.award.table = iraok.award.figure.firstElementChild;

  if (
    !iraok.award.year_group &&
    iraok.award.results &&
    iraok.award.results.length > 0
  ) {
    iraok.award.year_group = document.getElementById("iraok-awards-group");
    let select = document.createElement("select");
    for (let i = 0; i < iraok.award.years.length; i++) {
      let year = iraok.award.years[i].Year;
      let option = document.createElement("option");
      select.appendChild(option);
      option.value = year;
      option.innerText = year;
      if (year == iraok.award.selected_year)
        option.setAttribute("selected", "");
    }
    iraok.award.year_group.appendChild(select);
    select.focus();
    select.onchange = function () {
      location.href = "/award/" + this.value + "/";
    };
  }

  if (iraok.award.results && iraok.award.results.length > 0)
    iraok.clear_table(iraok.award.table);

  if (iraok.award.results && iraok.award.results.length > 0)
    iraok.set_table(
      iraok.award.table,
      iraok.award.table_columns,
      iraok.award.results_and_headers,
      null,
      [iraok.award.figure, iraok.award.year_group]
    );
};
