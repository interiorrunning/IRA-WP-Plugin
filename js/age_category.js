iraok.age_category.road = JSON.parse(iraok.age_category.info[0].Road);
iraok.age_category.cross = JSON.parse(iraok.age_category.info[0].Cross);

iraok.age_category.road_numbers = iraok.age_category.road.Numbers
  ? new Set(iraok.age_category.road.Numbers.map((n) => n.Number))
  : new Set();
iraok.age_category.cross_numbers = iraok.age_category.cross.Numbers
  ? new Set(iraok.age_category.cross.Numbers.map((n) => n.Number))
  : new Set();

iraok.age_category.years = JSON.parse(iraok.age_category.info[0].Years);

iraok.age_category.columns = {};

iraok.age_category.columns.age_group = {
  header: "Div",
  data_column: "AgeGroup",
  getContent: function (row) {
    return iraok.create_text(row[this.data_column], null, this.data_column);
  },
};

iraok.age_category.columns.name = {
  header: "Name",
  data_column: "Name",
  getContent: function (row) {
    let td = document.createElement("td");
    let a = document.createElement("a");
    a.href = "/athlete/" + row.UrlName + "/";
    a.innerText = row[this.data_column];
    td.appendChild(a);
    td.setAttribute("data-column", this.data_column);
    return td;
  },
};

iraok.age_category.columns.city = {
  header: "City",
  data_column: "City",
  getContent: function (row) {
    return iraok.create_text(row[this.data_column], null, this.data_column);
  },
};

iraok.age_category.columns.total = {
  header: "Total",
  data_column: "TotalPoints",
  getContent: function (row) {
    return iraok.create_text(row[this.data_column], null, this.data_column);
  },
};

iraok.age_category.columns.eligible = {
  header: "#",
  data_column: "Eligible",
  getContent: function (row) {
    let races = 0;
    let race_count = [
      row.AdjPoints01,
      row.AdjPoints02,
      row.AdjPoints03,
      row.AdjPoints04,
      row.AdjPoints05,
      row.AdjPoints06,
      row.AdjPoints07,
      row.AdjPoints08,
      row.AdjPoints09,
      row.AdjPoints10,
      row.AdjPoints11,
      row.AdjPoints12,
      row.AdjPoints13,
    ];
    for (let i = 0; i < 13; i++) {
      if (race_count[i]) races++;
    }

    return iraok.create_text(
      races +
        "/" +
        (row.IsRoad == 1
          ? iraok.age_category.road.MaxRaces
          : iraok.age_category.cross.MaxRaces),
      null,
      this.data_column
    );
  },
};

iraok.age_category.table_columns = [];
iraok.age_category.table_columns.push(iraok.age_category.columns.age_group);
iraok.age_category.table_columns.push(iraok.age_category.columns.name);
iraok.age_category.table_columns.push(iraok.age_category.columns.city);

iraok.age_category.table_headers = [];

for (let i = 1; i <= 13; i++) {
  if (
    !iraok.age_category.road_numbers.has(i) &&
    !iraok.age_category.cross_numbers.has(i)
  )
    continue;

  let num = ("0" + i).slice(-2);

  let number = {
    header: i,
    data_column: "Number" + num,
    get_header: function () {
      let th = document.createElement("th");
      th.innerText = i;
      th.setAttribute("data-column", this.data_column);
      iraok.age_category.table_headers.push({ cell: th, num: i });
      return th;
    },
    getContent: function (row) {
      let original_points = row["OriPoints" + num];
      let adjusted_points = row["AdjPoints" + num];
      let is_race_director = row["IsRaceDirector" + num];
      let td = document.createElement("td");

      if (original_points && !adjusted_points) {
        let del = document.createElement("del");
        del.innerText = original_points;
        td.appendChild(del);
      } else if (adjusted_points) {
        td.innerText = adjusted_points;
      }

      if (is_race_director == 0) {
        let span = document.createElement("span");
        span.innerText = "V";
        span.title = "Volunteer";
        td.appendChild(span);
      } else if (is_race_director == 1) {
        let span = document.createElement("span");
        span.innerText = "RD";
        span.title = "Race Director";
        td.appendChild(span);
      }
      td.setAttribute("data-column", this.data_column);
      return td;
    },
  };

  iraok.age_category.table_columns.push(number);
}

iraok.age_category.table_columns.push(iraok.age_category.columns.total);
iraok.age_category.table_columns.push(iraok.age_category.columns.eligible);

