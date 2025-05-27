import Button from "./Button";
import Modal from "./Modal";

const InfoModal = (props) => {
  return (
    <Modal
      onCancel={props.onClear}
      header={props.title || "Info"}
      show={!!props.message}
      footer={<Button onClick={props.onClear}>Okay</Button>}
    >
      <p>{props.message}</p>
    </Modal>
  );
};

export default InfoModal;
