iraok.race.gen_filter = "";
iraok.race.div_filter = "";
iraok.race.hash = "";

iraok.race.is_age_graded = 0;
iraok.race.info = iraok.race.info[0];

iraok.race.is_div_filtered = function () {
  return iraok.race.div_filter === "" ? 0 : 1;
};

iraok.race.is_gen_filtered = function () {
  return iraok.race.gen_filter === "" ? 0 : 1;
};

iraok.race.tbody_cache = {};
iraok.race.thead_cache = {};
iraok.race.buttons_cache = {};
iraok.race.caption_cache = {};

iraok.race.results_age_graded = iraok.race.results.slice(0);
iraok.race.results_age_graded.sort(function (x1, x2) {
  if (x1.t2 < x2.t2) return -1;
  if (x1.t2 > x2.t2) return 1;
  return 0;
});

iraok.race.update_placements = function (results, gp, cp, op) {
  let cnt = {};
  for (let i = 0; i < results.length; i++) {
    let res = results[i];
    let g = Array.from(res.di)[0];
    let div = res.di;
    if (!cnt[g]) cnt[g] = 1;
    else cnt[g]++;

    if (!cnt[div]) cnt[div] = 1;
    else cnt[div]++;

    if (op) res[op] = i + 1;
    res[gp] = cnt[g];
    res[cp] = cnt[div];
  }
};

iraok.race.update_placements(iraok.race.results, "gp", "cp");
iraok.race.update_placements(
  iraok.race.results_age_graded,
  "agp",
  "acp",
  "apl"
);

iraok.race.columns = {};
iraok.race.columns.finish = {
  header: "",
  data_column: "finish",
  getContent: function (row) {
    if (iraok.race.is_div_filtered() == 1) f = "cp";
    else if (iraok.race.is_gen_filtered() == 1) f = "gp";
    else f = "pl";
    f = (iraok.race.is_age_graded === 1 ? "a" : "") + f;

    return iraok.create_text(
      row[f],
      null,
      this.data_column + (iraok.race.is_age_graded == 1 ? "-ag" : "")
    );
  },
};
iraok.race.columns.name = {
  header: "Name",
  data_column: "name",
  getContent: function (row) {
    let td = document.createElement("td");
    let a = document.createElement("a");
    a.href = "/athlete/" + row.un + "/";
    a.innerText = row.na;
    td.appendChild(a);
    td.setAttribute(
      "data-column",
      this.data_column + (iraok.race.is_age_graded == 1 ? "-ag" : "")
    );
    return td;
  },
};
iraok.race.columns.city = {
  header: "City",
  data_column: "city",
  getContent: function (row) {
    return iraok.create_text(
      row.ci,
      null,
      this.data_column + (iraok.race.is_age_graded == 1 ? "-ag" : "")
    );
  },
};
iraok.race.columns.div = {
  header: "Div",
  title: "Age Group",
  data_column: "div",
  getContent: function (row) {
    let td = document.createElement("td");
    let a = document.createElement("a");
    let division = row.di;
    if (division === "O00-99+") division = "";
    if (division === "F00-99+") division = "Female";
    if (division === "M00-99+") division = "Male";
    a.innerText = division;
    let href = iraok.race.get_filter_href(row.di);

    a.href = href;
    td.onclick = function () {
      iraok.race.populate_table_and_button_group(href);
    };
    td.setAttribute(
      "data-column",
      this.data_column + (iraok.race.is_age_graded == 1 ? "-ag" : "")
    );

    td.appendChild(a);
    return td;
  },
};
iraok.race.columns.time = {
  header: "Time",
  data_column: "time",
  getContent: function (row) {
    return iraok.create_text(
      row.t1,
      null,
      this.data_column + (iraok.race.is_age_graded == 1 ? "-ag" : "")
    );
  },
};

iraok.race.columns.chip = {
  header: "Chip",
  data_column: "chip",
  getContent: function (row) {
    return iraok.create_text(
      row.ct,
      null,
      this.data_column + (iraok.race.is_age_graded == 1 ? "-ag" : "")
    );
  },
};

