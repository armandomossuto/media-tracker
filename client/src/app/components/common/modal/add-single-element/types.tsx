export type AddSingleElementProps = {
    message: string;
    onConfirmAction: Function;
    onSearchAction: Function;
    closeModal: Function;
    notification: string;
    showOptions?: boolean;
    ModalBody?: React.FunctionComponent;
}