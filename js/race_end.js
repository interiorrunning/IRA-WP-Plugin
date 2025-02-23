window.addEventListener("popstate", (e) => {
    iraok.race.populate_table_and_button_group(window.location.hash);
});

iraok.race.populate_table_and_button_group(window.location.hash);
