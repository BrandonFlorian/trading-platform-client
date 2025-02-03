import { motion } from 'framer-motion';
export const SlideIn = ({
    children,
    direction = 'right'
}: {
    children: React.ReactNode;
    direction?: 'right' | 'left';
}) => (
    <motion.div
        initial={{ opacity: 0, x: direction === 'right' ? 50 : -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: direction === 'right' ? 50 : -50 }}
        transition={{ duration: 0.2 }}
    >
        {children}
    </motion.div>
); 