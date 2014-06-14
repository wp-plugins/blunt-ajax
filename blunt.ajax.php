<?php 
	
	/*
		Plugin Name: Blunt Ajax
		Plugin URI: http://wordpress.org/plugins/blunt-ajax/
		Description: AJAX in WordPress Without Frameworks
		Version: 1.0.1
		Author: John A. Huebner II, hube02@earthlink.net
		Author URI: 
		License: GPL v2 or later
		
		Blunt GA Plugin
		Copyright (C) 2012, John A. Huebner II, hube02@earthlink.net
		
		This program is free software: you can redistribute it and/or modify
		it under the terms of the GNU General Public License as published by
		the Free Software Foundation, either version 2 of the License, or
		(at your option) any later version.
		
		This program is distributed in the hope that it will be useful,
		but WITHOUT ANY WARRANTY; without even the implied warranty of
		MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
		GNU General Public License for more details http://www.gnu.org/licenses
		
	*/
	
	new bluntAjax();
	
	class bluntAjax {
		
		private $version = '1.0.1';
		private $debug = false;
		private $test = false;
		private $minified = true;
		
		public static $instance;
		
		public function __construct() {
			add_action('init' , array($this, 'init'), 100);
			bluntAjax::$instance = $this;
		} // end public function __construct
		
		public function activate() {
			// not sure I even need this function
		} // end public function activate
		
		public function enqueue_scripts() {
			if ($this->debug) {
				wp_enqueue_script('blunt-ajax-debug',
													plugins_url('debug.js', __FILE__), 
													array('blunt-ajax'),
													$this->version);
			}
			if ($this->test) {
				wp_enqueue_script('blunt-ajax-test',
													plugins_url('test.js', __FILE__), 
													array('blunt-ajax'),
													$this->version);
			}
		} // end public function enqueue_script
		
		public function init() {
			// register scripts
			$src = plugins_url('blunt-ajax.min.js', __FILE__);
			if (!$this->minified) {
				$src = plugins_url('blunt-ajax.js', __FILE__);
			}
			wp_register_script('blunt-ajax', 
												 $src,
												 array(),
												 $this->version);
			$admin_url = admin_url('admin-ajax.php');
			$host = $_SERVER['HTTP_HOST'];
			$admin_url = preg_replace('#https?://'.preg_quote($host).'#', '', $admin_url);
			wp_localize_script('blunt-ajax',
												 'bluntAjaxOptions', 
												 array('url' => $admin_url,
															 'debug' => $this->debug));
			if ($this->debug || $this->test) {
				add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
			}
			if ($this->test) {
				add_action('wp_ajax_test_blunt_ajax', array($this, 'test_ajax'));
				add_action('wp_ajax_nopriv_test_blunt_ajax', array($this, 'test_ajax'));
			}
		} // end public function init
		
		public function test_ajax() {
			echo 'Blunt Ajax Request Succeeded'."\r\n";
			$method = $_SERVER['REQUEST_METHOD'];
			echo 'Request Method was '.$method."\r\n";
			echo 'Quert Arguments Were: ';
			if ($method == 'POST') {
				print_r($_POST);
			} else {
				print_r($_GET);
			}
			exit;
		} // end public function test_ajax
		
		public static function testOn() {
			self::$instance->test = true;
		} // end public static function test
		
		public static function debugOn() {
			self::$instance->test = true;
		} // end public static function test
		
		public static function minifiedOff() {
			self::$instance->minified = false;
		} // end public static function minifiedOff
		
		public static function getInstance() {
			return self::$instance;
		} // end public static function getInstance
		
	} // end class bluntAjax
	
?>