iraok.age_grade.road = JSON.parse(iraok.age_grade.info[0].Road);
iraok.age_grade.cross = JSON.parse(iraok.age_grade.info[0].Cross);

iraok.age_grade.road_numbers = iraok.age_grade.road.Numbers
  ? new Set(iraok.age_grade.road.Numbers.map((n) => n.Number))
  : new Set();
iraok.age_grade.cross_numbers = iraok.age_grade.cross.Numbers
  ? new Set(iraok.age_grade.cross.Numbers.map((n) => n.Number))
  : new Set();

iraok.age_grade.results_road = new Map();
iraok.age_grade.results_cross = new Map();
for (let i = 0; i < iraok.age_grade.results.length; i++) {
  let row = iraok.age_grade.results[i];
  let results =
    row.ir == 1 ? iraok.age_grade.results_road : iraok.age_grade.results_cross;
  if (!results.has(row.ur))
    results.set(row.ur, {
      total: 0,
      urlname: row.ur,
      age_group: row.di,
      IsRoad: row.ir,
      IsMale: row.di[0] == "F" ? 0 : 1,
    });
  let athlete = results.get(row.ur);

  if (row.p2 && parseFloat(row.p2)) {
    athlete.total += parseFloat(row.p2);
  }
  athlete["n" + row.n] = { p1: row.p1, p2: row.p2 };
  if (row.na) athlete.name = row.na;
  if (row.ci) athlete.city = row.ci;
}

iraok.age_grade.results_flattened = [
  ...iraok.age_grade.results_road.values(),
  ...iraok.age_grade.results_cross.values(),
].sort((a, b) => b.total - a.total);

iraok.age_grade.top_x = 20;
iraok.age_grade.results_flattened = [
  ...iraok.age_grade.results_flattened
    .filter((x) => x.IsMale == 1 && x.IsRoad == 1)
    .slice(0, iraok.age_grade.top_x),
  ...iraok.age_grade.results_flattened
    .filter((x) => x.IsMale == 1 && x.IsRoad == 0)
    .slice(0, iraok.age_grade.top_x),
  ...iraok.age_grade.results_flattened
    .filter((x) => x.IsMale == 0 && x.IsRoad == 1)
    .slice(0, iraok.age_grade.top_x),
  ...iraok.age_grade.results_flattened
    .filter((x) => x.IsMale == 0 && x.IsRoad == 0)
    .slice(0, iraok.age_grade.top_x),
];

iraok.age_grade.years = JSON.parse(iraok.age_grade.info[0].Years);

iraok.age_grade.columns = {};

iraok.age_grade.columns.age_group = {
  header: "Div",
  data_column: "age_group",
  getContent: function (row) {
    return iraok.create_text(row[this.data_column], null, this.data_column);
  },
};

