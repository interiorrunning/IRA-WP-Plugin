if (iraok.series.info && iraok.series.info.length > 0)
  iraok.series.info = iraok.series.info[0];

iraok.series.awards_expanded = [];
iraok.series.awards_prev = "";
iraok.series.awards_grp_cnt = 0;
for (let i = 0; i < iraok.series.awards.length; i++) {
  let row = iraok.series.awards[i];
  let record = row.Record + "-" + row.AgeGroup;
  if (iraok.series.awards_prev != record) {
    row.FirstGroup = 1;

    if (i > 0)
      iraok.series.awards_expanded[
        iraok.series.awards_expanded.length - 1
      ].LastGroup = 1;

    if (iraok.series.awards_grp_cnt % 2 == 0) {
      let arr = iraok.series.awards_prev.split("-");

      iraok.series.awards_expanded.push({
        IsBlank: 1,
        Record: arr.shift(),
        AgeGroup: arr.join("-"),
        rn: 10,
      });
    }

    iraok.series.awards_grp_cnt = 1;
  } else {
    iraok.series.awards_grp_cnt++;
  }

  iraok.series.awards_prev = record;
  iraok.series.awards_expanded.push(row);
}

iraok.series.columns = {};

iraok.series.columns.rn = {
  header: "",
  data_column: "rn",
  getContent: function (row) {
    let td = document.createElement("td");
    if (row.FirstGroup == 1) {
      let span = document.createElement("span");
      span.className = "material-symbols-outlined";
      span.innerText = "expand_circle_down";

      td.appendChild(span);
      td.setAttribute("data-column", this.data_column);
      td.onclick = function () {
        iraok.series.expand_series_awards(
          row.Record + "-" + row.AgeGroup,
          span
        );
        return false;
      };
    }
    return td;
  },
};

iraok.series.columns.record = {
  header: "Record",
  data_column: "Record",
  getContent: function (row) {
    return iraok.create_text(
      row.rn == 1 ? row[this.data_column] : "",
      null,
      this.data_column
    );
  },
};

iraok.series.columns.age_group = {
  header: "Div",
  data_column: "AgeGroup",
  getContent: function (row) {
    return iraok.create_text(
      row.rn == 1 ? row[this.data_column] : "",
      null,
      this.data_column
    );
  },
};

iraok.series.columns.name = {
  header: "Name",
  data_column: "Name",
  getContent: function (row) {
    let td = document.createElement("td");
    if (row.IsBlank != 1) {
      let a = document.createElement("a");
      a.href = "/athlete/" + row.Athlete_UrlName + "/";
      a.innerText = row.Name;
      td.appendChild(a);
      td.setAttribute("data-column", this.data_column);
    }
    return td;
  },
};

iraok.series.columns.city = {
  header: "City",
  data_column: "City",
  getContent: function (row) {
    return iraok.create_text(row.City, null, this.data_column);
  },
};

iraok.series.columns.year = {
  header: "Year",
  data_column: "Year",
  getContent: function (row) {
    return iraok.create_text(row.Year, null, this.data_column);
  },
};

iraok.series.columns.time = {
  header: "Time",
  data_column: "Time",
  getContent: function (row) {
    return iraok.create_text(row.Time, null, this.data_column);
  },
};

iraok.series.columns.age_grade = {
  header: "AG %",
  data_column: "AgeGrade",
  title: "Age Graded %",
  getContent: function (row) {
    return iraok.create_text(
      row.IsBlank == 1
        ? ""
        : (Math.round(row.AgeGrade * 10000) / 100).toFixed(2) + "%",
      row.ag * 100,
      this.data_column
    );
  },
};

iraok.series.columns.award = {
  header: "",
  data_column: "Award",
  getContent: function (row) {
    let td = document.createElement("td");

    if (row.rn <= 4) {
      let rn = row.rn - 1;
      td.title = row.AgeGroup + " " + row.Record + " Record";
      td.setAttribute("data-column", this.data_column);

      if (row.Record == "Course") {
        td.appendChild(iraok.get_trophy(rn));
      } else if (row.Record == "Age Grade") {
        td.appendChild(iraok.get_age_grade_record(rn));
      } else if (row.Record == "Division") {
        td.appendChild(iraok.get_medal(rn));
      }
    }
    return td;
  },
};

iraok.series.columns.race_year = {
  header: "Year",
  data_column: "Year",
  getContent: function (row) {
    let td = document.createElement("td");
    let a = document.createElement("a");
    a.href = "/race/" + row.Year + "/" + row.UrlName + "/";
    a.innerText = row.Year;
    td.appendChild(a);
    td.setAttribute("data-column", this.data_column);
    return td;
  },
};

iraok.series.columns.race_name = {
  header: "Race",
  data_column: "Race",
  getContent: function (row) {
    let td = document.createElement("td");
    let a = document.createElement("a");
    a.href = "/race/" + row.Year + "/" + row.UrlName + "/";
    a.innerText = row.Race;
    td.appendChild(a);
    td.setAttribute("data-column", this.data_column);
    return td;
  },
};

iraok.series.columns.finishers = {
  header: "Size",
  data_column: "Finishers",
  getContent: function (row) {
    return iraok.create_text(row.Finishers, null, this.data_column);
  },
};

iraok.series.columns.female_winner = {
  header: "Top Female",
  data_column: "FWinner",
  getContent: function (row) {
    let td = document.createElement("td");
    let a = document.createElement("a");
    a.href = "/athlete/" + row.Furlname + "/";
    a.innerText = row.FName;
    td.appendChild(a);
    td.setAttribute("data-column", this.data_column);
    return td;
  },
};

