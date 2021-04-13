declare module "react-simpler-select" {
  interface Option {
    label: string;
    value: any;
    disabled?: boolean;
  }

  export interface SelectProps {
    className?: string;
    onChange: (value: any) => void;
    options: Option[];
    placeholder?: string;
    value?: any;
  }

  export default (props: SelectProps) => React.ReactNode;
}