iraok.race.columns.pace = {
  header: "Pace",
  title: "min/km",
  data_column: "pace",
  getContent: function (row) {
    return iraok.create_text(
      row.pa,
      null,
      this.data_column + (iraok.race.is_age_graded == 1 ? "-ag" : "")
    );
  },
};
iraok.race.columns.award = {
  header: "",
  data_column: "award",
  getContent: function (row) {
    let td = document.createElement("td");
    td.setAttribute(
      "data-column",
      this.data_column + (iraok.race.is_age_graded == 1 ? "-ag" : "")
    );

    if (iraok.race.info.IsOutOfSeries == 0)
      td = iraok.get_award_icons(
        td,
        row.crg,
        row.cra,
        row.crc,
        row.gp,
        row.agp,
        row.cp,
        row.di
      );

    return td;
  },
  get_header: function () {
    let th = document.createElement("th");
    th.setAttribute(
      "data-column",
      this.data_column + (iraok.race.is_age_graded == 1 ? "-ag" : "")
    );

    let a = document.createElement("a");
    a.href = "/award-icons/";

    let span = document.createElement("span");
    span.className = "material-symbols-outlined";
    span.innerText = "info";

    th.appendChild(a);
    a.appendChild(span);

    return th;
  },
};
iraok.race.columns.adj_time = {
  header: "Age Adj",
  title: "Age Adjusted Time",
  data_column: "age_adj",
  getContent: function (row) {
    return iraok.create_text(
      row.t2,
      null,
      this.data_column + (iraok.race.is_age_graded == 1 ? "-ag" : "")
    );
  },
};
iraok.race.columns.age_grade = {
  header: "AG %",
  title: "Age Graded %",
  data_column: "ag",
  getContent: function (row) {
    return iraok.create_text(
      (Math.round(row.ag * 10000) / 100).toFixed(2) + "%",
      row.ag * 100,
      this.data_column + (iraok.race.is_age_graded == 1 ? "-ag" : "")
    );
  },
};

iraok.race.get_filter_href = function (filter) {
  if (filter === iraok.race.gen_filter || filter === iraok.race.div_filter)
    return iraok.race.get_hash(
      iraok.race.is_age_graded,
      filter === "" ? "F" : filter === "F" ? "M" : ""
    );
  else return iraok.race.get_hash(iraok.race.is_age_graded, filter);
};

iraok.race.get_hash = function (is_age_graded, filter) {
  let hash = "#";
  if (is_age_graded === 1) hash = hash + "A";
  if (filter) hash = hash + filter;

  return hash;
};

iraok.race.overall_columns = [];
iraok.race.overall_columns.push(iraok.race.columns.finish);
iraok.race.overall_columns.push(iraok.race.columns.name);
iraok.race.overall_columns.push(iraok.race.columns.city);
iraok.race.overall_columns.push(iraok.race.columns.div);
if (iraok.race.info.StartDelay == 1)
  iraok.race.overall_columns.push(iraok.race.columns.chip);
iraok.race.overall_columns.push(iraok.race.columns.time);
iraok.race.overall_columns.push(iraok.race.columns.pace);
iraok.race.overall_columns.push(iraok.race.columns.age_grade);
iraok.race.overall_columns.push(iraok.race.columns.award);

iraok.race.age_graded_columns = [];
iraok.race.age_graded_columns.push(iraok.race.columns.finish);
iraok.race.age_graded_columns.push(iraok.race.columns.name);
iraok.race.age_graded_columns.push(iraok.race.columns.city);
iraok.race.age_graded_columns.push(iraok.race.columns.div);
if (iraok.race.info.StartDelay == 1)
  iraok.race.age_graded_columns.push(iraok.race.columns.chip);
iraok.race.age_graded_columns.push(iraok.race.columns.time);
iraok.race.age_graded_columns.push(iraok.race.columns.adj_time);
iraok.race.age_graded_columns.push(iraok.race.columns.age_grade);
iraok.race.age_graded_columns.push(iraok.race.columns.award);

