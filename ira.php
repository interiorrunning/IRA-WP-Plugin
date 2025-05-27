<?php
/*
* Plugin Name: Interior Running Association
*/

add_filter('query_vars', 'iraok_query_vars');
add_action('init', 'iraok_init');
add_action('wp_enqueue_scripts', 'iraok_wp_enqueue_scripts');
add_filter('the_title', 'iraok_the_title', 10, 2);
add_filter('get_canonical_url', 'iraok_get_canonical_url', 10, 2);
add_filter('pre_get_document_title', 'iraok_pre_get_document_title');
register_activation_hook(__FILE__, 'iraok_activate');


function iraok_activate()
{
	iraok_init();
	flush_rewrite_rules();
}

function iraok_query_vars($query_vars)
{

	$query_vars[] = 'race_name';
	$query_vars[] = 'race_year';
	$query_vars[] = 'athlete_name';
	$query_vars[] = 'series';


	$query_vars[] = 'q';
	$query_vars[] = 'o';
	$query_vars[] = 'l';

	return $query_vars;
}

function iraok_init()
{
	add_rewrite_rule(
		'^race\/(198[2-9]|199[0-9]|20[0-1][0-9]|202[0-9])\/([a-zA-Z_0-9]+)\/?$',
		'index.php?pagename=race&race_name=$matches[2]&race_year=$matches[1]',
		'top'
	);


	add_rewrite_rule(
		'^athlete\/([a-zA-Z_]+[0-9]*)\/?$',
		'index.php?pagename=athlete&athlete_name=$matches[1]',
		'top'
	);

	add_rewrite_rule(
		'^award\/(198[2-9]|199[0-9]|20[0-1][0-9]|202[0-9])\/?$',
		'index.php?pagename=award&race_year=$matches[1]',
		'top'
	);

	add_rewrite_rule(
		'^series\/([a-zA-Z_0-9]+)\/?$',
		'index.php?pagename=series&series=$matches[1]',
		'top'
	);


	add_rewrite_rule(
		'^age-category-scoring\/(198[2-9]|199[0-9]|20[0-1][0-9]|202[0-9])\/?$',
		'index.php?pagename=age-category&race_year=$matches[1]',
		'top'
	);

	add_rewrite_rule(
		'^age-grade-scoring\/(198[2-9]|199[0-9]|20[0-1][0-9]|202[0-9])\/?$',
		'index.php?pagename=age-grade&race_year=$matches[1]',
		'top'
	);

	add_rewrite_rule(
		'^runner-of-the-year\/(198[2-9]|199[0-9]|20[0-1][0-9]|202[0-9])\/?$',
		'index.php?pagename=runner-of-the-year&race_year=$matches[1]',
		'top'
	);

	/*
	add_rewrite_rule(
		'^age-grade-scoring\/(198[2-9]|199[0-9]|20[0-1][0-9]|202[0-9])\/?$',
		'index.php?pagename=age-grade-scoring&race_year=$matches[1]',
		'top'
	);

	
	add_rewrite_rule(
		'^yearly-awards\/(198[2-9]|199[0-9]|20[0-1][0-9]|202[0-9])\/?$',
		'index.php?pagename=yearly-awards&race_year=$matches[1]',
		'top'
	);
	*/
}

