/**
 * Dropshipping settings tabs: persist active tab, default to Overview when appropriate,
 * jump links from Overview checklist, ARIA for tablist / tabpanels.
 */
(function ($) {
	'use strict';

	/**
	 * Price calculator panel styling (moved from myscript.js for load-order safety).
	 *
	 * @param {string} tabId
	 */
	window.wcDsApplyPriceCalculatorTabStyles = function (tabId) {
		if (tabId === 'price_calculator_options') {
			$('head').append('<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">');
			$('.packing-slip-sections h4').css('top', '-15px');
			$('h3').css('font-size', '1.3rem');
			$('body').css('color', '#3c434a');
			$('body').css('background-color', '#f0f0f1');
			$('body').css('font-size', '13px');
			$('body').css('font-family', '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif');
			$('table').css('border-collapse', 'initial');
			$('.form-table .mappingBlocks td').css('padding', '5px 25px');
			$('.btn').css('padding', '4px');
			$('.btn').css('font-size', '13px');
			$('label').css('margin-bottom', '0');
		} else {
			$('link[href*="bootstrap.min.css"]').attr('disabled', 'true');
			$('.packing-slip-sections h4').css('top', '-35px');
			$('h3').css('font-size', '');
			$('.form-table td').css('padding', '');
			$('body').css('color', '');
			$('body').css('background-color', '');
			$('body').css('font-size', '');
			$('body').css('font-family', '');
			$('table').css('border-collapse', '');
			$('.btn').css('font-size', '');
			$('.btn').css('padding', '');
			$('label').css('margin-bottom', '');
		}
	};
})(jQuery);

