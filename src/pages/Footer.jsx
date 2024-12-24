import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white mt-auto">
            <div className="container mx-auto py-6 px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p className="text-lg font-semibold">Campus Event Manager</p>
                        <p className="text-sm text-gray-400">© 2024 All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
