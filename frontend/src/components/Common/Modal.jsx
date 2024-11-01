import React from "react";
import { Modal, Button } from "react-bootstrap";
import PropTypes from "prop-types";

const ModalCustom = ({
  show,
  handleClose,
  title,
  bodyContent,
  footerContent,
}) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{bodyContent}</Modal.Body>
      <Modal.Footer>
        {footerContent ? (
          footerContent
        ) : (
          <>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

ModalCustom.propTypes = {
  show: PropTypes.bool.isRequired, // Trạng thái hiển thị modal (đóng/mở)
  handleClose: PropTypes.func.isRequired, // Hàm đóng modal
  title: PropTypes.string, // Tiêu đề của modal
  bodyContent: PropTypes.node, // Nội dung của modal (jsx hoặc chuỗi)
  footerContent: PropTypes.node, // Nội dung cho phần footer của modal (nút tùy chỉnh)
};

ModalCustom.defaultProps = {
  title: "Default Title", // Tiêu đề mặc định
  bodyContent: "This is the default body content.", // Nội dung mặc định cho body
  footerContent: null, // Footer mặc định (sẽ dùng nút close và save mặc định)
};

export default ModalCustom;
