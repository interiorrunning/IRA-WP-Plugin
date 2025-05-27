var iraok = {};
iraok.award = {};
iraok.race = {};
iraok.races = {};
iraok.athlete = {};
iraok.series = {};
iraok.age_category = {};
iraok.age_grade = {};
iraok.runner_of_the_year = {};
iraok.search = {};

iraok.get_award_colour = function (place) {
  if (place == 1) return "#D4AF37";
  else if (place == 2) return "#A8A9AD";
  else if (place == 3) return "#AA7042";
  else if (place == 0) return "#4A799C";
};

iraok.get_svg_running = function () {
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttributeNS(
    "http://www.w3.org/2000/xmlns/",
    "xmlns:xlink",
    "http://www.w3.org/1999/xlink"
  );
  svg.setAttribute("width", "1em");
  svg.setAttribute("height", "1em");
  //svg.setAttribute("fill", iraok.get_award_colour(0));
  svg.setAttribute("viewBox", "0 -960 960 960");
  let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "M520-40v-240l-84-80-40 176-276-56 16-80 192 40 64-324-72 28v136h-80v-188l158-68q35-15 51.5-19.5T480-720q21 0 39 11t29 29l40 64q26 42 70.5 69T760-520v80q-66 0-123.5-27.5T540-540l-24 120 84 80v300h-80Zm20-700q-33 0-56.5-23.5T460-820q0-33 23.5-56.5T540-900q33 0 56.5 23.5T620-820q0 33-23.5 56.5T540-740Z"
  );
  svg.appendChild(path);
  return svg;
};

iraok.get_svg_landscape = function () {
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttributeNS(
    "http://www.w3.org/2000/xmlns/",
    "xmlns:xlink",
    "http://www.w3.org/1999/xlink"
  );
  svg.setAttribute("width", "1em");
  svg.setAttribute("height", "1em");
  //svg.setAttribute("fill", iraok.get_award_colour(0));
  svg.setAttribute("viewBox", "0 -960 960 960");
  let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "m40-240 240-320 180 240h101L410-520l150-200 360 480H40Z"
  );
  svg.appendChild(path);
  return svg;
};

iraok.get_age_grade_record = function (place) {
  if (!place) place = 0;

  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttributeNS(
    "http://www.w3.org/2000/xmlns/",
    "xmlns:xlink",
    "http://www.w3.org/1999/xlink"
  );
  svg.setAttribute("width", "1.125em");
  svg.setAttribute("height", "1.125em");
  svg.setAttribute("fill", iraok.get_award_colour(place));
  svg.setAttribute("viewBox", "0 -960 960 960");
  let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "m363-310 117-71 117 71-31-133 104-90-137-11-53-126-53 126-137 11 104 90-31 133ZM480-28 346-160H160v-186L28-480l132-134v-186h186l134-132 134 132h186v186l132 134-132 134v186H614L480-28Zm0-112 100-100h140v-140l100-100-100-100v-140H580L480-820 380-720H240v140L140-480l100 100v140h140l100 100Zm0-340Z"
  );
  svg.appendChild(path);
  return svg;
};

iraok.get_trophy = function (place) {
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttributeNS(
    "http://www.w3.org/2000/xmlns/",
    "xmlns:xlink",
    "http://www.w3.org/1999/xlink"
  );
  svg.setAttribute("width", "1em");
  svg.setAttribute("height", "1em");
  svg.setAttribute("fill", iraok.get_award_colour(place));
  svg.setAttribute("viewBox", "0 0 16 16");
  let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935z"
  );
  svg.appendChild(path);
  return svg;
};

iraok.get_medal = function (place) {
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttributeNS(
    "http://www.w3.org/2000/xmlns/",
    "xmlns:xlink",
    "http://www.w3.org/1999/xlink"
  );
  svg.setAttribute("width", "1em");
  svg.setAttribute("height", "1em");
  svg.setAttribute("fill", iraok.get_award_colour(place));
  svg.setAttribute("viewBox", "0 0 16 16");
  let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "M8 0l1.669.864 1.858.282.842 1.68 1.337 1.32L13.4 6l.306 1.854-1.337 1.32-.842 1.68-1.858.282L8 12l-1.669-.864-1.858-.282-.842-1.68-1.337-1.32L2.6 6l-.306-1.854 1.337-1.32.842-1.68L6.331.864 8 0z"
  );
  svg.appendChild(path);
  let path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path2.setAttribute(
    "d",
    "M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z"
  );
  svg.appendChild(path2);
  return svg;
};

