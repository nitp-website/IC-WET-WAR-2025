'use client';

import { motion, AnimatePresence } from 'framer-motion';

export default function ConfirmationDialog({ isOpen, onClose, onConfirm, title, message }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="relative p-5 border w-96 shadow-lg rounded-md bg-white"
          >
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">{message}</p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={onConfirm}
                  className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Confirm
                </button>
                <button
                  onClick={onClose}
                  className="mt-3 px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
