import React, { useEffect } from "react";
import { useAccountStore } from "@/stores/useAccountStore";
import useWindowState, { WindowTypes } from "@/stores/useWindowState";

interface LoginLayoutProps {
    children: React.ReactNode;
}

export const useInitializeAuth = () => {
    const fetchUser = useAccountStore((state) => state.fetchUser);
    const isLoggedIn = useAccountStore((state) => state.isLoggedIn);

    React.useEffect(() => {
        if (isLoggedIn) {
            fetchUser();
        }
    }, [fetchUser, isLoggedIn]);
};

const LoginWindow: React.FC<LoginLayoutProps> = ({ children }) => {
    const { isLoggedIn, login } = useAccountStore();
    const { closeWindow } = useWindowState();

    useInitializeAuth();

    useEffect(() => {
        if (isLoggedIn) {
            closeWindow(WindowTypes.LOGIN);
        }
    }, [isLoggedIn, closeWindow]);

    if (!isLoggedIn) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                    <h1 className="text-2xl font-bold mb-4">
                        Lock-in with your Nostr Account
                    </h1>
                    <button
                        onClick={() =>
                            login().catch((err) =>
                                console.error("Login error:", err)
                            )}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-sm transition-colors"
                    >
                        Login with Nostr Signer Extension
                    </button>
                </div>
            </div>
        );
    }

    return <></>;
};

export default LoginWindow;
