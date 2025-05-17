<?php
/*
Plugin Name: Total Visits Counter
Description: Tracks and displays total visits to all short URLs.
Version: 1.0
Author: Your Name
*/

// Track visits when a short URL is accessed
yourls_add_action('redirect_shorturl', 'increment_total_visits');
function increment_total_visits() {
    $current_visits = (int) yourls_get_option('total_visits', 0);
    yourls_update_option('total_visits', $current_visits + 1);
}

// Display total visits in the admin panel
yourls_add_action('admin_header', 'display_total_visits');
function display_total_visits() {
    $total_visits = (int) yourls_get_option('total_visits', 0);
    echo '<div style="padding: 10px; margin: 10px 0; background: #f8f8f8; border: 1px solid #ddd;">';
    echo '<strong>Total user visits: ' . $total_visits . '</strong>';
    echo '</div>';
}
?>