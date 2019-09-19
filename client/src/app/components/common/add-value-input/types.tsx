export type AddValueInputParams = {
  onAddValue: Function;
  showButton?: boolean;
  targetName?: string;
  type?: string;
}

export type ShowButtonParams = {
  showInput: Function;
}

export type InputParams = {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  onAddValue: Function;
  hideInput: Function;
  type: string;
}