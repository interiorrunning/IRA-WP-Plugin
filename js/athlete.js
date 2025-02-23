iraok.athlete.columns = {};

iraok.athlete.columns.date = {
  header: "Date",
  data_column: "date",
  getContent: function (row) {
    return iraok.create_text(row.rd, null, this.data_column);
  },
};

iraok.athlete.columns.race_name = {
  header: "Race",
  data_column: "race",
  getContent: function (row) {
    let td = document.createElement("td");
    let a = document.createElement("a");
    a.href = "/race/" + new Date(row.rd).getFullYear() + "/" + row.un + "/";
    a.innerText = row.rn;
    td.appendChild(a);
    td.setAttribute("data-column", this.data_column);
    return td;
  },
};

iraok.athlete.columns.race_city = {
  header: "City",
  data_column: "city",
  getContent: function (row) {
    return iraok.create_text(row.rc, null, this.data_column);
  },
};

iraok.athlete.columns.div = {
  header: "Div",
  data_column: "div",
  title: "Age Group",
  getContent: function (row) {
    let td = document.createElement("td");
    let a = document.createElement("a");
    let division = row.di;
    if (division === "O00-99+") division = "";
    if (division === "F00-99+") division = "Female";
    if (division === "M00-99+") division = "Male";
    td.innerText = division;
    td.setAttribute("data-column", this.data_column);
    return td;
  },
};

iraok.athlete.columns.time = {
  header: "Time",
  data_column: "time",
  getContent: function (row) {
    return iraok.create_text(row.t1, null, this.data_column);
  },
};

iraok.athlete.columns.pace = {
  header: "Pace",
  data_column: "pace",
  title: "min/km",
  getContent: function (row) {
    return iraok.create_text(row.pa, null, this.data_column);
  },
};

iraok.athlete.columns.age_grade = {
  header: "AG %",
  data_column: "ag",
  title: "Age Graded %",
  getContent: function (row) {
    return iraok.create_text(
      (Math.round(row.ag * 10000) / 100).toFixed(2) + "%",
      row.ag * 100,
      this.data_column
    );
  },
};

