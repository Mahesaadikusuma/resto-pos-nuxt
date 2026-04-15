export const useDashboardSidebar = () => {
  const isOpen = useState<boolean>("dashboard-sidebar", () => false);

  const open = () => (isOpen.value = true);
  const close = () => (isOpen.value = false);
  const toggleSidebar = () => (isOpen.value = !isOpen.value);

  return {
    isOpen,
    open,
    close,
    toggleSidebar,
  };
};
