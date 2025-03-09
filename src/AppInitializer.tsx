import React, { useEffect, useState } from "react";
import { useAccountStore } from "@/stores/useAccountStore";
import { NDKNip07Signer } from "@nostr-dev-kit/ndk";
import { useNdk } from "nostr-hooks";
import { NDKService } from "@/services/ndkService.ts";
import { DEFAULT_RELAYS } from "@/lib/constants/defaultRelays.ts";
import useWindowState, {
    type WindowComponentRegistry,
    WindowTypes,
} from "./stores/useWindowState.ts";
import LoginWindow from "./layouts/windows/LoginWindow.tsx";

const AppInitializer: React.FC<{ children: React.ReactNode }> = (
    { children },
) => {
    const [isNdkReady, setNdkReady] = useState(false);

    /**
     * NDK initialization
     */
    const { initNdk, ndk } = useNdk();

    useEffect(() => {
        initNdk({
            explicitRelayUrls: DEFAULT_RELAYS,
            signer: new NDKNip07Signer(),
        });
    }, []);

    useEffect(() => {
        if (!ndk) return;
        new NDKService(ndk); // NDK instance for non-hook usage
        ndk.connect().then(() => {
            console.log("NDK connected and ready");
            setNdkReady(true);
        }).catch((err) => {
            console.error("Error connecting NDK:", err);
        });
    }, [ndk]);

    /**
     * Window state initialization and management
     */
    const { registerComponents } = useWindowState();

    useEffect(() => {
        const components: WindowComponentRegistry = {
            [WindowTypes.LOGIN]: LoginWindow,
        };
        registerComponents(components);
    }, [registerComponents]);

    const { isLoggedIn, fetchUser, user } = useAccountStore();

    /**
     * Account initialization - only after NDK is ready
     */
    useEffect(() => {
        const initialize = async () => {
            if (isNdkReady && isLoggedIn && !user) {
                console.log(
                    "NDK is ready. App initializing: Fetching user data",
                );
                try {
                    await fetchUser();
                } catch (error) {
                    console.error(
                        "Error fetching user during initialization:",
                        error,
                    );
                }
            }
        };

        initialize();
    }, [isNdkReady, isLoggedIn, fetchUser, user]);

    return <>{children}</>;
};

export default AppInitializer;
