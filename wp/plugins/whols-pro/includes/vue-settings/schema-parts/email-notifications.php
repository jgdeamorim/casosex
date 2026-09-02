<?php
return ['email-notifications_route' => [
    'title' => __('Email Notifications', 'whols'),
    'texts' => [
        'admin_email_notifications' => __('Admin - Email Notifications', 'whols'),
        'customer_email_notifications' => __('Customer - Email Notifications', 'whols'),
        'registration_notification' => __('Registration - New Request', 'whols'),
        'quote_request' => __('Request a Quote - New Quote Request', 'whols'),
        'conversation' => __('Conversation - New Conversation Created', 'whols'),
        'registration_confirmation' => __('Registration - Confirmation', 'whols'),
        'account_approval' => __('Registration - Approval', 'whols'),
        'account_rejection' => __('Registration - Rejection', 'whols'),
        'conversation_new_message_for_user' => __('Conversation - New Message/Reply', 'whols'),
        'conversation_new_message_for_admin' => __('Conversation - New Message/Reply', 'whols'),
        'wallet_credit_email' => __('Wallet - Credit', 'whols'),
        'wallet_debit_email' => __('Wallet - Debit', 'whols'),
    ],
    'sections' => [],
    'fields' => [
        // Admin - Email Notifications
        'enable_registration_notification_for_admin' => [
            'id' => 'enable_registration_notification_for_admin',
            'type' => 'switch',
            'title' => __('Enable', 'whols'),
            'label' => __('Yes', 'whols'),
            'help' => __('If Enabled, The site admin will get an email about the new wholesaler registration request.', 'whols'),
            'default' => '0'
        ],
        'registration_notification_recipients' => [
            'id' => 'registration_notification_recipients',
            'type' => 'text',
            'title' => __('Email Recipients', 'whols'),
            'help' => __('Specify email addresses that should receive new wholesaler notifications. <br>• Multiple emails can be separated by commas. <br>• Admin email will be used if left empty.', 'whols'),
            'default' => '',
        ],
        'registration_notification_subject_for_admin' => [
            'id' => 'registration_notification_subject_for_admin',
            'type' => 'text',
            'title' => __('Email Subject', 'whols'),
            'help' => __('Specify the email subject.', 'whols'),
            'desc' => __('Use <span class="whols-available-placeholders-btn">Available Placeholders</span> to get dynamic content.', 'whols'),
            'default' => __('[{site_title}] New Wholesaler Registration Request from {name} ', 'whols')
        ],
        'registration_notification_message_for_admin' => [
            'id' => 'registration_notification_message_for_admin',
            'type' => 'wp_editor',
            'title' => __('Message', 'whols'),
            'label_position' => 'top',
            'help' => __('Specify the email message.', 'whols'),
            'desc' => __('Available placeholders: {name}, {email}, {date}, {time}, {reject_link}, {role_approval_links}.<br>For multi-role pricing, you can also use {approve_link_ROLE_SLUG} for specific role approval links.<br>For single-role pricing, you can use {approve_link} for the default role approval link.', 'whols'),
            'default' => __('Hello Admin,

A new wholesale registration request has been submitted on your website.

Registration Details:
------------------------
Full Name: {name}
Email Address: {email}
Submission Date: {date}
Submission Time: {time}

This request requires your review. Please select a role to approve with:

{role_approval_links}

Or use this link to reject the request:
<a href="{reject_link}" style="display: inline-block; color: #f44336; font-weight: bold;">Reject Request</a>

Alternatively, you can log in to your WordPress dashboard to review this request.

Best regards,
Whols System', 'whols')
    ],

    // Request a Quote
    'enable_raq_email_notification' => [
        'id' => 'enable_raq_email_notification',
        'type' => 'switch',
        'title' => __('Enable', 'whols'),
        'label' => __('Yes', 'whols'),
        'help' => __('If enabled, the site admin will receive an email when a customer submits a request for a quote.', 'whols'),
        'default' => '0'
    ],
    'request_a_quote_email_subject' => [
        'id' => 'request_a_quote_email_subject',
        'type' => 'text',
        'title' => __('Email Subject', 'whols'),
        'desc' => __('Use <span class="whols-available-placeholders-btn">Available Placeholders</span> to get dynamic content.', 'whols'),
        'default' => '[{site_title}] New Quote Request from {name}'
    ],


    // Conversation
    'request_a_quote_email_message' => [
        'id' => 'request_a_quote_email_message',
        'type' => 'wp_editor',
        'title' => __('Message', 'whols'),
        'label_position' => 'top',
        'desc' => __('Use <span class="whols-available-placeholders-btn">Available Placeholders</span> to get dynamic content.', 'whols'),
        'default' => 'Name: {name}
Email: {email}
Subject: {subject}
Message: {message}
Products: {products}'
        ],
        'enable_conversation_email_notification' => [
            'id' => 'enable_conversation_email_notification',
            'type' => 'switch',
            'title' => __('Enable', 'whols'),
            'label' => __('Yes', 'whols'),
            'help' => __('If enabled, the site admin will receive an email when a new conversation is started.', 'whols'),
            'default' => '0'
        ],
        'conversation_start_email_subject' => [
            'id' => 'conversation_start_email_subject',
            'type' => 'text',
            'title' => __('Email Subject', 'whols'),
            'desc' => __('Use <span class="whols-available-placeholders-btn">Available Placeholders</span> to get dynamic content.', 'whols'),
            'default' => '[{site_title}] New Conversation from {name}'
        ],
        'conversation_start_email_body' => [
            'id' => 'conversation_start_email_body',
            'type' => 'wp_editor',
            'title' => __('Message', 'whols'),
            'label_position' => 'top',
            'desc' => __('Use <span class="whols-available-placeholders-btn">Available Placeholders</span> to get dynamic content.', 'whols'),
            'default' => 'Name: {name}
Email: {email}
Subject: {subject}
Message: {message}
Products: {products}'
        ],

        // Conversation New Message/Reply
        'enable_conversation_new_message_for_admin' => [
            'id' => 'enable_conversation_new_message_for_admin',
            'type' => 'switch',
            'title' => __('Enable', 'whols'),
            'label' => __('Yes', 'whols'),
            'help' => __('If enabled, the site admin will receive an email when a customer sends a new message to any conversation.', 'whols'),
            'default' => '0'
        ],
        'conversation_new_message_for_admin_subject' => [
            'id' => 'conversation_new_message_for_admin_subject',
            'type' => 'text',
            'title' => __('Email Subject', 'whols'),
            'desc' => __('Use <span class="whols-available-placeholders-btn">Available Placeholders</span> to get dynamic content.', 'whols'),
            'default' => '[{site_title}] New Message/Reply from {name}'
        ],
        'conversation_new_message_for_admin_message' => [
            'id' => 'conversation_new_message_for_admin_message',
            'type' => 'wp_editor',
            'title' => __('Message', 'whols'),
            'label_position' => 'top',
            'desc' => __('Use <span class="whols-available-placeholders-btn">Available Placeholders</span> to get dynamic content.', 'whols'),
            'default' => 'Name: {name}
Email: {email}
Subject: {subject}
Message: {message}'
        ],

        // Customer - Email Notifications
        // Registration Confirmation
        'enable_registration_notification_for_user' => [
            'id' => 'enable_registration_notification_for_user',
            'type' => 'switch',
            'title' => __('Enable', 'whols'),
            'label' => __('Yes', 'whols'),
            'help' => __('If Enabled, The registered wholesale customer will get an email about the registration.', 'whols'),
            'default' => '0'
        ],
        'registration_notification_subject_for_user' => [
            'id' => 'registration_notification_subject_for_user',
            'type' => 'text',
            'title' => __('Email Subject', 'whols'),
            'desc' => __('Use <span class="whols-available-placeholders-btn">Available Placeholders</span> to get dynamic content.', 'whols'),
            'default' => __('[{site_title}] Welcome - Your Wholesale Account Registration', 'whols')
        ],
        'registration_notification_message_for_user' => [
            'id' => 'registration_notification_message_for_user',
            'type' => 'wp_editor',
            'title' => __(' Message', 'whols'),
            'label_position' => 'top',
            'desc' => __('Use <span class="whols-available-placeholders-btn">Available Placeholders</span> to get dynamic content.', 'whols'),
            'default' => __('Hi {name},

Thanks for registering with {site_title}. Your wholesale account request is under review.

Details:
Email: {email}
Date: {date}

We\'ll notify you once your account is approved.

Regards,
{site_title}', 'whols')
        ],

        // Account Approval
        'enable_approved_notification' => [
            'id' => 'enable_approved_notification',
            'type' => 'switch',
            'title' => __('Enable', 'whols'),
            'label' => __('Yes', 'whols'),
            'help' => __('If Enabled, The registered wholesale customer will get an email if the wholesaler request is approved.', 'whols'),
            'default' => '0',
            'class' => 'whols-pro-field-opacity'
        ],
        'approved_email_subject' => [
            'id' => 'approved_email_subject',
            'type' => 'text',
            'title' => __('Email Subject', 'whols'),
            'default' => __('[{site_title}] Your Wholesale Account Request is Approved', 'whols'),
            'desc' => __('Use <span class="whols-available-placeholders-btn">Available Placeholders</span> to get dynamic content.', 'whols'),
            'class' => 'whols-pro-field-opacity'
        ],
        'approved_email_message' => [
            'id' => 'approved_email_message',
            'type' => 'wp_editor',
            'title' => __('Message', 'whols'),
            'label_position' => 'top',
            'desc' => __('Use <span class="whols-available-placeholders-btn">Available Placeholders</span> to get dynamic content.', 'whols'),
            'default' => __('Hi {name},

Good news! Your wholesale account request for {site_title} has been approved.

You can now log in to access wholesale pricing and place orders:
Email: {email}
Password: The one you set during registration

Visit our store: {shop_url}

Welcome aboard!
{site_title}', 'whols'),
            'class' => 'whols-pro-field-opacity'
        ],

        // Account Rejection
        'enable_rejection_notification' => [
            'id' => 'enable_rejection_notification',
            'type' => 'switch',
            'title' => __('Enable', 'whols'),
            'label' => __('Yes', 'whols'),
            'help' => __('If Enabled, The registered wholesale customer will get an email if the wholesaler request is rejected.', 'whols'),
            'default' => '0',
            'class' => 'whols-pro-field-opacity'
        ],
        'rejection_email_subject' => [
            'id' => 'rejection_email_subject',
            'type' => 'text',
            'title' => __('Email Subject', 'whols'),
            'desc' => __('Use <span class="whols-available-placeholders-btn">Available Placeholders</span> to get dynamic content.', 'whols'),
            'default' => __('[{site_title}] Your Wholesale Account Request is Rejected', 'whols'),
            'class' => 'whols-pro-field-opacity'
        ],
        'rejection_email_message' => [
            'id' => 'rejection_email_message',
            'type' => 'wp_editor',
            'title' => __('Message', 'whols'),
            'label_position' => 'top',
            'desc' => __('Use <span class="whols-available-placeholders-btn">Available Placeholders</span> to get dynamic content.', 'whols'),
            'default' => __('Hi {name},

We\'re sorry to inform you that your wholesale account request for {site_title} has been rejected.

Please contact us for more information.

Regards,
{site_title}', 'whols'),
            'class' => 'whols-pro-field-opacity-none'
        ],
        'enable_conversation_new_message_for_user' => [
            'id' => 'enable_conversation_new_message_for_user',
            'type' => 'switch',
            'title' => __('Enable', 'whols'),
            'label' => __('Yes', 'whols'),
            'help' => __('If enabled, the customer will receive an email when a new message is sent to any conversation.', 'whols'),
            'default' => '0',
            'class' => 'whols-pro-field-opacity-none'
        ],
        'conversation_new_message_for_user_subject' => [
            'id' => 'conversation_new_message_for_user_subject',
            'type' => 'text',
            'title' => __('Email Subject', 'whols'),
            'help' => __('Specify the email subject.', 'whols'),
            'desc' => __('Use <span class="whols-available-placeholders-btn">Available Placeholders</span> to get dynamic content.', 'whols'),
            'default' => __('[{site_title}] New Message/Reply from {conversation_title} ', 'whols')
        ],
        'conversation_new_message_for_user_message' => [
            'id' => 'conversation_new_message_for_user_message',
            'type' => 'wp_editor',
            'title' => __('Message', 'whols'),
            'label_position' => 'top',
            'desc' => __('Use <span class="whols-available-placeholders-btn">Available Placeholders</span> to get dynamic content.', 'whols'),
            'default' => __('Hi {name},

You have a new message/reply from {conversation_title}.

Message: {message}

Regards,
{site_title}', 'whols')
        ],

        // Wallet Credit Notification
        'enable_wallet_credit_email' => [
            'id' => 'enable_wallet_credit_email',
            'type' => 'switch',
            'title' => __('Enable', 'whols'),
            'label' => __('Yes', 'whols'),
            'help' => __('If enabled, the customer will receive an email when their wallet is credited.', 'whols'),
            'default' => '0'
        ],
        'wallet_credit_email_subject' => [
            'id' => 'wallet_credit_email_subject',
            'type' => 'text',
            'title' => __('Email Subject', 'whols'),
            'desc' => __('Use <span class="whols-available-placeholders-btn">Available Placeholders</span> to get dynamic content.', 'whols'),
            'default' => '[{site_title}] Your wallet has been credited'
        ],
        'wallet_credit_email_message' => [
            'id' => 'wallet_credit_email_message',
            'type' => 'wp_editor',
            'title' => __('Message', 'whols'),
            'label_position' => 'top',
            'desc' => __('Use <span class="whols-available-placeholders-btn">Available Placeholders</span> to get dynamic content.', 'whols'),
            'default' => 'Hi {name},

Your wallet has been credited with {wallet_credit_amount}.

Thank you for using our service.

Regards,
{site_title}'
        ],
        
        // Wallet Debit Notification
        'enable_wallet_debit_email' => [
            'id' => 'enable_wallet_debit_email',
            'type' => 'switch',
            'title' => __('Enable', 'whols'),
            'label' => __('Yes', 'whols'),
            'help' => __('If enabled, the customer will receive an email when their wallet is debited.', 'whols'),
            'default' => '0'
        ],
        'wallet_debit_email_subject' => [
            'id' => 'wallet_debit_email_subject',
            'type' => 'text',
            'title' => __('Email Subject', 'whols'),
            'desc' => __('Use <span class="whols-available-placeholders-btn">Available Placeholders</span> to get dynamic content.', 'whols'),
            'default' => '[{site_title}] Your wallet has been debited'
        ],
        'wallet_debit_email_message' => [
            'id' => 'wallet_debit_email_message',
            'type' => 'wp_editor',
            'title' => __('Message', 'whols'),
            'label_position' => 'top',
            'desc' => __('Use <span class="whols-available-placeholders-btn">Available Placeholders</span> to get dynamic content.', 'whols'),
            'default' => 'Hi {name},

Your wallet has been debited with {wallet_debit_amount} for your recent purchase.

Thank you for using our service.

Regards,
{site_title}'
        ]
    ]
]];