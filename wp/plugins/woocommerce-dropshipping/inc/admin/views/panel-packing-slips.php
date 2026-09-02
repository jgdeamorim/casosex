<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Packing slips & PDFs — grouped markup (option keys unchanged).
 *
 * Included from WC_DS_Settings::get_dropshipping_settings(); inherits local variables.
 */

// ---------- Defensive defaults for PHPStan ----------

// Options array
$options = isset( $options ) && is_array( $options ) ? $options : [];

// Checkbox / HTML attribute strings (set in WC_DS_Settings::get_dropshipping_settings()).
$checkfull                        = $checkfull ?? '';
$csvInMail                        = $csvInMail ?? '';
$logoshow                         = $logoshow ?? '';
$show_logo_option                 = $show_logo_option ?? 'style="display:none"';
$show_shipping_information_option = $show_shipping_information_option ?? 'style="display:none"';
$product_image_option             = $product_image_option ?? 'style="display:none"';
$show_gst_supplier_email          = $show_gst_supplier_email ?? '';
$hide_shipping_price              = $hide_shipping_price ?? '';
$hide_tax                         = $hide_tax ?? '';
$total_price                      = $total_price ?? '';
$shipping_address_option          = $shipping_address_option ?? 'style="display:none"';
$billing_address_option           = $billing_address_option ?? 'style="display:none"';
$product_shipping                 = $product_shipping ?? '';
$image_product                    = $image_product ?? '';
$hide_client_info_Suppliers        = $hide_client_info_Suppliers ?? '';
$hide_contact_info_Suppliers       = $hide_contact_info_Suppliers ?? '';
$hide_suppliername_on_product_page = $hide_suppliername_on_product_page ?? '';
$suppliername_hideorderdetail      = $suppliername_hideorderdetail ?? '';
$show_pay_type                     = $show_pay_type ?? '';
$type_of_package_option            = $type_of_package_option ?? 'style="display:none"';
$product_price_option              = $product_price_option ?? 'style="display:none"';
$price_product                     = $price_product ?? '';
$cost_of_goods                     = $cost_of_goods ?? '';

// Scalars / strings
$woocommerce_url = $woocommerce_url ?? '';
$name_store      = $name_store ?? '';
$address_store   = $address_store ?? '';
$date_order      = $date_order ?? '';
$customer_note   = $customer_note ?? '';
$type_of_package = $type_of_package ?? '';
$billing_phone   = $billing_phone ?? '';
$customer_email  = $customer_email ?? '';

// Addresses
$address_shipping = $address_shipping ?? '';
$address_billing  = $address_billing ?? '';

// Strings
$store_add_shipping_add = $store_add_shipping_add ?? '';