(function ($) {
	'use strict';

	/**
	 * WooCommerce core registers a beforeunload / leave warning when it believes the
	 * settings form changed. In-page Dropshipping tab switches do not navigate away, but
	 * extensions/scripts can leave the "dirty" flag set. We only clear unload handlers when
	 * the main WC settings form serialize still matches the baseline (no real edits).
	 */
	var initialFormSnapshot = null;

	function wcDsGetSettingsForm() {
		var $f = $('form#mainform, form#wc-settings-form, form.woocommerce-settings-form').first();
		if (!$f.length) {
			$f = $('form[action*="options.php"]').first();
		}
		return $f;
	}

	function wcDsCaptureFormBaseline() {
		var $f = wcDsGetSettingsForm();
		if (!$f.length) {
			return;
		}
		try {
			initialFormSnapshot = $f.serialize();
		} catch (e) {
			initialFormSnapshot = null;
		}
	}

	function wcDsMaybeClearWooUnloadIfPristine() {
		if (initialFormSnapshot === null) {
			return;
		}
		var $f = wcDsGetSettingsForm();
		if (!$f.length) {
			return;
		}
		var current;
		try {
			current = $f.serialize();
		} catch (e) {
			return;
		}
		if (current !== initialFormSnapshot) {
			return;
		}
		$(window).off('beforeunload');
		window.onbeforeunload = null;
	}

	function wcDsUpdateUnsavedHint() {
		var $hint = $('#wc-ds-unsaved-hint');
		if (!$hint.length || initialFormSnapshot === null) {
			return;
		}
		var $f = wcDsGetSettingsForm();
		if (!$f.length) {
			return;
		}
		var dirty;
		try {
			dirty = $f.serialize() !== initialFormSnapshot;
		} catch (e) {
			return;
		}
		if (dirty) {
			$hint.removeAttr('hidden').show();
		} else {
			$hint.attr('hidden', 'hidden').hide();
		}
	}

	/**
	 * Move WooCommerce’s default p.submit into the sticky save bar (same form, same button — no duplicate POST).
	 */
	function wcDsRelocateSaveButton() {
		var $slot = $('#wc-ds-save-bar-slot');
		if (!$slot.length || $slot.children().length) {
			return;
		}
		var $form = wcDsGetSettingsForm();
		if (!$form.length) {
			return;
		}
		var $submit = $form.find('p.submit').last();
		if (!$submit.length) {
			$submit = $('p.submit')
				.filter(function () {
					return $(this).find('.woocommerce-save-button').length > 0;
				})
				.last();
		}
		if ($submit.length) {
			$submit.appendTo($slot);
		}
	}

	var STORAGE_KEY = 'activeTab';
	var LEGACY_TAB_MAP = {
		general_settings: 'general_settings',
		supplier_email_notifications: 'supplier_email_notifications',
		packing_slips: 'packing_slips',
		customised_supplier_emails: 'customised_supplier_emails',
		smtp_options: 'smtp_options',
		price_calculator_options: 'price_calculator_options'
	};

	function tabIdToLiId(tabId) {
		if (tabId === 'price_calculator_options') {
			return 'prices_cal';
		}
		return 'wc-ds-tab-' + tabId;
	}

	function wcDsGetGuidedSteps() {
		if (typeof window.wcDsGuidedNav === 'undefined' || !window.wcDsGuidedNav.steps) {
			return [];
		}
		return window.wcDsGuidedNav.steps;
	}

	function wcDsGuidedStepIndex(tabId) {
		var steps = wcDsGetGuidedSteps();
		for (var i = 0; i < steps.length; i++) {
			if (steps[i].id === tabId) {
				return i;
			}
		}
		return -1;
	}

	function updateGuidedNav(tabId) {
		var steps = wcDsGetGuidedSteps();
		var $nav = $('#wc-ds-guided-nav');
		if (!$nav.length) {
			return;
		}
		if (!steps.length) {
			$nav.attr('hidden', 'hidden');
			return;
		}
		var idx = wcDsGuidedStepIndex(tabId);
		if (idx < 0) {
			$nav.attr('hidden', 'hidden');
			return;
		}
		$nav.removeAttr('hidden');
		var total = steps.length;
		var i18n = window.wcDsGuidedNav.i18n || {};
		var progressTpl = i18n.stepProgress || 'Step %1$s of %2$s';
		var label = steps[idx].label || '';
		var progressText = progressTpl.replace('%1$s', String(idx + 1)).replace('%2$s', String(total));
		$('#wc-ds-guided-progress').text(progressText);
		$('#wc-ds-guided-title').text(label);
		$('#wc-ds-guided-back').prop('disabled', idx === 0);
		$('#wc-ds-guided-next').prop('disabled', idx >= total - 1);
	}

	function activateTab(tabId) {
		var $tabs = $('.wc-dropship-setting-tabs li[role="tab"]');
		var $panels = $('#wc-ds-settings-root .drop-setting-section');

		$tabs.removeClass('active').attr('aria-selected', 'false').attr('tabindex', '-1');
		$('[data-id="' + tabId + '"]').addClass('active').attr('aria-selected', 'true').attr('tabindex', '0');

		$panels.removeClass('active').attr('aria-hidden', 'true');
		$('#' + tabId).addClass('active').attr('aria-hidden', 'false');

		try {
			localStorage.setItem(STORAGE_KEY, tabId);
		} catch (e) {
			// Private mode / quota.
		}
		if (typeof window.wcDsApplyPriceCalculatorTabStyles === 'function') {
			window.wcDsApplyPriceCalculatorTabStyles(tabId);
		}
		wcDsMaybeClearWooUnloadIfPristine();
		wcDsUpdateUnsavedHint();
		updateGuidedNav(tabId);
	}

	function migrateStoredTab(stored) {
		if (!stored) {
			return null;
		}
		if ($('#' + stored).length) {
			return stored;
		}
		if (LEGACY_TAB_MAP[stored]) {
			return LEGACY_TAB_MAP[stored];
		}
		return 'overview';
	}

	$(function () {
		var $tabs = $('.wc-dropship-setting-tabs li');
		if (!$tabs.length) {
			return;
		}

		$('#wc-ds-settings-root .drop-setting-section').each(function () {
			var $panel = $(this);
			var pid = $panel.attr('id');
			$panel.attr('role', 'tabpanel');
			if (pid) {
				var labelId = pid === 'price_calculator_options' ? 'prices_cal' : 'wc-ds-tab-' + pid;
				$panel.attr('aria-labelledby', labelId);
			}
			$panel.attr('aria-hidden', $panel.hasClass('active') ? 'false' : 'true');
		});

		$('.wc-dropship-setting-tabs li[role="tab"]').each(function () {
			var $t = $(this);
			$t.attr('aria-selected', $t.hasClass('active') ? 'true' : 'false');
			$t.attr('tabindex', $t.hasClass('active') ? '0' : '-1');
		});

		function getQuerySubTab() {
			try {
				var p = new URLSearchParams(window.location.search);
				return p.get('wc_ds_tab');
			} catch (e) {
				return null;
			}
		}

		function stripQuerySubTab() {
			if (!window.history || !window.history.replaceState) {
				return;
			}
			try {
				var u = new URL(window.location.href);
				if (!u.searchParams.has('wc_ds_tab')) {
					return;
				}
				u.searchParams.delete('wc_ds_tab');
				window.history.replaceState(null, '', u.pathname + u.search + u.hash);
			} catch (e) {
				// IE or restricted environments.
			}
		}

		var defaultOverview = $('.wc-ds-overview').data('defaultTab') === 'overview';
		var stored = null;
		try {
			stored = localStorage.getItem(STORAGE_KEY);
		} catch (e) {
			stored = null;
		}

		stored = migrateStoredTab(stored);

		var forcedTab = getQuerySubTab();
		if (forcedTab && $('#' + forcedTab).length) {
			activateTab(forcedTab);
			try {
				localStorage.setItem(STORAGE_KEY, forcedTab);
			} catch (e) {
				// Private mode / quota.
			}
			stripQuerySubTab();
		} else if (defaultOverview && (!stored || stored === 'general_settings')) {
			activateTab('overview');
		} else if (stored && $('#' + stored).length) {
			activateTab(stored);
		} else {
			var fallbackActive = $('.wc-dropship-setting-tabs li.active').data('id');
			if (fallbackActive) {
				updateGuidedNav(fallbackActive);
			}
		}

		wcDsCaptureFormBaseline();
		setTimeout(wcDsCaptureFormBaseline, 0);
		setTimeout(wcDsCaptureFormBaseline, 300);
		setTimeout(function () {
			wcDsMaybeClearWooUnloadIfPristine();
		}, 350);

		wcDsRelocateSaveButton();
		setTimeout(wcDsRelocateSaveButton, 0);
		setTimeout(wcDsRelocateSaveButton, 100);
		setTimeout(wcDsRelocateSaveButton, 400);

		var $mainForm = wcDsGetSettingsForm();
		if ($mainForm.length) {
			$mainForm.on('change input', ':input', function () {
				wcDsUpdateUnsavedHint();
			});
		}
		setTimeout(function () {
			wcDsUpdateUnsavedHint();
		}, 400);

		$tabs.on('click', function () {
			var tabId = $(this).data('id');
			if (tabId) {
				activateTab(tabId);
			}
		});

		$tabs.on('keydown', function (e) {
			var keys = [37, 38, 39, 40, 36, 35];
			if (keys.indexOf(e.keyCode) === -1) {
				return;
			}
			var $items = $('.wc-dropship-setting-tabs li[role="tab"]');
			var idx = $items.index(this);
			var next = idx;
			if (e.keyCode === 39 || e.keyCode === 40) {
				next = (idx + 1) % $items.length;
			} else if (e.keyCode === 37 || e.keyCode === 38) {
				next = (idx - 1 + $items.length) % $items.length;
			} else if (e.keyCode === 36) {
				next = 0;
			} else if (e.keyCode === 35) {
				next = $items.length - 1;
			}
			if (next !== idx) {
				e.preventDefault();
				var $next = $items.eq(next);
				var tid = $next.data('id');
				if (tid) {
					activateTab(tid);
					$next.trigger('focus');
				}
			}
		});

		$(document).on('click', '.wc-ds-goto-tab', function (e) {
			e.preventDefault();
			var tabId = $(this).data('tab');
			if (tabId) {
				activateTab(tabId);
				var liId = tabIdToLiId(tabId);
				var $li = $('#' + liId);
				if ($li.length) {
					$li.trigger('focus');
				}
			}
		});

		$('#wc-ds-guided-back').on('click', function () {
			var steps = wcDsGetGuidedSteps();
			var cur = $('.wc-dropship-setting-tabs li.active').data('id');
			var idx = wcDsGuidedStepIndex(cur);
			if (idx > 0 && steps[idx - 1]) {
				var prevId = steps[idx - 1].id;
				activateTab(prevId);
				$('#' + tabIdToLiId(prevId)).trigger('focus');
			}
		});

		$('#wc-ds-guided-next').on('click', function () {
			var steps = wcDsGetGuidedSteps();
			var cur = $('.wc-dropship-setting-tabs li.active').data('id');
			var idx = wcDsGuidedStepIndex(cur);
			if (idx >= 0 && idx < steps.length - 1 && steps[idx + 1]) {
				var nextId = steps[idx + 1].id;
				activateTab(nextId);
				$('#' + tabIdToLiId(nextId)).trigger('focus');
			}
		});
	});
})(jQuery);