iraok.athlete.columns.award = {
  header: "",
  data_column: "award",
  getContent: function (row) {
    let td = document.createElement("td");

    td = iraok.get_award_icons(
      td,
      row.icr,
      row.iag,
      row.idi,
      row.gp,
      row.ap,
      row.cp,
      row.di
    );

    td.setAttribute("data-column", this.data_column);

    return td;
  },
  get_header: function () {
    let th = document.createElement("th");
    th.setAttribute("data-column", this.data_column);

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

iraok.athlete.columns.award_name = {
  header: "Award",
  data_column: "award_name",
  getContent: function (row) {
    return iraok.create_text(
      row.Award + (row.Subtitle ? " - " + row.Subtitle : ""),
      row.Description,
      this.data_column
    );
  },
};

iraok.athlete.columns.award_years = {
  header: "Year",
  data_column: "award_years",
  getContent: function (row) {
    let results = JSON.parse(row.Years).sort();
    let years = [];
    let start = null;
    let end = null;
    let prev = null;

    for (let i = 0; i < results.length; i++) {
      let year = results[i];

      if (!prev) {
        start = year;
      } else if (year != prev + 1 && start != end) {
        years.push(start + "-" + end);
        start = year;
      } else if (year != prev + 1 && start == end) {
        years.push(prev);
        start = year;
      }

      prev = year;
      end = year;
    }

    if (start != end) years.push(start + "-" + end);
    else years.push(start);

    return iraok.create_text(
      years.join(", "),
      "Awarded " + results.length + " time" + (results.length > 1 ? "s" : ""),
      this.data_column
    );
  },
};

iraok.athlete.overall_columns = [];
iraok.athlete.overall_columns.push(iraok.athlete.columns.date);
iraok.athlete.overall_columns.push(iraok.athlete.columns.race_name);
iraok.athlete.overall_columns.push(iraok.athlete.columns.race_city);
iraok.athlete.overall_columns.push(iraok.athlete.columns.div);
iraok.athlete.overall_columns.push(iraok.athlete.columns.time);
iraok.athlete.overall_columns.push(iraok.athlete.columns.pace);
iraok.athlete.overall_columns.push(iraok.athlete.columns.age_grade);
iraok.athlete.overall_columns.push(iraok.athlete.columns.award);

iraok.athlete.awards_columns = [];
iraok.athlete.awards_columns.push(iraok.athlete.columns.award_name);
iraok.athlete.awards_columns.push(iraok.athlete.columns.award_years);

iraok.athlete.populate_table = function () {
  if (!iraok.athlete.figure)
    iraok.athlete.figure = document.getElementById("iraok-athlete-table");
  if (iraok.athlete.figure)
    iraok.athlete.table = iraok.athlete.figure.firstElementChild;

  if (!iraok.athlete.figure_awards)
    iraok.athlete.figure_awards = document.getElementById(
      "iraok-athlete-awards"
    );
  if (iraok.athlete.figure_awards)
    iraok.athlete.table_awards = iraok.athlete.figure_awards.firstElementChild;

  if (
    !iraok.athlete.table_heading &&
    iraok.athlete.results &&
    iraok.athlete.results.length > 0
  )
    iraok.athlete.table_heading = document.getElementById(
      "iraok-athlete-table-heading"
    );

  if (
    !iraok.athlete.table_awards_heading &&
    iraok.athlete.awards &&
    iraok.athlete.awards.length > 0
  )
    iraok.athlete.table_awards_heading = document.getElementById(
      "iraok-athlete-awards-heading"
    );

  if (iraok.athlete.results && iraok.athlete.results.length > 0)
    iraok.clear_table(iraok.athlete.table);

  if (iraok.athlete.awards && iraok.athlete.awards.length > 0)
    iraok.clear_table(iraok.athlete.table_awards);

  if (iraok.athlete.results && iraok.athlete.results.length > 0)
    iraok.set_table(
      iraok.athlete.table,
      iraok.athlete.overall_columns,
      iraok.athlete.results,
      function () {
        let texts = [];
        if (
          iraok.athlete.info &&
          iraok.athlete.info.length > 0 &&
          iraok.athlete.info[0].City
        )
          texts.push(iraok.athlete.info[0].City);

        let results = iraok.athlete.results.filter((r) => r.is == 1);
        let awards = results.filter(
          (r) => r.gp <= 3 || r.cp <= 3 || r.cr >= 1 || r.ap <= 3
        );
        let svgs = [];
        if (results.length > 0)
          texts.push(
            results.length + " race" + (results.length == 1 ? "" : "s")
          );

        let text = texts.join(" | ");
        if (awards.length > 0) {
          text += " | ";
          svgs.push(document.createTextNode("\u00A0"));
          let srs = [
            ...new Set(awards.filter((a) => a.icr == 1).map((a) => 1)),
            ...new Set(awards.filter((a) => a.iag == 1).map((a) => 2)),
            ...new Set(awards.filter((a) => a.idi == 1).map((a) => 3)),
          ].sort();
          let gps = [
            ...new Set(awards.filter((a) => a.gp <= 3).map((a) => a.gp)),
          ].sort();
          let aps = [
            ...new Set(awards.filter((a) => a.ap <= 3).map((a) => a.ap)),
          ].sort();
          let cps = [...new Set(awards.map((a) => a.cp))].sort();

          for (let i = 0; i < srs.length; i++) {
            let sr = srs[i];
            let icon;
            if (sr == 1) icon = iraok.get_trophy(0);
            else if (sr == 2) icon = iraok.get_age_grade_record(0);
            else if (sr == 3) icon = iraok.get_medal(0);
            console.log(icon);
            svgs.push(icon);
          }
          for (let i = 0; i < gps.length && i < 1; i++)
            svgs.push(iraok.get_trophy(gps[i]));
          for (let i = 0; i < aps.length && i < 1; i++)
            svgs.push(iraok.get_age_grade_record(aps[i]));
          for (let i = 0; i < cps.length && i < 1; i++)
            svgs.push(iraok.get_medal(cps[i]));
        }
        svgs.unshift(text);
        return svgs;
      },
      [iraok.athlete.figure, iraok.athlete.table_heading]
    );

  if (iraok.athlete.awards && iraok.athlete.awards.length > 0)
    iraok.set_table(
      iraok.athlete.table_awards,
      iraok.athlete.awards_columns,
      iraok.athlete.awards,
      null,
      [iraok.athlete.figure_awards, iraok.athlete.table_awards_heading]
    );
};
