import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-main flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-md"
            >
                <motion.div
                    animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3
                    }}
                    className="mb-8"
                >
                    <ApperIcon name="FileQuestion" className="w-24 h-24 text-gray-300 mx-auto" />
                </motion.div>

                <Text as="h1" className="text-6xl font-heading font-bold text-primary mb-4">404</Text>
                <Text as="h2" className="text-2xl font-heading font-semibold text-gray-900 mb-4">
                    Page Not Found
                </Text>
                <Text className="text-gray-600 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </Text>

                <Button
                    onClick={() => navigate('/')}
                    className="bg-primary hover:bg-secondary inline-flex items-center gap-2"
                >
                    <ApperIcon name="Home" size={20} />
                    Back to Tasks
                </Button>
            </motion.div>
        </div>
    );
}