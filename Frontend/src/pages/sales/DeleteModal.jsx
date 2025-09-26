import axios from "axios";
import { IoIosWarning } from "react-icons/io";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DeleteModal({
  setActiveTab,
  activeTab,
  orderID,
  setVisible,
  orderNumber,
  onDeleteSuccess, // New prop for callback after successful deletion
  apiBaseUrl, // Better to pass API base URL as prop
}) {
  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: false,
  });

  const handleDelete = async () => {
    if (!orderID) {
      setStatus({
        loading: false,
        error: "No order ID provided",
        success: false,
      });
      return;
    }

    setStatus({
      loading: true,
      error: null,
      success: false,
    });

    try {
      const api = import.meta.env.VITE_SERVER_API_NAME;
      const res = await axios.post(`${api}/orders/${orderID}`);

      if (res.status === 200) {
        setStatus({
          loading: false,
          error: null,
          success: true,
        });

        // Call success callback if provided
        if (onDeleteSuccess) {
          onDeleteSuccess(orderID);
        }

        // Close modal after successful deletion
        setTimeout(() => {
          setVisible(false);
          setActiveTab("Sales");
        }, 1500);
      }
    } catch (error) {
      console.error("Delete error:", error);
      setStatus({
        loading: false,
        error: error.response?.data?.message || "Failed to delete order",
        success: false,
      });
    }
  };

  const handleCancel = () => {
    if (!status.loading) {
      setVisible(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !status.loading) {
      setVisible(false);
    }
  };

  // Success state
  if (status.success) {
    return (
      <div
        className="fixed inset-0 z-1000 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-200"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-lg mx-2 p-6 flex flex-col gap-5 items-center justify-center max-w-sm">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="flex flex-col justify-center text-center">
            <h3 className="font-semibold text-lg text-gray-900">Success!</h3>
            <p className="text-gray-600 mt-1">
              Order #{orderNumber} has been deleted successfully.
            </p>
          </div>
          <button
            onClick={() => {
              setVisible(false);
              setActiveTab("Dashboard");
            }}
            className="btn btn-md bg-green-500 hover:bg-green-600 text-white border-0 w-full transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-1000 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg mx-2 p-6 flex flex-col gap-5 items-center justify-center max-w-sm w-full">
        <div className="flex flex-col items-center">
          <IoIosWarning className="text-5xl text-red-500 mb-2" />
          <h3 className="font-semibold text-lg text-gray-900">Delete Order</h3>
        </div>

        <div className="flex flex-col justify-center text-center">
          <p className="text-gray-700">
            Are you sure you want to delete order{" "}
            <span className="font-semibold">#{orderNumber || "N/A"}</span>?
          </p>
          <p className="text-sm text-red-600 mt-2">
            This action cannot be undone.
          </p>
        </div>

        {/* Error message */}
        {status.error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 w-full">
            <p className="text-red-700 text-sm">{status.error}</p>
          </div>
        )}

        <div className="flex gap-3 w-full">
          <button
            onClick={handleCancel}
            disabled={status.loading}
            className="btn btn-md bg-gray-100 hover:bg-gray-200 border-0 text-gray-700 flex-1 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={status.loading}
            className="btn btn-md bg-red-500 hover:bg-red-600 border-0 text-white flex-1 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {status.loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
