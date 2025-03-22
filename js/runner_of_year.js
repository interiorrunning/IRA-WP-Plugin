iraok.runner_of_year.years = JSON.parse(iraok.runner_of_year.info[0].Years);
iraok.runner_of_year.info[0].MaxRaces;

iraok.runner_of_year.columns = {};

iraok.runner_of_year.columns.name = {
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

iraok.runner_of_year.columns.city = {
  header: "City",
  data_column: "City",
  getContent: function (row) {
    return iraok.create_text(row[this.data_column], null, this.data_column);
  },
};

iraok.runner_of_year.columns.age_group = {
  header: "Div",
  data_column: "AgeGroup",
  getContent: function (row) {
    return iraok.create_text(row[this.data_column], null, this.data_column);
  },
};

iraok.runner_of_year.columns.finishes = {
  header: "Best",
  data_column: "Finishes",
  getContent: function (row) {
    let finishes = JSON.parse(row.Finishes).reduce(function (x, y) { return x + ", " + y; });
    let td = document.createElement("td");
    let code = document.createElement("code");
    code.innerText = finishes
    td.appendChild(code);
    td.setAttribute("data-column", this.data_column);
    return td;
  },
};

iraok.runner_of_year.columns.average = {
  header: "Avg",
  data_column: "Average",
  getContent: function (row) {
    console.log(row.Finishes);
    let finishes = JSON.parse(row.Finishes);
    let total = finishes.reduce(function (x, y) { return x + y; });
    let avg = total / finishes.length;

    return iraok.create_text(avg.toFixed(2), avg, this.data_column);
  },
};

iraok.runner_of_year.table_columns = [];
iraok.runner_of_year.table_columns.push(iraok.runner_of_year.columns.name);
iraok.runner_of_year.table_columns.push(iraok.runner_of_year.columns.city);
iraok.runner_of_year.table_columns.push(iraok.runner_of_year.columns.age_group);
iraok.runner_of_year.table_columns.push(iraok.runner_of_year.columns.finishes);
iraok.runner_of_year.table_columns.push(iraok.runner_of_year.columns.average);

iraok.runner_of_year.populate_years = function () {
  if (!iraok.runner_of_year.years_group) {
    iraok.runner_of_year.years_group = document.getElementById(
      "iraok-runner-of-year-years"
    ).firstElementChild;
    let group = iraok.runner_of_year.years_group;

    let selected_year = iraok.runner_of_year.info[0].Year;
    let select = document.createElement("select");
    for (let i = 0; i < iraok.runner_of_year.years.length; i++) {
      let year = iraok.runner_of_year.years[i];
      let option = document.createElement("option");
      select.appendChild(option);
      option.value = year;
      option.innerText = year;
      if (selected_year == year) option.setAttribute("selected", "");
    }

    iraok.runner_of_year.years_group.appendChild(select);
    select.onchange = function () {
      window.location.href = "/runner-of-year/" + this.value + "/";
    };

    group.appendChild(select);
  }
};

iraok.runner_of_year.populate_gens = function (filters) {
  if (!iraok.runner_of_year.gen) {
    iraok.runner_of_year.gen = document.getElementById(
      "iraok-runner-of-year-gen"
    ).firstElementChild;
    let group = iraok.runner_of_year.gen;
    let div = document.createElement("div");

    let female = iraok.runner_of_year.get_input_radio(
      "iraok_gen_female",
      "iraok_gen",
      "F",
      "Female",
      "female",
      filters.gen == "F",
      function () {
        iraok.runner_of_year.set_filter_gen("F");
        iraok.runner_of_year.filter();
      }
    );
    let male = iraok.runner_of_year.get_input_radio(
      "iraok_gen_male",
      "iraok_gen",
      "M",
      "Male",
      "male",
      filters.gen == "M",
      function () {
        iraok.runner_of_year.set_filter_gen("M");
        iraok.runner_of_year.filter();
      }
    );

    div.appendChild(female);
    div.appendChild(male);
    group.appendChild(div);
  }
};

iraok.runner_of_year.set_table_caption = function () {

  let selected_year = iraok.runner_of_year.info[0].Year
  let txt = selected_year < 2025 ? "Runner of the Year was awarded by vote prior to 2025" : ("Best " + iraok.runner_of_year.info[0].MaxRaces + " finishes is awarded Runner of Year");

  if (iraok.runner_of_year.table_caption)
    iraok.runner_of_year.table_caption.innerText = txt;
};

iraok.runner_of_year.get_input_radio = function (
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

iraok.runner_of_year.populate_table = function () {
  let filters = iraok.runner_of_year.filter();
  iraok.runner_of_year.populate_years();
  iraok.runner_of_year.populate_gens(filters);

  if (!iraok.runner_of_year.figure)
    iraok.runner_of_year.figure = document.getElementById("iraok-runner-of-year-table");
  if (iraok.runner_of_year.figure)
    iraok.runner_of_year.table = iraok.runner_of_year.figure.firstElementChild;

  if (iraok.runner_of_year.results && iraok.runner_of_year.results.length > 0)
    iraok.clear_table(iraok.runner_of_year.table);

  if (iraok.runner_of_year.table && !iraok.runner_of_year.table_caption) {
    iraok.runner_of_year.table_caption = document.createElement("caption");
    iraok.runner_of_year.table.appendChild(iraok.runner_of_year.table_caption);
    iraok.runner_of_year.set_table_caption();
  }

  if (iraok.runner_of_year.results && iraok.runner_of_year.results.length > 0) {
    iraok.set_table(
      iraok.runner_of_year.table,
      iraok.runner_of_year.table_columns,
      iraok.runner_of_year.results,
      null,
      [iraok.runner_of_year.figure, iraok.runner_of_year.age_group],
      function (tr, row) {
        tr.setAttribute("data-gen", row.IsFemale == 1 ? "F" : "M");
      }
    );
  }
};

iraok.runner_of_year.set_filter_gen = function (gen) {
  iraok.runner_of_year.filter_gen = gen;
  iraok.set_cookie("gen", gen, 30);
  iraok.runner_of_year.set_table_caption();
};

iraok.runner_of_year.filter = function () {
  if (!iraok.runner_of_year.filter_gen)
    iraok.runner_of_year.filter_gen = iraok.get_cookie("gen");

  if (!iraok.runner_of_year.filter_gen) iraok.runner_of_year.filter_gen = "F";

  let gen = iraok.runner_of_year.filter_gen;

  if (iraok.runner_of_year.style) iraok.runner_of_year.style.remove();

  iraok.runner_of_year.style = document.createElement("style");
  let text_content = "";
  text_content =
    "#iraok-runner-of-year-table > table > tbody > tr[data-gen] { display: none; } ";

  text_content +=
    '#iraok-runner-of-year-table > table > tbody > tr[data-gen="' +
    gen +
    '"] { display: table-row; } ';


  iraok.runner_of_year.style.textContent = text_content;
  document.head.appendChild(iraok.runner_of_year.style);

  return {
    gen: gen,
  };
};