iraok.age_grade.columns.name = {
  header: "Name",
  data_column: "name",
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

iraok.age_grade.columns.city = {
  header: "City",
  data_column: "city",
  getContent: function (row) {
    return iraok.create_text(row[this.data_column], null, this.data_column);
  },
};

iraok.age_grade.columns.total = {
  header: "Total",
  data_column: "total",
  getContent: function (row) {
    var data = row[this.data_column];
    return iraok.create_text(iraok.age_grade.info[0].Year >= 2025 ? parseFloat(data).toFixed(2) : data, null, this.data_column);
  },
};

iraok.age_grade.columns.eligible = {
  header: "#",
  data_column: "eligible",
  getContent: function (row) {
    let races = 0;

    for (let i = 1; i <= 13; i++) {
      let num = row["n" + i];
      if (num && num.p2) races++;
    }

    return iraok.create_text(
      races +
      "/" +
      (row.IsRoad == 1
        ? iraok.age_grade.road.MaxRaces
        : iraok.age_grade.cross.MaxRaces),
      null,
      this.data_column
    );
  },
};

iraok.age_grade.table_columns = [];
iraok.age_grade.table_columns.push(iraok.age_grade.columns.name);
iraok.age_grade.table_columns.push(iraok.age_grade.columns.city);
iraok.age_grade.table_columns.push(iraok.age_grade.columns.age_group);

iraok.age_grade.table_headers = [];

for (let i = 1; i <= 13; i++) {
  if (
    !iraok.age_grade.road_numbers.has(i) &&
    !iraok.age_grade.cross_numbers.has(i)
  )
    continue;

  let num = i;

  let number = {
    header: i,
    data_column: "n" + num,
    get_header: function () {
      let th = document.createElement("th");
      th.innerText = i;
      th.setAttribute("data-column", this.data_column);
      iraok.age_grade.table_headers.push({ cell: th, num: i });
      return th;
    },
    getContent: function (row) {
      let rn = row["n" + num];
      let original_points = rn ? rn.p1 : null;
      let adjusted_points = rn ? rn.p2 : null;
      let td = document.createElement("td");
      let is_new = iraok.age_grade.info[0].Year >= 2025;
      if (original_points && !adjusted_points) {
        let del = document.createElement("del");
        del.innerText = is_new ? parseFloat(original_points).toFixed(1) : Math.round(original_points);
        del.title = is_new ? original_points : "";
        td.appendChild(del);
      } else if (adjusted_points) {
        td.innerText = is_new ? parseFloat(adjusted_points).toFixed(1) : Math.round(adjusted_points);
        td.title = is_new ? adjusted_points : "";
      }
      td.setAttribute("data-column", this.data_column);
      return td;
    },
  };

  iraok.age_grade.table_columns.push(number);
}

iraok.age_grade.table_columns.push(iraok.age_grade.columns.total);
iraok.age_grade.table_columns.push(iraok.age_grade.columns.eligible);

iraok.age_grade.populate_years = function () {
  if (!iraok.age_grade.years_group) {
    iraok.age_grade.years_group = document.getElementById(
      "iraok-age-grade-years"
    ).firstElementChild;
    let group = iraok.age_grade.years_group;

    let selected_year = iraok.age_grade.info[0].Year;
    let select = document.createElement("select");
    for (let i = 0; i < iraok.age_grade.years.length; i++) {
      let year = iraok.age_grade.years[i];
      let option = document.createElement("option");
      select.appendChild(option);
      option.value = year;
      option.innerText = year;
      if (selected_year == year) option.setAttribute("selected", "");
    }

    iraok.age_grade.years_group.appendChild(select);
    select.onchange = function () {
      window.location.href = "/age-grade-scoring/" + this.value + "/";
    };

    group.appendChild(select);
  }
};

iraok.age_grade.populate_gens = function (filters) {
  if (!iraok.age_grade.gen) {
    iraok.age_grade.gen = document.getElementById(
      "iraok-age-grade-gen"
    ).firstElementChild;
    let group = iraok.age_grade.gen;
    let div = document.createElement("div");

    let female = iraok.age_grade.get_input_radio(
      "iraok_gen_female",
      "iraok_gen",
      "F",
      "Female",
      "female",
      filters.gen == "F",
      function () {
        iraok.age_grade.set_filter_gen("F");
        iraok.age_grade.filter();
      }
    );
    let male = iraok.age_grade.get_input_radio(
      "iraok_gen_male",
      "iraok_gen",
      "M",
      "Male",
      "male",
      filters.gen == "M",
      function () {
        iraok.age_grade.set_filter_gen("M");
        iraok.age_grade.filter();
      }
    );

    div.appendChild(female);
    div.appendChild(male);
    group.appendChild(div);
  }
};

iraok.age_grade.set_table_caption = function () {
  let info =
    iraok.age_grade.filter_type == "road"
      ? iraok.age_grade.road
      : iraok.age_grade.cross;

  let txt = info.MaxRaces
    ? "Max " + info.MaxRaces + " races | Min " + info.MinRaces + " races | " + (iraok.age_grade.info[0].Year >= 2025 ? "Age Grade %" : "Age Grade Place")
    : "No races this year";

  if (iraok.age_grade.table_caption)
    iraok.age_grade.table_caption.innerText = txt;
};

iraok.age_grade.populate_type = function (filters) {
  if (!iraok.age_grade.type) {
    iraok.age_grade.type = document.getElementById(
      "iraok-age-grade-type"
    ).firstElementChild;
    let group = iraok.age_grade.type;
    let div = document.createElement("div");

    let road = iraok.age_grade.get_input_radio(
      "iraok_type_road",
      "iraok_type",
      "road",
      "Road",
      "directions_run",
      filters.type == "road",
      function () {
        iraok.age_grade.set_filter_type("road");
        iraok.age_grade.filter();
      }
    );
    let cross = iraok.age_grade.get_input_radio(
      "iraok_type_cross",
      "iraok_type",
      "cross",
      "Trail",
      "landscape",
      filters.type == "cross",
      function () {
        iraok.age_grade.set_filter_type("cross");
        iraok.age_grade.filter();
      }
    );

    div.appendChild(road);
    div.appendChild(cross);
    group.appendChild(div);
  }
};

iraok.age_grade.get_input_radio = function (
  id,
  name,
  value,
  labelVal,
  icon,
  checked,
  onchange
) {
  let div = document.createElement("div");
  let input = document.createElement("input");
  input.id = id;
  input.type = "radio";
  input.name = name;
  input.value = value;
  input.checked = checked;
  input.onchange = onchange;

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

iraok.age_grade.populate_table = function () {
  let filters = iraok.age_grade.filter();
  iraok.age_grade.populate_years();
  iraok.age_grade.populate_gens(filters);
  iraok.age_grade.populate_type(filters);

  if (!iraok.age_grade.figure)
    iraok.age_grade.figure = document.getElementById("iraok-age-grade-table");
  if (iraok.age_grade.figure)
    iraok.age_grade.table = iraok.age_grade.figure.firstElementChild;

  if (iraok.age_grade.results && iraok.age_grade.results.length > 0)
    iraok.clear_table(iraok.age_grade.table);

  if (iraok.age_grade.table && !iraok.age_grade.table_caption) {
    iraok.age_grade.table_caption = document.createElement("caption");
    iraok.age_grade.table.appendChild(iraok.age_grade.table_caption);
    iraok.age_grade.set_table_caption();
  }

  if (iraok.age_grade.results && iraok.age_grade.results.length > 0) {
    iraok.set_table(
      iraok.age_grade.table,
      iraok.age_grade.table_columns,
      iraok.age_grade.results_flattened,
      null,
      [iraok.age_grade.figure, iraok.age_grade.age_group],
      function (tr, row) {
        tr.setAttribute("data-gen", row.IsMale == 1 ? "M" : "F");
        tr.setAttribute("data-type", row.IsRoad == 1 ? "road" : "cross");
      }
    );
    iraok.age_grade.update_headers();
  }
};

iraok.age_grade.set_filter_gen = function (gen) {
  iraok.age_grade.filter_gen = gen;
  iraok.set_cookie("gen", gen, 30);
  iraok.age_grade.set_table_caption();
};

iraok.age_grade.set_filter_type = function (type) {
  iraok.age_grade.filter_type = type;
  iraok.set_cookie("type", type, 30);
  iraok.age_grade.set_table_caption();
};

iraok.age_grade.filter = function () {
  if (!iraok.age_grade.filter_gen)
    iraok.age_grade.filter_gen = iraok.get_cookie("gen");

  if (!iraok.age_grade.filter_gen) iraok.age_grade.filter_gen = "F";

  if (!iraok.age_grade.filter_type)
    iraok.age_grade.filter_type = iraok.get_cookie("type");

  if (!iraok.age_grade.filter_type) iraok.age_grade.filter_type = "road";

  let gen = iraok.age_grade.filter_gen;
  let type = iraok.age_grade.filter_type;

  if (iraok.age_grade.style) iraok.age_grade.style.remove();

  iraok.age_grade.style = document.createElement("style");
  let text_content = "";
  text_content =
    "#iraok-age-grade-table > table > tbody > tr[data-gen] { display: none; } ";

  text_content +=
    '#iraok-age-grade-table > table > tbody > tr[data-gen="' +
    gen +
    '"][data-type="' +
    type +
    '"] { display: table-row; } ';

  let valid_numbers =
    type == "road"
      ? iraok.age_grade.road_numbers
      : iraok.age_grade.cross_numbers;

  for (let i = 1; i <= 13; i++) {
    if (valid_numbers.has(i)) continue;

    let num = "n" + i;

    text_content +=
      '#iraok-age-grade-table > table > tbody > tr > td[data-column="' +
      num +
      '"],  #iraok-age-grade-table > table > thead > tr > th[data-column="' +
      num +
      '"] { display: none; } ';
  }
  iraok.age_grade.style.textContent = text_content;
  document.head.appendChild(iraok.age_grade.style);

  iraok.age_grade.update_headers();

  return {
    gen: gen,
    type: type,
  };
};

iraok.age_grade.update_headers = function () {
  let info =
    iraok.age_grade.filter_type == "road"
      ? iraok.age_grade.road.Numbers
      : iraok.age_grade.cross.Numbers;

  for (
    let i = 0;
    iraok.age_grade.table_headers && i < iraok.age_grade.table_headers.length;
    i++
  ) {
    let header = iraok.age_grade.table_headers[i];
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
          iraok.age_grade.info[0].Year +
          "/" +
          x.UrlName +
          "/" +
          (iraok.age_grade.filter_gen ? "#A" + iraok.age_grade.filter_gen : "");
        a.innerText = header.num;
        th.appendChild(a);
      } else {
        th.innerText = header.num;
      }
    }
  }
};
