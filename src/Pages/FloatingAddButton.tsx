import { PlusOutlined } from '@ant-design/icons';
import '../CSS/Progress.css';

export default function FloatingAddButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="floating-button" onClick={onClick} title="Add New">
      <PlusOutlined />
    </button>
  );
}