function iraok_wp_enqueue_scripts()
{
	$ver = '1.0.08';

	if (is_page('race') || is_page('athlete') || is_page('award') || is_page('series') || is_page('award') || is_page('races') || is_page('age-category') || is_page('age-grade') || is_page('search') || is_page('runner-of-the-year')) {
		wp_register_script("iraok-ira", plugins_url('/js/ira.js', __FILE__), array(), $ver, array());
		wp_enqueue_style("iraok-ira", plugins_url('/css/ira.css', __FILE__), array(), $ver, 'all');

		wp_enqueue_style("iraok-google_font", 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,300,0,0', array(), $ver, 'all');
	}

	if (is_page('race')) {

		wp_enqueue_script("iraok-race", plugins_url('/js/race.js', __FILE__), array("iraok-ira"), $ver, array());
		wp_enqueue_script("iraok-race_end", plugins_url('/js/race_end.js', __FILE__), array(), $ver, array('strategy' => 'defer'));
		wp_enqueue_style("iraok-race", plugins_url('/css/race.css', __FILE__), array(), $ver, 'all');


		$race_year =  get_query_var("race_year");
		$race_name =  get_query_var("race_name");

		global $wpdb;
		$result = $wpdb->get_results($wpdb->prepare("call dbo.p_get_race_results(%d, %s);", $race_year, $race_name));
		wp_add_inline_script("iraok-ira", "iraok.race.results = " .  json_encode($result));

		$iraok_p_get_race_info = iraok_p_get_race_info();
		wp_add_inline_script("iraok-ira", "iraok.race.info = " .  json_encode($iraok_p_get_race_info));
	} else if (is_page('athlete')) {

		wp_enqueue_script("iraok-athlete", plugins_url('/js/athlete.js', __FILE__), array("iraok-ira"), $ver, array());
		wp_enqueue_script("iraok-athlete_end", plugins_url('/js/athlete_end.js', __FILE__), array(), $ver, array('strategy' => 'defer'));
		wp_enqueue_style("iraok-athlete", plugins_url('/css/athlete.css', __FILE__), array(), $ver, 'all');

		$athlete_name =  get_query_var("athlete_name");


		global $wpdb;
		$result = $wpdb->get_results($wpdb->prepare("call dbo.p_get_athlete_results(%s);", $athlete_name));
		wp_add_inline_script("iraok-ira", "iraok.athlete.results = " .  json_encode($result));

		$result = $wpdb->get_results($wpdb->prepare("call dbo.p_get_athlete_awards(%s);", $athlete_name));
		wp_add_inline_script("iraok-ira", "iraok.athlete.awards = " .  json_encode($result));


		$iraok_p_get_athlete_info = iraok_p_get_athlete_info();
		wp_add_inline_script("iraok-ira", "iraok.athlete.info = " .  json_encode($iraok_p_get_athlete_info));
	} else if (is_page('series')) {

		wp_enqueue_script("iraok-series", plugins_url('/js/series.js', __FILE__), array("iraok-ira"), $ver, array());
		wp_enqueue_script("iraok-series_end", plugins_url('/js/series_end.js', __FILE__), array(), $ver, array('strategy' => 'defer'));
		wp_enqueue_style("iraok-series", plugins_url('/css/series.css', __FILE__), array(), $ver, 'all');

		$series =  get_query_var("series");

		global $wpdb;
		$iraok_p_get_series_awards = $wpdb->get_results($wpdb->prepare("call dbo.p_get_series_awards(%s);", $series));
		$iraok_p_get_series_races = $wpdb->get_results($wpdb->prepare("call dbo.p_get_series_races(%s);", $series));
		$iraok_p_get_series_info = iraok_p_get_series_info();

		wp_add_inline_script("iraok-ira", "iraok.series.awards = " .  json_encode($iraok_p_get_series_awards));
		wp_add_inline_script("iraok-ira", "iraok.series.results = " .  json_encode($iraok_p_get_series_races));
		wp_add_inline_script("iraok-ira", "iraok.series.info = " .  json_encode($iraok_p_get_series_info));
	} else if (is_page('award')) {

		wp_enqueue_script("iraok-award", plugins_url('/js/award.js', __FILE__), array("iraok-ira"), $ver, array());
		wp_enqueue_script("iraok-award_end", plugins_url('/js/award_end.js', __FILE__), array(), $ver, array('strategy' => 'defer'));
		wp_enqueue_style("iraok-award", plugins_url('/css/award.css', __FILE__), array(), $ver, 'all');

		$race_year =  get_query_var("race_year");

		global $wpdb;
		$result = $wpdb->get_results($wpdb->prepare("call dbo.p_get_awards(%d);", $race_year));
		$years = $wpdb->get_results("call dbo.p_get_award_years();");
		wp_add_inline_script("iraok-ira", "iraok.award.results = " .  json_encode($result));
		wp_add_inline_script("iraok-ira", "iraok.award.years = " .  json_encode($years));
		wp_add_inline_script("iraok-ira", "iraok.award.selected_year = " .  $race_year);
	} else if (is_page('races')) {

		wp_enqueue_script("iraok-races", plugins_url('/js/races.js', __FILE__), array("iraok-ira"), $ver, array());
		wp_enqueue_script("iraok-races_end", plugins_url('/js/races_end.js', __FILE__), array(), $ver, array('strategy' => 'defer'));
		wp_enqueue_style("iraok-races", plugins_url('/css/races.css', __FILE__), array(), $ver, 'all');

		global $wpdb;
		$result = $wpdb->get_results("call dbo.p_get_races();");
		wp_add_inline_script("iraok-ira", "iraok.races.results = " .  json_encode($result));
	} else if (is_page('age-category')) {

		wp_enqueue_script("iraok-age_category", plugins_url('/js/age_category.js', __FILE__), array("iraok-ira"), $ver, array());
		wp_enqueue_script("iraok-age_category_end", plugins_url('/js/age_category_end.js', __FILE__), array(), $ver, array('strategy' => 'defer'));
		wp_enqueue_style("iraok-age_category", plugins_url('/css/age_category.css', __FILE__), array(), $ver, 'all');

		$race_year =  get_query_var("race_year");

		global $wpdb;
		$result = $wpdb->get_results($wpdb->prepare("call dbo.p_get_age_category(%d);", $race_year));
		$info = $wpdb->get_results($wpdb->prepare("call dbo.p_get_age_category_info(%d);", $race_year));
		wp_add_inline_script("iraok-ira", "iraok.age_category.results = " .  json_encode($result));
		wp_add_inline_script("iraok-ira", "iraok.age_category.info = " .  json_encode($info));
	} else if (is_page('age-grade')) {

		wp_enqueue_script("iraok-grade", plugins_url('/js/age_grade.js', __FILE__), array("iraok-ira"), $ver, array());
		wp_enqueue_script("iraok-age_grade_end", plugins_url('/js/age_grade_end.js', __FILE__), array(), $ver, array('strategy' => 'defer'));
		wp_enqueue_style("iraok-age_grade", plugins_url('/css/age_grade.css', __FILE__), array(), $ver, 'all');

		$race_year =  get_query_var("race_year");

		global $wpdb;
		$result = $wpdb->get_results($wpdb->prepare("call dbo.p_get_age_grade(%d);", $race_year));
		$info = $wpdb->get_results($wpdb->prepare("call dbo.p_get_age_grade_info(%d);", $race_year));
		wp_add_inline_script("iraok-ira", "iraok.age_grade.results = " .  json_encode($result));
		wp_add_inline_script("iraok-ira", "iraok.age_grade.info = " .  json_encode($info));
	} else if (is_page('runner-of-the-year')) {

		wp_enqueue_script("iraok-runner_of_the_year", plugins_url('/js/runner_of_the_year.js', __FILE__), array("iraok-ira"), $ver, array());
		wp_enqueue_script("iraok-runner_of_the_year_end", plugins_url('/js/runner_of_the_year_end.js', __FILE__), array(), $ver, array('strategy' => 'defer'));
		wp_enqueue_style("iraok-runner_of_the_year", plugins_url('/css/runner_of_the_year.css', __FILE__), array(), $ver, 'all');

		$race_year =  get_query_var("race_year");

		global $wpdb;
		$result = $wpdb->get_results($wpdb->prepare("call dbo.p_get_runner_of_the_year(%d);", $race_year));
		$info = $wpdb->get_results($wpdb->prepare("call dbo.p_get_runner_of_the_year_info(%d);", $race_year));
		wp_add_inline_script("iraok-ira", "iraok.runner_of_the_year.results = " .  json_encode($result));
		wp_add_inline_script("iraok-ira", "iraok.runner_of_the_year.info = " .  json_encode($info));
	} else if (is_page('search')) {

		wp_enqueue_script("iraok-search", plugins_url('/js/search.js', __FILE__), array("iraok-ira"), $ver, array());
		wp_enqueue_script("iraok-search_end", plugins_url('/js/search_end.js', __FILE__), array(), $ver, array('strategy' => 'defer'));
		wp_enqueue_style("iraok-search", plugins_url('/css/search.css', __FILE__), array(), $ver, 'all');

		$q = get_query_var("q");
		$ostr = get_query_var("o");
		$lstr = get_query_var("l");

		if (!empty($ostr))
			$o = intval($ostr);
		else
			$o = 0;

		if (!empty($lstr))
			$l = intval($lstr);
		else
			$l = 10;

		if ($l <= 0 || $l >= 10)
			$l = 10;

		$qstr  = preg_replace("/[^A-Za-z ]/", ' ', $q);
		$qa = array_filter(explode(" ", $qstr));
		$qstr = join("* ", $qa) . "*";

		if (count($qa) > 0) {
			global $wpdb;
			$result = $wpdb->get_results($wpdb->prepare("call dbo.p_get_search(%s, %d, %d);", $qstr, $o, $l));
			wp_add_inline_script("iraok-ira", "iraok.search.results = " .  json_encode($result));
		} else
			wp_add_inline_script("iraok-ira", "iraok.search.results = []");
		wp_add_inline_script("iraok-ira", "iraok.search.search_parameters = " .  json_encode(array("q" => $q, "o" => $o, "l" => $l)));
	} else if (is_page('analytics')) {
		$current_user = wp_get_current_user();
		$upload_dir   = wp_upload_dir();

		if (isset($current_user->user_login) && !empty($upload_dir['basedir']) && $current_user->exists() && count($current_user->roles) > 0 &&  $current_user->roles[0] ==  "administrator") {
			$user_dirname = $upload_dir['basedir'] . '/iraok-analytics/';
			if (! file_exists($user_dirname)) {
				wp_mkdir_p($user_dirname);
			}

			global $wpdb;
			$table_names = $wpdb->get_results("select `table_name` as `name` from information_schema.tables where table_schema = 'ana' and (`table_name` like 'dim_%' or `table_name` like 'fact_%');");
			foreach ($table_names as $row) {
				$table_name = $row->name;
				$results = $wpdb->get_results("select * from ana." . $table_name, "ARRAY_N");
				$column_headers = $wpdb->get_col_info();
				$fp = fopen($user_dirname .  $table_name . '.csv', 'w');
				fputcsv($fp, $column_headers);
				foreach ($results as $result) {
					fputcsv($fp, $result);
				}
				fclose($fp);
			}
		}
	}
}

function iraok_pre_get_document_title($title)
{
	if (is_page('race')) {
		$race_year =  get_query_var("race_year");
		$iraok_p_get_race_info = iraok_p_get_race_info();
		return (count($iraok_p_get_race_info) >= 1 ? $iraok_p_get_race_info[0]->Name : "Unknown") . " | " . $race_year . " | Interior Running Association";
	} else if (is_page('athlete')) {
		$iraok_p_get_athlete_info = iraok_p_get_athlete_info();
		return (count($iraok_p_get_athlete_info) >= 1 ? $iraok_p_get_athlete_info[0]->Name : "Unknown") . " | Interior Running Association";
	} else if (is_page('series')) {
		$iraok_p_get_series_info = iraok_p_get_series_info();
		return (count($iraok_p_get_series_info) >= 1 ? $iraok_p_get_series_info[0]->Series : "Unknown") . " | Interior Running Association";
	} else if (is_page('award')) {
		$race_year =  get_query_var("race_year");
		return "Awards | " . $race_year . " | Interior Running Association";
	} else if (is_page('races')) {
		return "Races | Interior Running Association";
	} else if (is_page('age-category')) {
		$race_year =  get_query_var("race_year");
		return "Age Category Scoring | " . $race_year . " | Interior Running Association";
	} else if (is_page('age-grade')) {
		$race_year =  get_query_var("race_year");
		return "Age Grade Scoring | " . $race_year . " | Interior Running Association";
	} else if (is_page('runner-of-the-year')) {
		$race_year =  get_query_var("race_year");
		return "Runner of the Year | " . $race_year . " | Interior Running Association";
	} else if (is_page('search')) {
		return "Athlete Search | Interior Running Association";
	}
	return $title;
}

function iraok_the_title($title, $post_id)
{
	if (is_page('race') && $title == "race") {
		$iraok_p_get_race_info = iraok_p_get_race_info();
		return count($iraok_p_get_race_info) >= 1 ? $iraok_p_get_race_info[0]->Name : "Unknown";
	} else if (is_page('athlete') && $title == "athlete") {
		$iraok_p_get_athlete_info = iraok_p_get_athlete_info();
		return count($iraok_p_get_athlete_info) >= 1 ? $iraok_p_get_athlete_info[0]->Name : "Unknown";
	} else if (is_page('series') && $title == "series") {
		$iraok_p_get_series_info = iraok_p_get_series_info();
		return count($iraok_p_get_series_info) >= 1 ? $iraok_p_get_series_info[0]->Series : "Unknown";
	} else if (is_page('award') && $title == "award") {
		$race_year =  get_query_var("race_year");
		return "Awards | " . $race_year;
	} else if (is_page('races') && $title == "races") {
		return "Races";
	} else if (is_page('age-category') && $title == "age-category") {
		$race_year =  get_query_var("race_year");
		return "Age Category Scoring | " . $race_year;
	} else if (is_page('age-grade') && $title == "age-grade") {
		$race_year =  get_query_var("race_year");
		return "Age Grade Scoring | " . $race_year;
	} else if (is_page('runner-of-the-year') && $title == "runner-of-the-year") {
		$race_year =  get_query_var("race_year");
		return "Runner of the Year | " . $race_year;
	} else if (is_page('search') && $title == "search") {
		return "Athlete Search";
	}
	return $title;
}

function iraok_get_canonical_url($original_url, $post)
{
	if (is_page('race')) {
		$race_year =  get_query_var("race_year");
		$race_name =  get_query_var("race_name");
		return $original_url .  $race_year . "/" .  $race_name . "/";
	} else if (is_page('athlete')) {
		$athlete_name =  get_query_var("athlete_name");
		return $original_url . $athlete_name . "/";
	} else if (is_page('series')) {
		$series =  get_query_var("series");
		return $original_url . $series . "/";
	} else if (is_page('award')) {
		$race_year =  get_query_var("race_year");
		return $original_url .  $race_year . "/";
	} else if (is_page('age-category')) {
		$race_year =  get_query_var("race_year");
		return $original_url .  $race_year . "/";
	} else if (is_page('age-grade')) {
		$race_year =  get_query_var("race_year");
		return $original_url .  $race_year . "/";
	} else if (is_page('runner-of-the-year')) {
		$race_year =  get_query_var("race_year");
		return $original_url .  $race_year . "/";
	}
	return $original_url;
}

function iraok_p_get_race_info()
{
	global $p_get_race_info;
	if (isset($p_get_race_info)) {
		return $p_get_race_info;
	}
	global $wpdb;
	$race_year =  get_query_var("race_year");
	$race_name =  get_query_var("race_name");
	$p_get_race_info = $wpdb->get_results($wpdb->prepare("call dbo.p_get_race_info(%d, %s);", $race_year, $race_name));

	if (count($p_get_race_info) >= 1)
		$p_get_race_info[0]->Year = $race_year;

	return $p_get_race_info;
}

function iraok_p_get_series_info()
{
	global $p_get_series_info;
	if (isset($p_get_series_info)) {
		return $p_get_series_info;
	}
	global $wpdb;
	$series =  get_query_var("series");
	$p_get_series_info = $wpdb->get_results($wpdb->prepare("call dbo.p_get_series_info(%s);", $series));

	return $p_get_series_info;
}

function iraok_p_get_athlete_info()
{
	global $p_get_athlete_info;
	if (isset($p_get_athlete_info)) {
		return $p_get_athlete_info;
	}
	global $wpdb;
	$athlete_name =  get_query_var("athlete_name");

	$p_get_athlete_info = $wpdb->get_results($wpdb->prepare("call dbo.p_get_athlete_info(%s);", $athlete_name));

	return $p_get_athlete_info;
}
