import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const DeleteConfirmationModal = ({ isOpen, onClose, itemTitle, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
                            <ApperIcon name="AlertTriangle" className="w-5 h-5 text-error" />
                        </div>
                        <div>
                            <Text as="h3" className="font-heading font-semibold text-gray-900">Confirm Deletion</Text>
                            <Text className="text-sm text-gray-500">This action cannot be undone</Text>
                        </div>
                    </div>

                    <Text className="text-gray-600 mb-6">
                        Are you sure you want to delete "{itemTitle}"?
                    </Text>

                    <div className="flex gap-3 justify-end">
                        <Button
                            onClick={onClose}
                            className="text-gray-600 hover:text-gray-800 bg-transparent hover:bg-transparent"
                            animate={false}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onConfirm}
                            className="bg-error hover:bg-red-600"
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default DeleteConfirmationModal;