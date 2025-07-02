export type ActionMenuItem = {
  label: string;
  onAction: () => void;
  icon?: React.ReactNode;
  variant?: "default" | "danger";
};
