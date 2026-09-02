=== WooCommerce Dropshipping ===
Contributors: woocommerce
Tags: woocommerce, ecommerce, shipping, inventory, orders
Requires at least: 6.5
Tested up to: 7.0
Requires PHP: 7.4
Requires Plugins: woocommerce
Stable tag: 5.2.6
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl-3.0.html

Manage AliExpress, local supplier, and affiliate dropshipping workflows in WooCommerce: fulfilment, pricing rules, inventory, packing slips, and supplier notifications.

== Description ==

WooCommerce Dropshipping extends your store so you can coordinate suppliers, automate routine dropshipping tasks, and keep product data aligned with how you source and fulfil orders.

**Features**

* Supplier workflows for local suppliers, affiliates, and AliExpress-related dropshipping.
* Pricing and inventory tooling, including CSV-based stock updates where supported.
* Supplier dashboards, order assignment, and fulfilment-oriented views.
* Packing slips and order-related documentation for suppliers.
* Automated supplier email notifications (respecting your notification preferences).
* Compatibility with modern WooCommerce setups, including High-Performance Order Storage (HPOS) where applicable.

This extension requires **WooCommerce** to be installed and active. For product information, documentation, and support options, see the [WooCommerce Dropshipping product page](https://woocommerce.com/products/woocommerce-dropshipping/).

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/woocommerce-dropshipping` directory, or install the package through the WordPress admin **Plugins → Add New** screen if you received it as a zip.
2. Activate the plugin through the **Plugins** screen in WordPress.
3. Ensure **WooCommerce** is installed, active, and meets the version requirements shown in this readme.
4. Open **WooCommerce → Settings** (or the Dropshipping settings entry provided by the plugin) and configure suppliers, notifications, and integrations as needed.

== Frequently Asked Questions ==

= Does this plugin work without WooCommerce? =

No. WooCommerce must be installed and active. The plugin declares a dependency on WooCommerce.

= Where do I configure suppliers and dropshipping options? =

Use the WooCommerce settings area and any Dropshipping-specific admin screens added by the plugin after activation.

= Is this plugin translation-ready? =

Yes. It uses the `woocommerce-dropshipping` text domain and ships language files under the `languages` directory.

== Screenshots ==

1. Configure dropshipping and supplier settings within WooCommerce.
2. Use supplier-oriented views and tools for orders and fulfilment.
3. Generate packing slips and related supplier documentation where enabled.

== Changelog ==

= 5.2.4 - 2026-04-27 =
* Update: Dropshipping CBE connector improvements.

= 5.2.3 - 2026-04-09 =
* Fix: Supplier email notifications honour “Do not send” settings.
* Fix: PHP errors in WooCommerce Dropshipping.

= 5.2.2 - 2025-11-07 =
* Fix: Compatibility issues.

= 5.2.1 - 2025-05-21 =
* Fix: CSV inventory import reliability and database-related failures.
* Fix: Product admin layout for dropshipping products.

For the full history, see `changelog.txt` in the plugin directory.

== Upgrade Notice ==

= 5.2.4 =
Maintenance and connector updates. Review supplier and CBE-related settings after upgrading.

== External services ==

This plugin may communicate with third-party services depending on your configuration, including but not limited to:

* **WooCommerce.com / Automattic** — For extension updates and related WooCommerce.com integration where implemented in the plugin package.
* **AliExpress or related APIs** — When you enable or use AliExpress-oriented import or fulfilment features.

Each service has its own terms and privacy policy. Only the data required for the features you use is sent. Review your WooCommerce and supplier integration settings before connecting external accounts.
