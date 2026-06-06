module vyom_registry::registry {
    use std::string::{Self, String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::TxContext;

    public struct Project has key {
        id: UID,
        name: String,
        description: String,
    }

    fun init(ctx: &mut TxContext) {
        let project = Project {
            id: object::new(ctx),
            name: string::utf8(b"Vyom"),
            description: string::utf8(b"Sealed capsules with time-locked and Sui wallet-gated reveal."),
        };

        transfer::share_object(project);
    }
}