iraok.series.columns.male_winner = {
  header: "Top Male",
  data_column: "MWinner",
  getContent: function (row) {
    let td = document.createElement("td");
    let a = document.createElement("a");
    a.href = "/athlete/" + row.Murlname + "/";
    a.innerText = row.MName;
    td.appendChild(a);
    td.setAttribute("data-column", this.data_column);
    return td;
  },
};

iraok.series.columns.female_time = {
  header: "Time",
  data_column: "FTime",
  getContent: function (row) {
    return iraok.create_text(row.FTime, null, this.data_column);
  },
};

iraok.series.columns.male_time = {
  header: "Time",
  data_column: "MTime",
  getContent: function (row) {
    return iraok.create_text(row.MTime, null, this.data_column);
  },
};

iraok.series.awards_columns = [];
iraok.series.awards_columns.push(iraok.series.columns.rn);
iraok.series.awards_columns.push(iraok.series.columns.record);
iraok.series.awards_columns.push(iraok.series.columns.age_group);
iraok.series.awards_columns.push(iraok.series.columns.name);
iraok.series.awards_columns.push(iraok.series.columns.city);
iraok.series.awards_columns.push(iraok.series.columns.year);
iraok.series.awards_columns.push(iraok.series.columns.time);
iraok.series.awards_columns.push(iraok.series.columns.age_grade);
iraok.series.awards_columns.push(iraok.series.columns.award);

iraok.series.race_columns = [];
iraok.series.race_columns.push(iraok.series.columns.race_year);
iraok.series.race_columns.push(iraok.series.columns.race_name);
iraok.series.race_columns.push(iraok.series.columns.finishers);
iraok.series.race_columns.push(iraok.series.columns.female_winner);
iraok.series.race_columns.push(iraok.series.columns.female_time);
iraok.series.race_columns.push(iraok.series.columns.male_winner);
iraok.series.race_columns.push(iraok.series.columns.male_time);

iraok.series.award_span = null;
iraok.series.expand_series_awards = function (record, span) {
  if (iraok.series.style) iraok.series.style.remove();
  iraok.series.record = record == iraok.series.record ? null : record;

  if (iraok.series.award_span)
    iraok.series.award_span.innerText = "expand_circle_down";

  if (iraok.series.record) {
    iraok.series.award_span = span;
    span.innerText = "expand_circle_up";
    let text_content = "";

    text_content +=
      '#iraok-series-records-table > table > tbody > tr[data-category="' +
      iraok.series.record +
      '"] { display: table-row; }';

    text_content +=
      '#iraok-series-records-table > table > tbody > tr[data-category="' +
      iraok.series.record +
      '"][data-position="last"] { border-bottom-style: double; }';

    text_content +=
      '#iraok-series-records-table > table > thead > tr > th[data-column="rn"] { display: table-cell; }';
    text_content +=
      '#iraok-series-records-table > table > tbody > tr > td[data-column="rn"] { display: table-cell;}';

    iraok.series.style = document.createElement("style");
    iraok.series.style.textContent = text_content;
    document.head.appendChild(iraok.series.style);
  }
};

iraok.series.populate_table = function () {
  if (!iraok.series.figure)
    iraok.series.figure = document.getElementById("iraok-series-races-table");
  if (iraok.series.figure)
    iraok.series.table = iraok.series.figure.firstElementChild;

  if (!iraok.series.figure_awards)
    iraok.series.figure_awards = document.getElementById(
      "iraok-series-records-table"
    );
  if (iraok.series.figure_awards)
    iraok.series.table_awards = iraok.series.figure_awards.firstElementChild;

  if (!iraok.series.table_heading) {
    iraok.series.table_heading = document.getElementById(
      "iraok-series-races-heading"
    );
    iraok.series.table_heading.innerText = iraok.series.info.Series + " Races";
  }

  if (!iraok.series.table_awards_heading) {
    iraok.series.table_awards_heading = document.getElementById(
      "iraok-series-records-heading"
    );
    iraok.series.table_awards_heading.innerText =
      iraok.series.info.Series + " Records";
  }

  if (iraok.series.results && iraok.series.results.length > 0)
    iraok.clear_table(iraok.series.table);

  if (iraok.series.awards && iraok.series.awards.length > 0)
    iraok.clear_table(iraok.series.table_awards);

  if (iraok.series.results && iraok.series.results.length > 0)
    iraok.set_table(
      iraok.series.table,
      iraok.series.race_columns,
      iraok.series.results,
      function () {
        let len = iraok.series.results.length;
        let caption =
          iraok.series.results.length + " race" + (len > 1 ? "s" : "");
        return [caption];
      },
      [iraok.series.figure, iraok.series.table_heading]
    );

  if (iraok.series.awards && iraok.series.awards.length > 0)
    iraok.set_table(
      iraok.series.table_awards,
      iraok.series.awards_columns,
      iraok.series.awards_expanded,
      null,
      [iraok.series.figure_awards, iraok.series.table_awards_heading],
      function (tr, row) {
        if (row.FirstGroup) tr.setAttribute("data-position", "first");
        if (row.LastGroup) tr.setAttribute("data-position", "last");
        if (row.rn > 1)
          tr.setAttribute("data-category", row.Record + "-" + row.AgeGroup);
      }
    );

  if (iraok.series.table_awards_heading && iraok.series.awards.length == 0)
    iraok.series.table_awards_heading.style.display = "none";

  if (iraok.series.figure_awards && iraok.series.awards.length == 0)
    iraok.series.figure_awards.style.display = "none";
};