iraok.get_award_icons = function (td, cr_gp, cr_ap, cr_cp, gp, ap, cp, di) {
  if (cp <= 3 || gp <= 3 || ap <= 3) {
    let a = document.createElement("a");
    a.href = "/award-icons/";

    let titles = [];
    let g = Array.from(di)[0];
    let gender = g === "M" ? "Male" : g === "F" ? "Female" : "Open";
    if (cr_gp == 1) {
      titles.push(gender + " Course Record");
      a.appendChild(iraok.get_trophy(0));
    } else if (gp <= 3) {
      titles.push((gp == 1 ? "1st" : gp == 2 ? "2nd" : "3rd") + " " + gender);
      a.appendChild(iraok.get_trophy(gp));
    }

    if (cr_ap == 1) {
      titles.push(gender + " Age Grade Record");
      a.appendChild(iraok.get_age_grade_record());
    } else if (ap <= 3) {
      titles.push(
        (ap == 1 ? "1st" : ap == 2 ? "2nd" : "3rd") +
        " " +
        gender +
        " Age Grade"
      );
      a.appendChild(iraok.get_age_grade_record(ap));
    }

    if (cr_cp == 1) {
      titles.push(di + " Record");
      a.appendChild(iraok.get_medal(0));
    } else if (cp <= 3) {
      titles.push((cp == 1 ? "1st" : cp == 2 ? "2nd" : "3rd") + " in " + di);
      a.appendChild(iraok.get_medal(cp));
    }
    td.appendChild(a);

    td.title = titles.join(" | ");
  }

  return td;
};

iraok.get_division = function (div) {
  if (div === "O00-99+") return "";
  if (div === "F00-99+") return "Female";
  if (div === "M00-99+") return "Male";
  return div;
};

iraok.append_elements = function (elements) {

  let div = document.createElement("div");

  for (let i = 0; i < elements.length; i++) {
    div.appendChild(elements[i]);
  }

  return div;
};

iraok.get_input = function (
  type,
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
  input.type = type;
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

iraok.get_input_radio = function (
  id,
  name,
  value,
  labelVal,
  icon,
  checked,
  onchange
) {
  return iraok.get_input("radio", id, name, value, labelVal, icon, checked, onchange);
};

iraok.get_input_checkbox = function (
  id,
  name,
  value,
  labelVal,
  icon,
  checked,
  onchange
) {
  return iraok.get_input("checkbox", id, name, value, labelVal, icon, checked, onchange);
};


iraok.get_cookie = function (cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

iraok.set_cookie = function (cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};

iraok.create_cell = function (type, content, title, data_column) {
  let c = document.createElement(type);
  if (content) c.innerText = content;
  if (title) c.title = title;
  if (data_column) c.setAttribute("data-column", data_column);
  return c;
};

iraok.create_header = function (header, title, data_column) {
  return iraok.create_cell("th", header, title, data_column);
};

iraok.create_text = function (content, title, data_column) {
  return iraok.create_cell("td", content, title, data_column);
};

iraok.clear_table = function (table) {
  while (table && table.firstChild) table.removeChild(table.lastChild);
};

iraok.set_table = function (
  table,
  cols,
  rows,
  captionFunc,
  itemsToDisplay,
  trFunc
) {
  if (captionFunc) {
    let caption = document.createElement("caption");
    let svgs = captionFunc();

    caption.innerText = svgs[0];
    for (let i = 1; i < svgs.length; i++) caption.appendChild(svgs[i]);

    if (table) table.appendChild(caption);
  }

  {
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");
    for (let i = 0; i < cols.length; i++) {
      let col = cols[i];
      let t = col.get_header
        ? col.get_header()
        : iraok.create_header(col.header, col.title, col.data_column);
      tr.appendChild(t);
    }
    thead.appendChild(tr);

    if (table) table.appendChild(thead);
  }
  {
    let tbody = document.createElement("tbody");
    for (let r = 0; r < rows.length; r++) {
      let tr = document.createElement("tr");
      for (let i = 0; i < cols.length; i++) {
        let content = cols[i].getContent(rows[r]);
        let content_array = content instanceof Array ? content : [content];

        for (let j = 0; j < content_array.length; j++)
          tr.appendChild(content_array[j]);
      }
      if (trFunc) trFunc(tr, rows[r]);
      tbody.appendChild(tr);
    }
    if (table) table.appendChild(tbody);
  }

  if (itemsToDisplay)
    for (let i = 0; i < itemsToDisplay.length; i++)
      if (itemsToDisplay[i]) itemsToDisplay[i].style.display = "block";
};
