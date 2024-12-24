//import React from 'react';

export default function HomePage() {
    return (
        <>
            <div className="min-h-screen bg-gray-100">
                <div className="container mx-auto p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Welcome Card */}
                        <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition duration-300">
                            <h2 className="text-2xl font-bold text-red-600 mb-4">
                                Welcome to Campus EMS
                            </h2>
                            <p className="text-gray-600">
                                Your one-stop platform for managing and discovering campus events.
                            </p>
                        </div>

                        {/* Events Card */}
                        <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition duration-300">
                            <h2 className="text-2xl font-bold text-red-600 mb-4">
                                Manage Events
                            </h2>
                            <p className="text-gray-600">
                                Create, view, and RSVP to events happening around campus.
                            </p>
                        </div>

                        {/* Calendar Card */}
                        <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition duration-300">
                            <h2 className="text-2xl font-bold text-red-600 mb-4">
                                Stay Updated
                            </h2>
                            <p className="text-gray-600">
                                Access our calendar to keep track of upcoming events and activities.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
