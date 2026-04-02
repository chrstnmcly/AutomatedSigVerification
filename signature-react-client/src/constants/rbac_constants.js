export const RBAC_DATA = {
    roles: [
        {
            role: "Super Admin",
            description: "System owner with unrestricted access.",
            permissions: [
                "user_create",
                "user_delete",
                "role_assignment",
                "view_audit_logs",
                "signature_override",
                "system_configuration",
                "view_all_transactions"
            ]
        },
        {
            role: "Security Manager",
            description: "Monitors fraud and manages signature logic.",
            permissions: [
                "view_flagged_signatures",
                "approve_manual_match",
                "reject_fraudulent_transaction",
                "view_confidence_reports",
                "blacklist_account"
            ]
        },
        {
            role: "Bank Teller",
            description: "Front-line staff handling customer transactions.",
            permissions: [
                "initiate_verification",
                "upload_transaction_signature",
                "view_verification_status",
                "read_basic_user_profile"
            ]
        },
        {
            role: "Compliance Officer",
            description: "Audit-focused role for regulatory oversight.",
            permissions: [
                "view_all_transactions",
                "export_reports",
                "view_audit_logs",
                "read_only_access"
            ]
        },
        {
            role: "Support Staff",
            description: "Handles non-sensitive account maintenance.",
            permissions: [
                "update_contact_info",
                "view_user_registration_status",
                "reset_password_request"
            ]
        }
    ]
};

// Helper to get all unique permissions if needed for multi-selects
export const ALL_PERMISSIONS = [...new Set(RBAC_DATA.roles.flatMap(r => r.permissions))];
