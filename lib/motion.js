export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

export const drawerSlide = {
  closed: { x: '100%' },
  open: {
    x: 0,
    transition: { type: 'spring', stiffness: 360, damping: 36 },
  },
};
