"use client";

import type { PropsWithChildren } from "react";
import { X as CloseIcon, Menu02 } from "@untitledui/icons";
import {
    Button as AriaButton,
    Dialog as AriaDialog,
    DialogTrigger as AriaDialogTrigger,
    Modal as AriaModal,
    ModalOverlay as AriaModalOverlay,
} from "react-aria-components";
import { cx } from "@/utils/cx";

export default function Navbar({ children }: PropsWithChildren) {
    return (
        <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white p-3 pl-4">
            
            {/* 1. Der Trigger (Menü-Icon) steht jetzt oben im Code und rückt damit nach Links */}
            <AriaDialogTrigger>
                <AriaButton
                    aria-label="Expand navigation menu"
                    className="group relative flex items-center justify-center rounded-lg bg-white p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700 outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
                >
                    <Menu02 className="size-6 transition duration-200 ease-in-out group-aria-expanded:opacity-0" />
                    <CloseIcon className="absolute size-6 opacity-0 transition duration-200 ease-in-out group-aria-expanded:opacity-100" />
                </AriaButton>

                <AriaModalOverlay
                    isDismissable
                    className={({ isEntering, isExiting }) =>
                        cx(
                            "fixed inset-0 z-50 flex cursor-pointer bg-black/50 pr-16 backdrop-blur-sm",
                            isEntering && "duration-300 ease-in-out animate-in fade-in",
                            isExiting && "duration-200 ease-in-out animate-out fade-out",
                        )
                    }
                >
                    {({ state }) => (
                        <>
                            {/* 2. Hier ist die neue, saubere Slide-Animation eingefügt */}
                            <AriaModal 
                                className={({ isEntering, isExiting }) => cx(
                                    "h-full w-full max-w-sm cursor-auto bg-white shadow-xl will-change-transform",
                                    isEntering && "duration-300 ease-out animate-in slide-in-from-left-full",
                                    isExiting && "duration-200 ease-in animate-out slide-out-to-left-full"
                                )}
                            >
                                <AriaDialog className="h-dvh outline-none p-4">
                                    {children}
                                </AriaDialog>
                            </AriaModal>

                            {/* Der Schließen-Button (X) für den dunklen Hintergrund */}
                            <AriaButton
                                aria-label="Close navigation menu"
                                onPress={() => state.close()}
                                className="fixed top-2.5 right-3 flex cursor-pointer items-center justify-center rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-white"
                            >
                                <CloseIcon className="size-6" />
                            </AriaButton>
                        </>
                    )}
                </AriaModalOverlay>
            </AriaDialogTrigger>

            {/* 3. Der Titel steht jetzt unten im Code und rückt damit nach Rechts */}
            <a href="/"><h1 className="font-bold text-lg text-gray-900 pr-2">Expense Tracker</h1></a>

        </header>
    );
}
