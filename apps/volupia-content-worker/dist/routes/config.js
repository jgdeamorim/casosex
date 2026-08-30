import { Hono } from "hono";
export const configRouter = new Hono();
// Healthcheck endpoints
configRouter.get("/health", (c) => c.json({ status: "ok" }));
configRouter.get("/health_check", (c) => c.json({ status: "ok" }));
// Config endpoint - Full ConfigResponse (authenticated / cockpit parity)
configRouter.get("/config", (c) => {
    return c.json({
        type: "full",
        version: "1.0.0",
        package: "volupia-v8-content-engine",
        auto_saving: true,
        auto_saving_interval: 2,
        health_check_max_retries: 5,
        max_file_size_upload: 100,
        frontend_timeout: 30,
        a2a_enabled: true,
        agentic_experience: true,
        allow_custom_components: true,
        substitute_outdated_component_code: true,
        catalog_governance_enabled: false,
        mcp_base_url: "",
        enable_extension_reload: true,
        event_delivery: "streaming",
        voice_mode_available: true,
        feature_flags: {},
        webhook_polling_interval: 5,
        serialization_max_items_length: 50,
        webhook_auth_enable: true,
        default_folder_name: "Volúpia Social Engine",
        hide_getting_started_progress: false,
        embedded_mode: false,
        hide_logout_button: false,
        hide_new_project_button: false,
        hide_new_flow_button: false,
        hide_starter_projects: false,
        mcp_servers_locked: false,
        custom_component_admin_only: false,
        assistant_max_message_length: 4000,
        local_vector_store_available: true,
        blocked_component_types: [],
    });
});
// Version endpoint
configRouter.get("/version", (c) => {
    return c.json({
        version: "1.0.0",
        package: "volupia-v8-content-engine",
    });
});
