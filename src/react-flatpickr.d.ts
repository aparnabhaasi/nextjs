declare module "react-flatpickr" {
    import { FC } from "react";
    import { Instance } from "flatpickr";
  
    interface FlatpickrProps {
      className?: string;
      value?: Date | Date[] | string;
      options?: Record<string, any>;
      placeholder?: string;
      onChange?: (selectedDates: Date[], dateStr: string, instance: Instance) => void;
    }
  
    const Flatpickr: FC<FlatpickrProps>;
    export default Flatpickr;
  }
  