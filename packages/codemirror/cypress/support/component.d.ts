// Type definitions for Cypress component testing mount command
import { MountOptions, MountReturn } from "cypress/react";
import React from "react";

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Mounts a React component for component testing
             * @param component - The React component to mount
             * @param options - Optional mount options (including DOM container options)
             * @returns Chainable with MountReturn for command chaining
             * @example
             * cy.mount(<MyComponent prop="value" />)
             * cy.mount(<MyComponent />, { viewport: [800, 600] })
             */
            mount(
                component: React.ReactNode,
                options?: MountOptions,
            ): Chainable<MountReturn>;
        }
    }
}

export {};