iraok.race.get_rows = function () {
  let rows;
  let results =
    iraok.race.is_age_graded === 0
      ? iraok.race.results
      : iraok.race.results_age_graded;
  if (iraok.race.is_div_filtered() === 1) {
    rows = results.filter((r) => r.di === iraok.race.div_filter);
  } else if (iraok.race.is_gen_filtered() === 1) {
    rows = results.filter((r) => Array.from(r.di)[0] === iraok.race.gen_filter);
  } else {
    rows = results;
  }
  return rows;
};

iraok.race.create_button = function (text, hash) {
  let div = document.createElement("div");
  div.className = "wp-block-button";

  let a = document.createElement("a");
  a.className = "wp-block-button__link wp-element-button";
  a.href = hash;
  a.innerText = text + String.fromCharCode(160).repeat(2);

  let button_type = "close";

  let span = document.createElement("span");
  span.className = "material-symbols-outlined";
  span.innerText = button_type;
  a.appendChild(span);

  div.appendChild(a);
  div.onclick = function () {
    iraok.race.populate_table_and_button_group(hash);
  };
  return div;
};

iraok.race.set_column_headers = function (cols) {
  let thead;
  if (iraok.race.thead_cache[iraok.race.is_age_graded]) {
    thead = iraok.race.thead_cache[iraok.race.is_age_graded];
  } else {
    thead = document.createElement("thead");
    iraok.race.thead_cache[iraok.race.is_age_graded] = thead;

    let tr = document.createElement("tr");
    for (let i = 0; i < cols.length; i++) {
      let col = cols[i];
      let th = col.get_header
        ? col.get_header()
        : iraok.create_header(
          col.header,
          col.title,
          col.data_column + (iraok.race.is_age_graded == 1 ? "-ag" : "")
        );
      tr.appendChild(th);
    }
    thead.appendChild(tr);
  }
  if (iraok.race.table) iraok.race.table.appendChild(thead);
};

iraok.race.set_table_rows = function (cols) {
  let hash = iraok.race.hash;
  let tbody;
  if (iraok.race.tbody_cache[hash]) {
    tbody = iraok.race.tbody_cache[hash];
  } else {
    tbody = document.createElement("tbody");
    iraok.race.tbody_cache[hash] = tbody;

    let rows = iraok.race.get_rows();

    for (let r = 0; r < rows.length; r++) {
      let tr = document.createElement("tr");
      for (let i = 0; i < cols.length; i++) {
        tr.appendChild(cols[i].getContent(rows[r]));
      }
      tbody.appendChild(tr);
    }
  }

  if (iraok.race.table) iraok.race.table.appendChild(tbody);
};

iraok.race.set_table_caption = function () {
  let caption;
  let hash = iraok.race.hash;
  if (iraok.race.caption_cache[hash]) {
    caption = iraok.race.caption_cache[hash];
  } else {
    caption = document.createElement("caption");
    let info = iraok.race.info;
    let rows = iraok.race.get_rows();

    let finisher_type = iraok.race.div_filter + iraok.race.gen_filter;
    if (finisher_type === "M") finisher_type = "male participant";
    else if (finisher_type === "F") finisher_type = "female participant";
    else if (finisher_type === "O") finisher_type = "participant";
    else if (!finisher_type) finisher_type = "participant";
    else finisher_type += " participant";

    let sep = " | ";
    let text =
      info.Date +
      sep +
      info.City +
      sep +
      rows.length +
      " " +
      finisher_type +
      (rows.length != 1 ? "s" : "");
    caption.innerText = text;

    iraok.race.caption_cache[hash] = caption;
  }

  if (iraok.race.table) iraok.race.table.appendChild(caption);
};

iraok.race.set_page_header = function () {
  if (iraok.race.year_type_number)
    iraok.race.year_type_number.innerText =
      iraok.race.info.Year +
      (iraok.race.info.IsRoad == 1 ? " Road Race" : " Trail") +
      (iraok.race.info.IsOutOfSeries == 0 ? " #" + iraok.race.info.Number : "");
};