// Checkbox attributes
$supp_notification_attr     = $supp_notification_attr ?? '';
$allow_manual_supplier_attr = $allow_manual_supplier_attr ?? '';
$email_complete         = $email_complete ?? '';
$link_complete_order    = $link_complete_order ?? '';
$supplier_email         = $supplier_email ?? '';
$cnf_mail               = $cnf_mail ?? '';
$std_mail               = $std_mail ?? '';
$cc_mail                = $cc_mail ?? '';
$checkout_order_number  = $checkout_order_number ?? '';


					if ( empty( @$options['dropship_additional_comment'] ) ) {
						$additionalCommentDefault = '';
					} else {
						$additionalCommentDefault = @$options['dropship_additional_comment'];
					}

					echo '<div class="wc-ds-panel-packing__inner">';

					echo '<header class="wc-ds-panel-packing__intro" aria-labelledby="wc-ds-pack-page-title">
					<h3 id="wc-ds-pack-page-title" class="wc-ds-panel-packing__title">' . esc_html__( 'Packing slips & PDFs', 'woocommerce-dropshipping' ) . '</h3>
					<p class="description wc-ds-panel-packing__lede">' . esc_html__( 'Control what appears on packing slip PDFs and what is attached to supplier emails. Save your changes before testing with a real order.', 'woocommerce-dropshipping' ) . '</p>

					<div class="wc-ds-merchant-callout wc-ds-merchant-callout--emphasis wc-ds-merchant-callout--packing-intro" role="note">
						<p class="wc-ds-merchant-callout__kicker">' . esc_html__( 'Before you change attachments or privacy options', 'woocommerce-dropshipping' ) . '</p>
						<ul>
							<li>' . esc_html__( 'PDF and CSV attachments are only sent when your store actually sends the supplier “new order” email. If supplier notifications are turned off under Notifications and follow-up actions below, nothing is attached — there is no email to attach to.', 'woocommerce-dropshipping' ) . '</li>
							<li>' . esc_html__( 'The Supplier email design tab only changes colors and fonts. This tab controls slip content, prices, customer details, and file attachments.', 'woocommerce-dropshipping' ) . '</li>
							<li>' . esc_html__( 'Email delivery problems (messages not arriving or going to spam) are usually fixed under Email delivery (SMTP), not here.', 'woocommerce-dropshipping' ) . '</li>
						</ul>
					</div>
					</header>

					<section class="wc-ds-settings-group wc-ds-settings-group--packing packing-slip-sections" aria-labelledby="wc-ds-pack-h-attach">
					<h4 id="wc-ds-pack-h-attach" class="wc-ds-settings-group__title">' . esc_html__( 'Email attachments', 'woocommerce-dropshipping' ) . '</h4>
					<p class="wc-ds-settings-group__description description">' . esc_html__( 'Choose files to include when your store emails suppliers about new orders.', 'woocommerce-dropshipping' ) . '</p>

					<table>
						<tr>
							<td><input name="full_information" id="full_information" class="fullinfo miscellaneous_packing_slip_options_master_checkbox" type="checkbox" ' . esc_attr( $checkfull ) . ' /></td>
							<td><label for="full_information"><strong>' . esc_html__( 'Attach packing slip PDF to supplier emails', 'woocommerce-dropshipping' ) . '</strong></label>
							<span class="description">' . esc_html__( 'Suppliers receive the packing slip as a PDF attachment with their order notification.', 'woocommerce-dropshipping' ) . '</span></td>
						</tr>
					</table>
					<p></p>

					<p class="description">' . esc_html__( 'Optionally attach a CSV of line items to the same supplier notification emails.', 'woocommerce-dropshipping' ) . '</p>
					<table>
						<tr>
							<td><input name="csv_inmail" id="csv_inmail" class="" type="checkbox" ' . esc_attr( $csvInMail ) . ' /></td>
							<td><img class="help_tip" data-tip="' . esc_attr__( 'Sends a CSV file with the supplier notification email.', 'woocommerce-dropshipping' ) . '" src="' . esc_url( $woocommerce_url . 'assets/images/help.png' ) . '" height="16" width="16"></td>
							<td><label for="csv_inmail">' . esc_html__( 'Attach CSV to supplier notifications', 'woocommerce-dropshipping' ) . '</label></td>
						</tr>
					</table>

					<p class="wc-ds-settings-group__subhead">' . esc_html__( 'CSV attachment filename', 'woocommerce-dropshipping' ) . '</p>
					<p class="description">' . esc_html__( 'When CSV attachments are enabled, you can add your store name or site address to the downloaded filename.', 'woocommerce-dropshipping' ) . '</p>
					<table>
						<tr>
							<td><input name="store_name" id="store_name" class="miscellaneous_packing_slip_options_checkbox" type="checkbox" ' . esc_attr( $name_store ) . '  /></td>
							<td><label for="store_name">' . esc_html__( 'Include store name in CSV attachment filename', 'woocommerce-dropshipping' ) . '</label></td>
						</tr>
					</table>
					<p></p>
					<table>
						<tr>
							<td><input name="store_address" id="store_address" class="miscellaneous_packing_slip_options_checkbox" type="checkbox" ' . esc_attr( $address_store ) . '  /></td>
							<td><label for="store_address">' . esc_html__( 'Include store URL in CSV attachment filename', 'woocommerce-dropshipping' ) . '</label></td>
						</tr>
					</table>
					</section>';

					echo '<section class="wc-ds-settings-group wc-ds-settings-group--packing packing-slip-sections" aria-labelledby="wc-ds-pack-h-content">
					<h4 id="wc-ds-pack-h-content" class="wc-ds-settings-group__title">' . esc_html__( 'Packing slip content', 'woocommerce-dropshipping' ) . '</h4>
					<p class="wc-ds-settings-group__description description">' . esc_html__( 'Layout and text that appear on the PDF packing slip (prices and customer privacy options are configured in the sections below).', 'woocommerce-dropshipping' ) . '</p>

					<p class="wc-ds-settings-group__subhead">' . esc_html__( 'Header and order summary', 'woocommerce-dropshipping' ) . '</p>
					<table>
						<tr>
							<td><label for="packing_slip_header">' . esc_html__( 'Packing slip title', 'woocommerce-dropshipping' ) . '</label></td>
							<td><img class="help_tip" data-tip="' . esc_attr__( 'Title shown at the top of the packing slip.', 'woocommerce-dropshipping' ) . '" src="' . esc_url( $woocommerce_url . 'assets/images/help.png' ) . '" height="16" width="16"></td>
							<td><input name="packing_slip_header" value="' . esc_attr( @$options['packing_slip_header'] ) . '" size="100" /></td>
						</tr>
					</table>
					<p></p>
					<table>
						<tr>
							<td><input name="show_logo" id="show_logo" class="miscellaneous_packing_slip_options_checkbox_false" data-id="show_logo" type="checkbox" ' . esc_attr( $logoshow ) . '  /></td>
							<td><label for="show_logo">' . esc_html__( 'Show logo in header', 'woocommerce-dropshipping' ) . '</label></td>
						</tr>
					</table>
					<p></p>
					<div class="show_logo" ' . $show_logo_option . '>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					echo '<p style="margin-left:50px;"><b>' . esc_html__( 'Note', 'woocommerce-dropshipping' ) . '</b> ' . esc_html__( 'For best results, keep logo dimensions within 200 × 60 px.', 'woocommerce-dropshipping' ) . '</p>
					<table style="margin-left:50px;">
						<tr>
							<td style="width:150px"><label for="packing_slip_url_to_logo" >' . esc_html__( 'Logo URL', 'woocommerce-dropshipping' ) . '</label></td>
							<td><img class="help_tip" data-tip="' . esc_attr__( 'Full URL of your logo image.', 'woocommerce-dropshipping' ) . '" src="' . esc_url( $woocommerce_url . 'assets/images/help.png' ) . '" height="16" width="16"></td>
							<td><input name="packing_slip_url_to_logo" value="' . esc_attr( @$options['packing_slip_url_to_logo'] ) . '" size="75" /></td>
						</tr>
					</table>
					<p></p>
					<table style="margin-left:50px;">
						<tr>
							<td style="width:150px"><label for="packing_slip_url_to_logo_width" >' . esc_html__( 'Logo width (px)', 'woocommerce-dropshipping' ) . '</label></td>
							<td><img class="help_tip" data-tip="' . esc_attr__( 'Logo width in pixels.', 'woocommerce-dropshipping' ) . '" src="' . esc_url( $woocommerce_url . 'assets/images/help.png' ) . '" height="16" width="16"></td>
							<td><input name="packing_slip_url_to_logo_width" value="' . esc_attr( @$options['packing_slip_url_to_logo_width'] ) . '" size="5" /></td>
						</tr>
					</table>
					</div>';

					echo '<p></p>
					<table>
						<tr>
							<td><input name="order_date" id="show_order_date" class="miscellaneous_packing_slip_options_checkbox" type="checkbox" ' . esc_attr( $date_order ) . '  /></td>
							<td><label for="show_order_date">' . esc_html__( 'Show order date next to order number', 'woocommerce-dropshipping' ) . '</label></td>
						</tr>
					</table>
					<p></p>
					<table>
						<tr>
							<td><input name="shipping" id="show_shipping_information" data-id="show_shipping_information" class="miscellaneous_packing_slip_options_checkbox" type="checkbox" ' . esc_attr( $product_shipping ) . '  /></td>
							<td><label for="show_shipping_information">' . esc_html__( 'Show shipping information', 'woocommerce-dropshipping' ) . '</label></td>
						</tr>
					</table>
					<p></p>
					<div class="inner-toggle show_shipping_information" ' . $show_shipping_information_option . '>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					echo '<p style="margin-left:50px;"><b>' . esc_html__( 'Note', 'woocommerce-dropshipping' ) . '</b> ' . esc_html__( 'Keep custom labels short to avoid wrapping issues on packing slips.', 'woocommerce-dropshipping' ) . '</p>
					<table style="margin-left:50px;">
						<tr>
							<td style="width:250px"><label for="dropship_chosen_shipping_method" >' . esc_html__( 'Shipping method label', 'woocommerce-dropshipping' ) . '</label></td>
							<td><img class="help_tip" data-tip="' . esc_attr__( 'Label shown for the shipping method.', 'woocommerce-dropshipping' ) . '" src="' . esc_url( $woocommerce_url . 'assets/images/help.png' ) . '" height="16" width="16"></td>
							<td><input name="dropship_chosen_shipping_method" value="' . esc_attr( @$options['dropship_chosen_shipping_method'] ) . '" size="30" maxlength="50" /></td>
						</tr>
					</table>
					<p></p>
					<table style="margin-left:50px;">
						<tr>
							<td style="width:250px"><label for="dropship_payment_type" >' . esc_html__( 'Payment type label', 'woocommerce-dropshipping' ) . '</label></td>
							<td><img class="help_tip" data-tip="' . esc_attr__( 'Label shown for the payment type.', 'woocommerce-dropshipping' ) . '" src="' . esc_url( $woocommerce_url . 'assets/images/help.png' ) . '" height="16" width="16"></td>
							<td><input name="dropship_payment_type" value="' . esc_attr( @$options['dropship_payment_type'] ) . '" size="30" maxlength="50"/></td>
						</tr>
					</table>
					</div>';

					echo '<p></p>
					<table>
						<tr>
							<td><input name="customer_note" id="show_customer_note" class="miscellaneous_packing_slip_options_checkbox" type="checkbox" ' . esc_attr( $customer_note ) . '  /></td>
							<td><label for="show_customer_note">' . esc_html__( 'Include customer note on packing slip', 'woocommerce-dropshipping' ) . '</label></td>
						</tr>
					</table>

					<p class="wc-ds-settings-group__subhead">' . esc_html__( 'Product table', 'woocommerce-dropshipping' ) . '</p>
					<table>
						<tr>
							<td><input name="product_image" id="product_image" data-id="product_image" class="miscellaneous_packing_slip_options_checkbox" type="checkbox" ' . esc_attr( $image_product ) . '  /></td>
							<td><label for="product_image">' . esc_html__( 'Show product thumbnail', 'woocommerce-dropshipping' ) . '</label></td>
						</tr>
					</table>
					<p></p>
					<div class="inner-toggle product_image" ' . $product_image_option . '>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					echo '<table>
						<tr>
							<td style="width:150px"><label for="dropship_image" >' . esc_html__( 'Image column label', 'woocommerce-dropshipping' ) . '</label></td>
							<td><img class="help_tip" data-tip="' . esc_attr__( 'Column heading for the product image.', 'woocommerce-dropshipping' ) . '" src="' . esc_url( $woocommerce_url . 'assets/images/help.png' ) . '" height="16" width="16"></td>
							<td><input name="dropship_image" value="' . esc_attr( @$options['dropship_image'] ) . '" size="30" maxlength="50" /></td>
						</tr>
					</table>
					</div>';

					echo '<p></p>
					<table>
						<tr>
							<td style="width:150px"><label for="dropship_sku" >' . esc_html__( 'SKU column label', 'woocommerce-dropshipping' ) . '</label></td>
							<td><img class="help_tip" data-tip="' . esc_attr__( 'Column heading for SKU.', 'woocommerce-dropshipping' ) . '" src="' . esc_url( $woocommerce_url . 'assets/images/help.png' ) . '" height="16" width="16"></td>
							<td><input name="dropship_sku" value="' . esc_attr( @$options['dropship_sku'] ) . '" size="30" maxlength="50" /></td>
						</tr>
					</table>
					<table>
						<tr>
							<td style="width:150px"><label for="dropship_product" >' . esc_html__( 'Product column label', 'woocommerce-dropshipping' ) . '</label></td>
							<td><img class="help_tip" data-tip="' . esc_attr__( 'Column heading for product name.', 'woocommerce-dropshipping' ) . '" src="' . esc_url( $woocommerce_url . 'assets/images/help.png' ) . '" height="16" width="16"></td>
							<td><input name="dropship_product" value="' . esc_attr( @$options['dropship_product'] ) . '" size="30" maxlength="50" /></td>
						</tr>
					</table>
					<table>
						<tr>
							<td style="width:150px"><label for="dropship_quantity">' . esc_html__( 'Quantity column label', 'woocommerce-dropshipping' ) . '</label></td>
							<td><img class="help_tip" data-tip="' . esc_attr__( 'Column heading for quantity.', 'woocommerce-dropshipping' ) . '" src="' . esc_url( $woocommerce_url . 'assets/images/help.png' ) . '" height="16" width="16"></td>
							<td><input name="dropship_quantity" value="' . esc_attr( @$options['dropship_quantity'] ) . '" size="30" maxlength="50"/></td>
						</tr>
					</table>
					<p></p>
					<table>
						<tr>
							<td><input name="type_of_package" id="type_of_package" data-id="type_of_package" class="miscellaneous_packing_slip_options_checkbox" type="checkbox" ' . esc_attr( $type_of_package ) . '  /></td>
							<td><label for="type_of_package">' . esc_html__( 'Enable “Type of package” on products', 'woocommerce-dropshipping' ) . '
							<img class="help_tip" data-tip="' . esc_attr__( 'Adds a field on the product screen and a column on the packing slip.', 'woocommerce-dropshipping' ) . '" style="margin: 0 0 0 0px;" src="' . esc_url( $woocommerce_url . 'assets/images/help.png' ) . '" height="16" width="16"></label></td>
						</tr>
					</table>
					<p></p>
					<div class="inner-toggle type_of_package" ' . $type_of_package_option . '>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					echo '<table style="margin-left:50px;">
						<tr>
							<td style="width:250px"><label for="type_of_package_conversion">' . esc_html__( 'Type of package label', 'woocommerce-dropshipping' ) . '</label></td>
							<td><img class="help_tip" data-tip="' . esc_attr__( 'Column heading for package type.', 'woocommerce-dropshipping' ) . '" src="' . esc_url( $woocommerce_url . 'assets/images/help.png' ) . '" height="16" width="16"></td>
							<td><input name="type_of_package_conversion" value="' . esc_attr( @$options['type_of_package_conversion'] ) . '" size="30" maxlength="50"/></td>
						</tr>
					</table>
					</div>';

					echo '<p class="wc-ds-settings-group__subhead">' . esc_html__( 'Store / company on the slip', 'woocommerce-dropshipping' ) . '</p>
					<table>
						<tr>
							<td style="width:250px"><label for="packing_slip_company_name" >' . esc_html__( 'Company name', 'woocommerce-dropshipping' ) . '</label></td>
							<td><img class="help_tip" data-tip="' . esc_attr__( 'Your business name on packing slips.', 'woocommerce-dropshipping' ) . '" src="' . esc_url( $woocommerce_url . 'assets/images/help.png' ) . '" height="16" width="16"></td>
							<td><input name="packing_slip_company_name" value="' . esc_attr( @$options['packing_slip_company_name'] ) . '" style="width: 30ch;" /></td>
						</tr>
					</table>
					<p></p>
					<div class="inner-toggle">
						<table style="margin-left:50px;">
							<tr>
								<td><label for="dropship_company_address">' . esc_html__( 'Company address label', 'woocommerce-dropshipping' ) . '</label></td>
								<td><img class="help_tip" data-tip="' . esc_attr__( 'Column heading for company address.', 'woocommerce-dropshipping' ) . '" src="' . esc_url( $woocommerce_url . 'assets/images/help.png' ) . '" height="16" width="16"></td>
								<td><input name="dropship_company_address" value="' . esc_attr( @$options['dropship_company_address'] ) . '" style="width: 30ch;" /></td>
							</tr>
						</table>
					</div>
					<p></p>
					<table>
						<tr>
							<td style="width:250px"><label for="packing_slip_address" >' . esc_html__( 'Address', 'woocommerce-dropshipping' ) . '</label></td>
							<td><img class="help_tip" data-tip="' . esc_attr__( 'Mailing address shown on packing slips.', 'woocommerce-dropshipping' ) . '" src="' . esc_url( $woocommerce_url . 'assets/images/help.png' ) . '" height="16" width="16"></td>
							<td><textarea name="packing_slip_address" maxlength="200" rows="5" style="width: 30ch; border: 1px solid #8c8f9454;">' . esc_attr( @$options['packing_slip_address'] ) . '</textarea></td>
						</tr>
					</table>
					<p></p>
					<table>
						<tr>
							<td style="width:250px"><label for="packing_slip_customer_service_email" >' . esc_html__( 'Customer service email', 'woocommerce-dropshipping' ) . '</label></td>
							<td><img class="help_tip" data-tip="' . esc_attr__( 'Email address for customer support.', 'woocommerce-dropshipping' ) . '" src="' . esc_url( $woocommerce_url . 'assets/images/help.png' ) . '" height="16" width="16"></td>
							<td><input name="packing_slip_customer_service_email" value="' . esc_attr( @$options['packing_slip_customer_service_email'] ) . '" style="width: 30ch;" /></td>
						</tr>
					</table>
					<p></p>
					<table>
						<tr>
							<td style="width:250px"><label for="packing_slip_customer_service_phone">' . esc_html__( 'Customer service phone', 'woocommerce-dropshipping' ) . '</label></td>
							<td><img class="help_tip" data-tip="' . esc_attr__( 'Phone number for customer support.', 'woocommerce-dropshipping' ) . '" src="' . esc_url( $woocommerce_url . 'assets/images/help.png' ) . '" height="16" width="16"></td>
							<td><input name="packing_slip_customer_service_phone" value="' . esc_attr( @$options['packing_slip_customer_service_phone'] ) . '" style="width: 30ch;" /></td>
						</tr>
					</table>

					<p class="wc-ds-settings-group__subhead">' . esc_html__( 'Footer', 'woocommerce-dropshipping' ) . '</p>
					<p class="description">' . esc_html__( 'Maximum 200 characters. Keep footer text short so it fits at the bottom of the PDF.', 'woocommerce-dropshipping' ) . '</p>
					<table>
						<tr>
							<td style="width:150px"><label for="dropship_additional_comment" >' . esc_html__( 'Additional footer text', 'woocommerce-dropshipping' ) . '</label></td>
							<td><img class="help_tip" data-tip="' . esc_attr__( 'Optional extra text in the footer.', 'woocommerce-dropshipping' ) . '" src="' . esc_url( $woocommerce_url . 'assets/images/help.png' ) . '" height="16" width="16"></td>
							<td><textarea name="dropship_additional_comment" maxlength="200" rows="5" cols="30">' . esc_textarea( $additionalCommentDefault ) . '</textarea></td>
						</tr>
					</table>
					<p></p>
					<table>
						<tr>
							<td style="width:150px"><label for="packing_slip_thankyou">' . esc_html__( 'Thank you message', 'woocommerce-dropshipping' ) . '</label></td>
							<td><img class="help_tip" data-tip="' . esc_attr__( 'Closing message at the bottom of the packing slip.', 'woocommerce-dropshipping' ) . '" src="' . esc_url( $woocommerce_url . 'assets/images/help.png' ) . '" height="16" width="16"></td>
							<td><textarea name="packing_slip_thankyou" maxlength="200" rows="5" cols="30">' . esc_attr( @$options['packing_slip_thankyou'] ) . '</textarea></td>
						</tr>
					</table>
					</section>';

					echo '<section class="wc-ds-settings-group wc-ds-settings-group--packing packing-slip-sections" aria-labelledby="wc-ds-pack-h-pricing">
					<h4 id="wc-ds-pack-h-pricing" class="wc-ds-settings-group__title">' . esc_html__( 'Pricing visibility', 'woocommerce-dropshipping' ) . '</h4>
					<p class="wc-ds-settings-group__description description">' . esc_html__( 'Line prices, totals, tax, and shipping amounts on the packing slip and in supplier-facing messages.', 'woocommerce-dropshipping' ) . '</p>

					<table>
						<tr>
							<td><input name="product_price" id="product_price" data-id="product_price" class="miscellaneous_packing_slip_options_checkbox" type="checkbox" ' . esc_attr( $price_product ) . '  /></td>
							<td><label for="product_price">' . esc_html__( 'Show product prices', 'woocommerce-dropshipping' ) . '</label></td>
						</tr>
					</table>
					<p></p>
					<div class="inner-toggle product_price" ' . $product_price_option . '>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					echo '<table style="margin-left:50px;">
						<tr>
							<td style="width:250px"><label for="dropship_price">' . esc_html__( 'Price column label', 'woocommerce-dropshipping' ) . '</label></td>
							<td><img class="help_tip" data-tip="' . esc_attr__( 'Column heading for price.', 'woocommerce-dropshipping' ) . '" src="' . esc_url( $woocommerce_url . 'assets/images/help.png' ) . '" height="16" width="16"></td>
							<td><input name="dropship_price" value="' . esc_attr( @$options['dropship_price'] ) . '" size="30" maxlength="50" /></td>
						</tr>
					</table>
					</div>';

					echo '<p></p>
					<table>
						<tr>
							<td><input name="cost_of_goods" id="cost_of_goods" class="miscellaneous_packing_slip_options_checkbox" type="checkbox" ' . esc_attr( $cost_of_goods ) . '  /></td>
							<td><label for="cost_of_goods">' . esc_html__( 'Show cost price instead of selling price', 'woocommerce-dropshipping' ) . '</label></td>
						</tr>
					</table>
					<p></p>
					<table>
						<tr>
							<td><input name="show_gst_supplier_email" id="show_gst_supplier_email" class="miscellaneous_packing_slip_options_checkbox" type="checkbox" ' . esc_attr( $show_gst_supplier_email ) . '  /></td>
							<td><label for="show_gst_supplier_email">' . esc_html__( 'Show tax breakdown', 'woocommerce-dropshipping' ) . '</label></td>
						</tr>
					</table>
					<p></p>
					<table>
						<tr>
							<td><input name="total_price" id="total_price" class="miscellaneous_packing_slip_options_checkbox" type="checkbox" ' . esc_attr( $total_price ) . '  /></td>
							<td><label for="total_price">' . esc_html__( 'Show order total on packing slip', 'woocommerce-dropshipping' ) . '</label></td>
						</tr>
					</table>
					<p></p>
					<table>
						<tr>
							<td><input name="hide_shipping_price" id="hide_shipping_price" class="miscellaneous_packing_slip_options_checkbox" type="checkbox" ' . esc_attr( $hide_shipping_price ) . '  /></td>
							<td><label for="hide_shipping_price">' . esc_html__( 'Hide shipping cost on packing slip', 'woocommerce-dropshipping' ) . '</label></td>
						</tr>
					</table>
					<p></p>
					<table>
						<tr>
							<td><input name="hide_tax" id="hide_tax" class="miscellaneous_packing_slip_options_checkbox" type="checkbox" ' . esc_attr( $hide_tax ) . '  /></td>
							<td><label for="hide_tax">' . esc_html__( 'Hide tax in supplier email and packing slip', 'woocommerce-dropshipping' ) . '</label></td>
						</tr>
					</table>
					</section>';

					echo '<section class="wc-ds-settings-group wc-ds-settings-group--packing packing-slip-sections" aria-labelledby="wc-ds-pack-h-customer">
					<h4 id="wc-ds-pack-h-customer" class="wc-ds-settings-group__title">' . esc_html__( 'Customer details', 'woocommerce-dropshipping' ) . '</h4>
					<p class="wc-ds-settings-group__description description">' . esc_html__( 'Shipping and billing blocks, contact fields, and privacy options for the end customer.', 'woocommerce-dropshipping' ) . '</p>

					<table>
						<tr>
							<td><input name="shipping_address" id="shipping_address" data-id="shipping_address" class="miscellaneous_packing_slip_options_checkbox" type="checkbox" ' . esc_attr( $address_shipping ) . '  /></td>
							<td><label for="shipping_address">' . esc_html__( 'Show shipping address at bottom', 'woocommerce-dropshipping' ) . '</label></td>
						</tr>
					</table>
					<p></p>
					<div class="inner-toggle shipping_address" ' . $shipping_address_option . '>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					echo '<table style="margin-left:50px;">
						<tr>
							<td style="width:150px"><label for="dropship_shipping_address_email">' . esc_html__( 'Shipping address label', 'woocommerce-dropshipping' ) . '</label></td>
							<td><img class="help_tip" data-tip="' . esc_attr__( 'Column heading for shipping address.', 'woocommerce-dropshipping' ) . '" src="' . esc_url( $woocommerce_url . 'assets/images/help.png' ) . '" height="16" width="16"></td>
							<td><input name="dropship_shipping_address_email" value="' . esc_attr( @$options['dropship_shipping_address_email'] ) . '" size="30" maxlength="50" /></td>
						</tr>
					</table>
					</div>';

					echo '<p></p>
					<table>
						<tr>
							<td><input name="billing_address" id="billing_address" data-id="billing_address" class="miscellaneous_packing_slip_options_checkbox" type="checkbox" ' . esc_attr( $address_billing ) . '  /></td>
							<td><label for="billing_address">' . esc_html__( 'Show billing address at bottom', 'woocommerce-dropshipping' ) . '</label></td>
						</tr>
					</table>
					<p></p>
					<div class="inner-toggle billing_address" ' . $billing_address_option . '>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					echo '<table style="margin-left:50px;">
						<tr>
							<td style="width:150px"><label for="dropship_billing_address_email">' . esc_html__( 'Billing address label', 'woocommerce-dropshipping' ) . '</label></td>
							<td><img class="help_tip" data-tip="' . esc_attr__( 'Column heading for billing address.', 'woocommerce-dropshipping' ) . '" src="' . esc_url( $woocommerce_url . 'assets/images/help.png' ) . '" height="16" width="16"></td>
							<td><input name="dropship_billing_address_email" value="' . esc_attr( @$options['dropship_billing_address_email'] ) . '" size="30" maxlength="50"/></td>
						</tr>
					</table>
					</div>';

					echo '<p></p>
					<table>
						<tr>
							<td><input type="checkbox" name="billing_phone" id="billing_phone" class="miscellaneous_packing_slip_options_checkbox_false"  value="1" tabIndex="1" onClick="ckChange(this)" ' . $billing_phone . '></td>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					echo '<td><label for="billing_phone">' . esc_html__( 'Include customer phone on packing slip', 'woocommerce-dropshipping' ) . '</label></td>
						</tr>
					</table>
					<p></p>
					<table>
						<tr>
							<td><input name="customer_email" id="customer_email" class="miscellaneous_packing_slip_options_checkbox_false" type="checkbox" ' . esc_attr( $customer_email ) . '  /></td>
							<td><label for="customer_email">' . esc_html__( 'Include customer email on packing slip', 'woocommerce-dropshipping' ) . '</label></td>
						</tr>
					</table>
					<p></p>
					<table>
						<tr>
							<td><input type="checkbox" name="hide_client_info_Suppliers" id="hide_client_info_Suppliers" class="miscellaneous_packing_slip_options_checkbox_false hide_client_info_Suppliers" tabIndex="1" onClick="ckChange(this)" ' . $hide_client_info_Suppliers . '></td> '; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					echo '<td><label for="hide_client_info_Suppliers">' . esc_html__( 'Hide customer details on packing slips, order emails, and the supplier dashboard', 'woocommerce-dropshipping' ) . '</label></td>
						</tr>
					</table>
					<p></p>
					<table>
						<tr>
							<td><input type="checkbox" name="hide_contact_info_Suppliers" id="hide_contact_info_Suppliers" class="miscellaneous_packing_slip_options_checkbox_false"  value="1" tabIndex="1" onClick="ckChange(this)" ' . $hide_contact_info_Suppliers . '></td>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					echo '<td><label for="hide_contact_info_Suppliers">' . esc_html__( 'Hide customer contact details on packing slips, order emails, and the supplier dashboard', 'woocommerce-dropshipping' ) . '</label></td>
						</tr>
					</table>';

					if ( $hide_client_info_Suppliers == ' checked="checked" ' ) {
						echo '<p></p>
						<table>
							<tr>
								<td><input name="store_add_shipping_add" id="store_add_shipping_add" class="miscellaneous_packing_slip_options_checkbox_false store_add_shipping_add" type="checkbox" value="1" tabIndex="1" onClick="ckChange(this)" ' . $store_add_shipping_add . ' disabled= "true"/></td>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
						echo '<td><label for="store_add_shipping_add" disabled= "true">' . esc_html__( 'Use store address as shipping address in supplier order list', 'woocommerce-dropshipping' ) . '</label></td>
							</tr>
						</table>';
					} else {
						echo '<p></p>
						<table>
							<tr>
								<td><input name="store_add_shipping_add" id="store_add_shipping_add" class="miscellaneous_packing_slip_options_checkbox_false store_add_shipping_add" type="checkbox" value="1" tabIndex="1" onClick="ckChange(this)" ' . $store_add_shipping_add . ' /></td>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
						echo '<td><label for="store_add_shipping_add">' . esc_html__( 'Use store address as shipping address in supplier order list', 'woocommerce-dropshipping' ) . '</label></td>
							</tr>
						</table>';
					}

					echo '</section>';

					echo '<section class="wc-ds-settings-group wc-ds-settings-group--packing packing-slip-sections" aria-labelledby="wc-ds-pack-h-supplier">
					<h4 id="wc-ds-pack-h-supplier" class="wc-ds-settings-group__title">' . esc_html__( 'Supplier visibility', 'woocommerce-dropshipping' ) . '</h4>
					<p class="wc-ds-settings-group__description description">' . esc_html__( 'Control how supplier names and payment details appear to shoppers and in order views.', 'woocommerce-dropshipping' ) . '</p>

					<table>
						<tr>
							<td><input name="hide_suppliername_on_product_page" id="hide_suppliername_on_product_page" class="miscellaneous_packing_slip_options_checkbox_false" type="checkbox" ' . esc_attr( $hide_suppliername_on_product_page ) . '  /></td>
							<td><label for="hide_suppliername_on_product_page">' . esc_html__( 'Hide supplier names on product pages', 'woocommerce-dropshipping' ) . '</label></td>
						</tr>
					</table>
					<p></p>
					<table>
						<tr>
							<td><input name="hideorderdetail_suppliername" id="hideorderdetail_suppliername" class="miscellaneous_packing_slip_options_checkbox" type="checkbox" ' . esc_attr( $suppliername_hideorderdetail ) . '  /></td>
							<td><label for="hideorderdetail_suppliername">' . esc_html__( 'Hide supplier names on order details', 'woocommerce-dropshipping' ) . '</label></td>
						</tr>
					</table>
					<p></p>
					<table>
						<tr>
							<td><input name="show_pay_type" id="show_pay_type" class="miscellaneous_packing_slip_options_checkbox_false" type="checkbox" ' . esc_attr( $show_pay_type ) . '  /></td>
							<td><label for="show_pay_type">' . esc_html__( 'Show payment type in supplier emails', 'woocommerce-dropshipping' ) . '</label></td>
						</tr>
					</table>
					</section>';

					echo '<section class="wc-ds-settings-group wc-ds-settings-group--packing packing-slip-sections" aria-labelledby="wc-ds-pack-h-notify">
					<h4 id="wc-ds-pack-h-notify" class="wc-ds-settings-group__title">' . esc_html__( 'Notifications and follow-up actions', 'woocommerce-dropshipping' ) . '</h4>
					<p class="wc-ds-settings-group__description description">' . esc_html__( 'Supplier emails, optional tracking when messages are opened, and workflow shortcuts.', 'woocommerce-dropshipping' ) . '</p>

					<table>
						<tr>
							<td><input name="supp_notification" id="supp_notification" type="checkbox" ' . esc_attr($supp_notification_attr) . ' /></td>
							<td><label for="supp_notification">' . esc_html__( 'Disable supplier email notifications', 'woocommerce-dropshipping' ) . '</label></td>
						</tr>
					</table>
					<p class="description">' . esc_html__( 'When this option is checked, your store stops sending automatic new-order emails to suppliers. PDF and CSV attachments above only apply when those emails are sent.', 'woocommerce-dropshipping' ) . '</p>
					<p></p>

					<table>
						<tr>
							<td><input name="allow_manual_supplier_notification" id="allow_manual_supplier_notification" type="checkbox" ' . esc_attr($allow_manual_supplier_attr) . ' /></td>

							<td><label for="allow_manual_supplier_notification">' . esc_html__('Allow manual supplier notifications when automatic notifications are disabled', 'woocommerce-dropshipping') . '</label></td>
						</tr>
					</table>
					<p>' . esc_html__('Allow the "Resend Notifications to Dropshipping Suppliers" order action to send emails even when automatic supplier notifications are disabled.', 'woocommerce-dropshipping') . '</p>

					<table>
						<tr>
							<td><input name="complete_email" id="complete_email" class="miscellaneous_packing_slip_options_checkbox" type="checkbox" ' . esc_attr( $email_complete ) . '  /></td>
							<td><label for="complete_email">' . esc_html__( 'Email supplier again when order is completed', 'woocommerce-dropshipping' ) . '</label></td>
						</tr>
					</table>
					<p></p>
					<table>
						<tr>
							<td><input name="order_complete_link" id="order_complete_link" class="miscellaneous_packing_slip_options_checkbox_false" type="checkbox" ' . esc_attr( $link_complete_order ) . '  /></td>
							<td><label for="order_complete_link">' . esc_html__( 'Let suppliers mark orders shipped via email link (no login)', 'woocommerce-dropshipping' ) . '</label></td>
						</tr>
					</table>
					<p></p>
					<table>
						<tr>
							<td><input name="email_supplier" id="email_supplier" class="miscellaneous_packing_slip_options_checkbox_false" type="checkbox" ' . esc_attr( $supplier_email ) . '  /></td>
							<td><label for="email_supplier">' . esc_html__( 'Email registration details when a new supplier is created', 'woocommerce-dropshipping' ) . '</label></td>
						</tr>
					</table>
					<p></p>
					<table>
						<tr>
							<td><input name="cnf_mail" id="cnf_mail" class="miscellaneous_packing_slip_options_checkbox_false" type="checkbox" ' . esc_attr( $cnf_mail ) . '  /></td>
							<td><label for="cnf_mail">
							<img class="help_tip" data-tip="' . esc_attr__( 'Notifies your store when a supplier opens a supplier order email.', 'woocommerce-dropshipping' ) . '" style="margin: 0 0 0 0px;" src="' . esc_url( $woocommerce_url . 'assets/images/help.png' ) . '" height="16" width="16">
							' . esc_html__( 'Notify when suppliers open order notification emails', 'woocommerce-dropshipping' ) . '
							</label></td>
						</tr>
					</table>
					<p></p>
					<table>
						<tr>
							<td><input name="std_mail" id="std_mail" class="miscellaneous_packing_slip_options_checkbox" type="checkbox" ' . esc_attr( $std_mail ) . '  /></td>
							<td><label for="std_mail">' . esc_html__( 'Use default WooCommerce email layout for supplier notifications', 'woocommerce-dropshipping' ) . '</label></td>
						</tr>
					</table>
					<p></p>
					<table>
						<tr>
							<td><input name="cc_mail" id="cc_mail" class="miscellaneous_packing_slip_options_checkbox_false" type="checkbox" ' . esc_attr( $cc_mail ) . '  /></td>
							<td><label for="cc_mail">' . esc_html__( 'Do not CC the store admin on supplier order emails', 'woocommerce-dropshipping' ) . '</label></td>
						</tr>
					</table>
					</section>';

					echo '<section class="wc-ds-settings-group wc-ds-settings-group--packing packing-slip-sections" aria-labelledby="wc-ds-pack-h-advanced">
					<h4 id="wc-ds-pack-h-advanced" class="wc-ds-settings-group__title">' . esc_html__( 'Advanced options', 'woocommerce-dropshipping' ) . '</h4>
					<p class="wc-ds-settings-group__description description">' . esc_html__( 'Checkout and other settings that affect more than the packing slip alone.', 'woocommerce-dropshipping' ) . '</p>

					<table>
						<tr>
							<td><input name="checkout_order_number" id="checkout_order_number" class="miscellaneous_packing_slip_options_checkbox_false" type="checkbox" ' . esc_attr( $checkout_order_number ) . '  /></td>
							<td><label for="checkout_order_number">' . esc_html__( 'Show order number field at checkout', 'woocommerce-dropshipping' ) . '</label></td>
						</tr>
					</table>
					</section>';

					echo '</div>';