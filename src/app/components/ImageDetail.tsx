// components/ImageDetail.tsx
import React from "react";
import { Modal } from "antd";
import Image from "next/image";

type ImageDetailProps = {
  imageUrl: string;
  onClose: () => void;
};

const ImageDetail: React.FC<ImageDetailProps> = ({ imageUrl, onClose }) => {
  return (
    <Modal open={true} onCancel={onClose} footer={null}>
      <Image
        src={imageUrl}
        alt="Detail"
        layout="responsive"
        width={800}
        height={600}
      />
    </Modal>
  );
};

export default ImageDetail;
