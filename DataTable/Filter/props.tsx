export type PropsType = {
  title?: string;
  options: string[];
  icon?: React.ReactElement;
  selectedValues: string[] | string;
  onChange?: (updatedValues: string[]) => void;
};
