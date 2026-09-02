<div class="whols-wallet-tab-content">
    <div class="whols-wallet-top-content">
        <div class="whols-wallet-card whols-wallet-balance-card">
            <div class="whols-wallet-card-title"><?php echo esc_html__('Wallet Balance', 'whols') ?></div>
            <div class="whols-wallet-balance-amount"> <?php echo do_shortcode('[whols_wallet_balance]') ?></div>
        </div>
        
        <div class="whols-wallet-card whols-wallet-recharge-card">
            <div class="whols-wallet-card-title"><?php echo esc_html__('Recharge Wallet', 'whols') ?></div>
            <form class="whols-wallet-recharge-form">
                <input type="number" name="recharge_amount" class="whols-recharge-amount" placeholder="<?php echo esc_attr('Amount', 'whols') ?>" min="0">
                <input type="submit" value="<?php echo esc_html__('Recharge', 'whols') ?>">
            </form>
        </div>
    </div>

    <h3><?php echo esc_html__('Transections', 'whols') ?></h3>
    <?php 
        // Reuse the woocommerce account orders shortcode to display the wallet transactions
        $customer_orders = wc_get_orders(array(
            'customer' => get_current_user_id(),
            'meta_query' => array(
                array(
                    'key' => '_whols_transection_type',
                    'compare' => 'EXISTS'
                )
            )
        ));

        if( count($customer_orders) > 0 ){
            woocommerce_account_orders(1); 
        } else {
            // WC Notiece
            wc_print_notice(esc_html__('No transactions found', 'whols'), 'notice');
        }
    ?>
</div>