iraok.race.populate_races = function () {
  let info = iraok.race.info;
  if (!iraok.race.races && info.UrlName2) {
    iraok.race.races = document.getElementById(
      "iraok-race-races"
    ).firstElementChild;
    let group = iraok.race.races;
    let div = document.createElement("div");


    let float1 = parseFloat(info.Distance);
    let float2 = parseFloat(info.Distance2);

    let dis1 = parseFloat(float1.toFixed(1)) +
      (info.IsMiles == 1 ? " mile" + (info.Distance > 1 ? "s" : "") : " km")

    let dis2 = parseFloat(float2.toFixed(1)) +
      (info.IsMiles2 == 1 ? " mile" + (info.Distance2 > 1 ? "s" : "") : " km")

    let race1 = iraok.get_input_radio(
      "iraok_races_race1",
      "iraok_races",
      "race1",
      dis1,
      float1 > float2 ? "verified" : "directions_run",
      1,
      function () {

      }
    );
    let race2 = iraok.get_input_radio(
      "iraok_races_race2",
      "iraok_races",
      "race2",
      dis2,
      float1 > float2 ? "directions_run" : "verified",
      0,
      function () {
        window.location = "/race/" + info.Year + "/" + info.UrlName2 + "/";
      }
    );

    if (float1 > float2) {
      div.appendChild(race1);
      div.appendChild(race2);
    } else {
      div.appendChild(race2);
      div.appendChild(race1);
    }
    group.appendChild(div);
  }
};

iraok.race.populate_type = function () {
  if (!iraok.race.type) {
    iraok.race.type = document.getElementById(
      "iraok-race-type"
    ).firstElementChild;
    let group = iraok.race.type;
    let div = document.createElement("div");

    let overall = iraok.get_input_radio(
      "iraok_type_overall",
      "iraok_type",
      "Overall",
      "Overall",
      "trophy",
      iraok.race.is_age_graded === 0,
      function () {
        let combined_filter = iraok.race.div_filter + iraok.race.gen_filter;
        let hash = iraok.race.get_hash(0, combined_filter);
        window.location.hash = hash;
        iraok.race.populate_table_and_button_group(hash);
      }
    );
    let age_graded = iraok.get_input_radio(
      "iraok_type_age_graded",
      "iraok_type",
      "Age Graded",
      "Age Graded",
      "award_star",
      iraok.race.is_age_graded === 1,
      function () {
        let combined_filter = iraok.race.div_filter + iraok.race.gen_filter;
        let hash = iraok.race.get_hash(1, combined_filter);
        window.location.hash = hash;
        iraok.race.populate_table_and_button_group(hash);
      }
    );

    div.appendChild(overall);
    div.appendChild(age_graded);
    group.appendChild(div);
  }
};

iraok.race.populate_gen = function () {
  if (!iraok.race.gen) {
    iraok.race.gen = document.getElementById(
      "iraok-race-gen"
    ).firstElementChild;
    let group = iraok.race.gen;
    let div = document.createElement("div");

    iraok.race.gen_female = iraok.get_input_checkbox(
      "iraok_gen_female",
      "iraok_gen",
      "F",
      "Female",
      "female",
      iraok.race.gen_filter === "F",
      function () {
        let hash = iraok.race.get_hash(iraok.race.is_age_graded, iraok.race.get_gender_filter());
        window.location.hash = hash;
        iraok.race.populate_table_and_button_group(hash);
      }
    );
    iraok.race.gen_male = iraok.get_input_checkbox(
      "iraok_gen_male",
      "iraok_gen",
      "M",
      "Male",
      "male",
      iraok.race.gen_filter === "M",
      function () {
        let hash = iraok.race.get_hash(iraok.race.is_age_graded, iraok.race.get_gender_filter());
        window.location.hash = hash;
        iraok.race.populate_table_and_button_group(hash);
      }
    );

    div.appendChild(iraok.race.gen_female);
    div.appendChild(iraok.race.gen_male);
    group.appendChild(div);
  }
};

