import { useState } from 'react';
import axios from 'axios';

const DeleteEvent = ({ eventId, onDelete }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    try {
      await axios.delete(`https://campus-backend-oxyd.onrender.com/events/${eventId}`);
      setShowConfirmation(false);
      // Callback to parent component to update the events list
      onDelete(eventId);
    } catch (err) {
      setError('Failed to delete event. Please try again.');
      console.error('Error deleting event:', err);
    }
  };

  return (
    <div>
      {!showConfirmation ? (
        <button
          onClick={() => setShowConfirmation(true)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete Event
        </button>
      ) : (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this event?</p>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteEvent;