iraok.age_category.filter = function () {
  if (!iraok.age_category.filter_age_group)
    iraok.age_category.filter_age_group = iraok.get_cookie("age_group");

  if (!iraok.age_category.filter_age_group)
    iraok.age_category.filter_age_group = "All";

  if (!iraok.age_category.filter_type)
    iraok.age_category.filter_type = iraok.get_cookie("type");

  if (!iraok.age_category.filter_type) iraok.age_category.filter_type = "road";

  let ag = iraok.age_category.filter_age_group;
  let type = iraok.age_category.filter_type;

  if (iraok.age_category.style) iraok.age_category.style.remove();

  iraok.age_category.style = document.createElement("style");
  let text_content = "";
  text_content =
    "#iraok-age-category-table > table > tbody > tr[data-age-group] { display: none; } ";

  let age_group_filter_css = '[data-age-group="' + ag + '"]';
  let type_filter_css = '[data-type="' + type + '"]';

  text_content +=
    "#iraok-age-category-table > table > tbody > tr" +
    (ag == "All" ? "" : age_group_filter_css) +
    type_filter_css +
    " { display: table-row; } ";

  let valid_numbers =
    type == "road"
      ? iraok.age_category.road_numbers
      : iraok.age_category.cross_numbers;

  for (let i = 1; i <= 13; i++) {
    if (valid_numbers.has(i)) continue;

    let num = "Number" + ("0" + i).slice(-2);

    text_content +=
      '#iraok-age-category-table > table > tbody > tr > td[data-column="' +
      num +
      '"],  #iraok-age-category-table > table > thead > tr > th[data-column="' +
      num +
      '"] { display: none; } ';
  }
  iraok.age_category.style.textContent = text_content;
  document.head.appendChild(iraok.age_category.style);

  iraok.age_category.update_headers();

  return {
    ag: ag,
    type: type,
  };
};

iraok.age_category.populate_table = function () {
  let filters = iraok.age_category.filter();
  iraok.age_category.populate_years();
  iraok.age_category.populate_age_groups(filters);
  iraok.age_category.populate_type(filters);

  if (!iraok.age_category.figure)
    iraok.age_category.figure = document.getElementById(
      "iraok-age-category-table"
    );
  if (iraok.age_category.figure)
    iraok.age_category.table = iraok.age_category.figure.firstElementChild;

  if (iraok.age_category.results && iraok.age_category.results.length > 0)
    iraok.clear_table(iraok.age_category.table);

  if (iraok.age_category.table && !iraok.age_category.table_caption) {
    iraok.age_category.table_caption = document.createElement("caption");
    iraok.age_category.table.appendChild(iraok.age_category.table_caption);
    iraok.age_category.set_table_caption();
  }

  if (iraok.age_category.results && iraok.age_category.results.length > 0) {
    iraok.set_table(
      iraok.age_category.table,
      iraok.age_category.table_columns,
      iraok.age_category.results,
      null,
      [iraok.age_category.figure, iraok.age_category.age_group],
      function (tr, row) {
        tr.setAttribute("data-age-group", row.AgeGroup);
        tr.setAttribute("data-type", row.IsRoad == 1 ? "road" : "cross");
      }
    );
    iraok.age_category.update_headers();
  }
};

iraok.age_category.populate_years = function () {
  if (!iraok.age_category.years_group) {
    iraok.age_category.years_group = document.getElementById(
      "iraok-age-category-years"
    ).firstElementChild;
    let group = iraok.age_category.years_group;

    let selected_year = iraok.age_category.info[0].Year;
    let select = document.createElement("select");
    for (let i = 0; i < iraok.age_category.years.length; i++) {
      let year = iraok.age_category.years[i];
      let option = document.createElement("option");
      select.appendChild(option);
      option.value = year;
      option.innerText = year;
      if (selected_year == year) option.setAttribute("selected", "");
    }

    iraok.age_category.years_group.appendChild(select);
    select.onchange = function () {
      window.location.href = "/age-category-scoring/" + this.value + "/";
    };

    group.appendChild(select);
  }
};

