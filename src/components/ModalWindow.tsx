import { FC } from "react";
import { Modal } from "react-bootstrap";

interface ModalProps {
  title: string;
  body: string;
  footer: JSX.Element;
}

const ModalWindow: FC<ModalProps> = (props) => {
  const { title, body, footer } = props;

  return (
    <Modal.Dialog>
      <Modal.Header>
        <Modal.Title>
          <p className="title">{title}</p>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="text">{body}</p>
      </Modal.Body>

      <Modal.Footer>{footer}</Modal.Footer>
    </Modal.Dialog>
  );
};

export default ModalWindow;
