import React, { useState } from "react";
import { useNdk } from "nostr-hooks";
import { NDKEvent, NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
import { nip19 } from "nostr-tools";

const PostNostrNote: React.FC = () => {
    const [content, setContent] = useState("");
    const [nsec, setNsec] = useState("");
    const [status, setStatus] = useState("");
    const { ndk } = useNdk();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!ndk) {
            setStatus("Error: NDK not initialized");
            return;
        }

        try {
            // Extract private key from nsec
            const { data: privateKey } = nip19.decode(nsec);

            // Create a signer with the private key
            const signer = new NDKPrivateKeySigner(privateKey);
            ndk.signer = signer;

            // Create the event
            const event = new NDKEvent(ndk);
            event.kind = 1;
            event.content = content;

            // Sign and publish the event
            await event.sign();
            await event.publish();

            setStatus("Note published successfully!");
            setContent(""); // Clear content after successful post
        } catch (error) {
            setStatus(`Error: ${error.message}`);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Post a Nostr Note</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Your nsec key:
                    </label>
                    <input
                        type="password"
                        value={nsec}
                        onChange={(e) => setNsec(e.target.value)}
                        placeholder="nsec1..."
                        className="w-full p-2 border rounded-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Note Content:
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-2 border rounded-sm h-32 focus:ring-2 focus:ring-blue-500 outline-hidden"
                        placeholder="What's on your mind?"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-sm hover:bg-blue-600 transition-colors"
                >
                    Post Note
                </button>
            </form>

            {status && (
                <div
                    className={`mt-4 p-4 rounded ${
                        status.startsWith("Error")
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                    }`}
                >
                    {status}
                </div>
            )}
        </div>
    );
};

export default PostNostrNote;