iraok.age_category.populate_age_groups = function (filters) {
  if (!iraok.age_category.age_group) {
    iraok.age_category.age_group = document.getElementById(
      "iraok-age-category-divs"
    ).firstElementChild;
    let group = iraok.age_category.age_group;

    let age_groups = [
      ...new Set(iraok.age_category.results.map((x) => x.AgeGroup)),
    ].sort();
    age_groups.unshift("All");

    let age_group_found = false;
    let first_option = null;

    let select = document.createElement("select");
    for (let i = 0; i < age_groups.length; i++) {
      let ag = age_groups[i];
      let option = document.createElement("option");
      select.appendChild(option);
      option.value = ag;
      option.innerText = ag;
      if (filters.ag == ag) {
        age_group_found = true;
        option.setAttribute("selected", "");
      }

      if (!first_option) first_option = option;
    }

    if (!age_group_found && first_option) {
      first_option.setAttribute("selected", "");
      iraok.age_category.set_filter_age_group(first_option.value);
      iraok.age_category.filter();
    }

    select.focus();
    select.onchange = function () {
      iraok.age_category.set_filter_age_group(this.value);
      iraok.age_category.filter();
    };
    group.appendChild(select);
  }
};

iraok.age_category.populate_type = function (filters) {
  if (!iraok.age_category.type) {
    iraok.age_category.type = document.getElementById(
      "iraok-age-category-type"
    ).firstElementChild;
    let group = iraok.age_category.type;
    let div = document.createElement("div");

    let road = iraok.age_category.get_input_radio(
      "iraok_type_road",
      "iraok_type",
      "road",
      "Road",
      "directions_run",
      filters.type == "road"
    );
    let cross = iraok.age_category.get_input_radio(
      "iraok_type_cross",
      "iraok_type",
      "cross",
      "Trail",
      "landscape",
      filters.type == "cross"
    );

    div.appendChild(road);
    div.appendChild(cross);
    group.appendChild(div);
  }
};

iraok.age_category.get_input_radio = function (
  id,
  name,
  value,
  labelVal,
  icon,
  checked
) {
  let div = document.createElement("div");
  let input = document.createElement("input");
  input.id = id;
  input.type = "radio";
  input.name = name;
  input.value = value;
  input.checked = checked;
  input.onchange = function () {
    iraok.age_category.set_filter_type(this.value);
    iraok.age_category.filter();
  };

  let label = document.createElement("label");
  label.setAttribute("for", input.id);
  label.innerText = labelVal;

  let span = document.createElement("span");
  span.className = "material-symbols-outlined";
  span.innerText = icon;
  span.title = labelVal;

  let label_icon = document.createElement("label");
  label_icon.setAttribute("for", input.id);
  label_icon.appendChild(span);

  div.appendChild(label_icon);
  div.appendChild(input);
  div.appendChild(label);
  return div;
};

iraok.age_category.set_filter_age_group = function (age_group) {
  iraok.age_category.filter_age_group = age_group;
  iraok.set_cookie("age_group", age_group, 30);
  iraok.age_category.set_table_caption();
};

iraok.age_category.set_filter_type = function (type) {
  iraok.age_category.filter_type = type;
  iraok.set_cookie("type", type, 30);
  iraok.age_category.set_table_caption();
};

iraok.age_category.set_table_caption = function () {
  let info =
    iraok.age_category.filter_type == "road"
      ? iraok.age_category.road
      : iraok.age_category.cross;

  let txt = info.MaxRaces
    ? "Max " + info.MaxRaces + " races | Min " + info.MinRaces + " races"
    : "No races this year";

  if (iraok.age_category.table_caption)
    iraok.age_category.table_caption.innerText = txt;
};

iraok.age_category.update_headers = function () {
  let info =
    iraok.age_category.filter_type == "road"
      ? iraok.age_category.road.Numbers
      : iraok.age_category.cross.Numbers;

  for (
    let i = 0;
    iraok.age_category.table_headers &&
    i < iraok.age_category.table_headers.length;
    i++
  ) {
    let header = iraok.age_category.table_headers[i];
    let x = null;
    if (info) x = info.find((x) => x.Number == header.num);

    if (x) {
      let th = header.cell;
      th.innerHTML = "";
      if (x.Name) th.title = x.Name;

      if (x.UrlName) {
        let a = document.createElement("a");
        a.href =
          "/race/" +
          iraok.age_category.info[0].Year +
          "/" +
          x.UrlName +
          "/" +
          (iraok.age_category.filter_age_group
            ? "#" + iraok.age_category.filter_age_group
            : "");
        a.innerText = header.num;
        th.appendChild(a);
      } else {
        th.innerText = header.num;
      }
    }
  }
};