iraok.race.get_gender_filter = function () {
  if (!iraok.race.gen_male || !iraok.race.gen_female) return "";

  let male = iraok.race.gen_male.children[1].checked;
  let female = iraok.race.gen_female.children[1].checked;

  if (male && female) return "";
  if (!male && !female) return "";
  if (male) return "M";
  return "F";
};

iraok.race.set_button_group = function () {
  iraok.race.populate_races();
  iraok.race.populate_type();
  iraok.race.populate_gen();

  let text = iraok.race.div_filter + iraok.race.gen_filter;
  if (text && text !== "M" && text !== "F") {
    let hash = iraok.race.get_hash(iraok.race.is_age_graded, iraok.race.get_gender_filter());
    let button = iraok.race.create_button(text, hash);
    iraok.race.button_group.appendChild(button);
  }
};

iraok.race.set_hash_filter = function (hash) {
  if (!hash) hash = "";
  if (hash.match(/^#A/)) {
    iraok.race.is_age_graded = 1;
  } else {
    iraok.race.is_age_graded = 0;
  }
  hash = hash.replace("#", "");
  if (hash === "A") {
    iraok.race.gen_filter = "";
    iraok.race.div_filter = "";
  } else if (hash.match(/^[MOF]$/)) {
    iraok.race.gen_filter = hash;
    iraok.race.div_filter = "";
  } else if (hash.match(/^A[MOF]$/)) {
    iraok.race.gen_filter = hash.substring(1);
    iraok.race.div_filter = "";
  } else if (hash.match(/^[MOF][0-9][0-9]-[0-9][0-9]\+*$/)) {
    iraok.race.gen_filter = "";
    iraok.race.div_filter = hash;
  } else if (hash.match(/^A[MOF][0-9][0-9]-[0-9][0-9]\+*$/)) {
    iraok.race.gen_filter = "";
    iraok.race.div_filter = hash.substring(1);
  } else {
    iraok.race.gen_filter = "";
    iraok.race.div_filter = "";
  }
  iraok.race.hash = hash;
};

iraok.race.populate_table_and_button_group = function (hash) {

  iraok.race.set_hash_filter(hash);

  if (!iraok.race.series_columns)
    iraok.race.series_columns = document.getElementById(
      "iraok-race-series-columns"
    );

  if (!iraok.race.series_link)
    iraok.race.series_link = document.getElementById(
      "iraok-race-series-paragraph"
    );

  if (!iraok.race.button_group)
    iraok.race.button_group = document.getElementById(
      "iraok-race-button-group"
    );

  if (!iraok.race.year_type_number)
    iraok.race.year_type_number = document.getElementById(
      "iraok-race-year-type-number"
    );
  if (!iraok.race.figure)
    iraok.race.figure = document.getElementById("iraok-race-table");
  if (iraok.race.figure) iraok.race.table = iraok.race.figure.firstElementChild;

  iraok.clear_table(iraok.race.button_group);
  iraok.clear_table(iraok.race.table);

  iraok.race.set_page_header();
  iraok.race.set_table_caption();

  if (iraok.race.is_age_graded === 0) {
    iraok.race.set_column_headers(iraok.race.overall_columns);
    iraok.race.set_table_rows(iraok.race.overall_columns);
  } else {
    iraok.race.set_column_headers(iraok.race.age_graded_columns);
    iraok.race.set_table_rows(iraok.race.age_graded_columns);
  }

  iraok.race.set_button_group();

  if (iraok.race.year_type_number)
    iraok.race.year_type_number.style.display = "block";
  if (iraok.race.button_group) iraok.race.button_group.style.display = "flex";
  if (iraok.race.figure) iraok.race.figure.style.display = "block";

  if (
    iraok.race.series_columns &&
    iraok.race.series_link &&
    iraok.race.info.SeriesUrlName
  ) {
    iraok.race.series_link.innerHTML = "";
    let a = document.createElement("a");
    a.href = "/series/" + iraok.race.info.SeriesUrlName + "/";
    a.innerText = "Historical Results";

    iraok.race.series_link.appendChild(a);
    iraok.race.series_columns.style.display = "flex";
  }
};
